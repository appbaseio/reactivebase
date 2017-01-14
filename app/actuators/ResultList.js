import {default as React, Component} from 'react';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
import JsonPrint from './component/JsonPrint'
var helper = require('../middleware/helper.js');
var $ = require('jquery');

export class ResultList extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			markers: [],
			query: {},
			rawData:  [],
			resultMarkup: []
		};
		if (this.props.sortOptions) {
			let obj = this.props.sortOptions[0];
			this.sortObj = {
				[obj.appbaseField]: {
					order: obj.sortBy
				}
			}
		} else if (this.props.sortBy) {
			this.sortObj = {
				[this.props.appbaseField] : {
					order: this.props.sortBy
				}
			};
		}
		this.resultSortKey = 'ResultSort';
		this.channelId = null;
		this.channelListener = null;
		this.queryStartTime = 0;
		this.handleSortSelect = this.handleSortSelect.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.appliedQuery = {};
	}

	componentDidMount() {
		this.createChannel();
		if (this.props.requestOnScroll) {
			this.listComponent();
		}
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		if(this.channelId) {
			manager.stopStream(this.channelId);
		}
		if(this.channelListener) {
			this.channelListener.remove();
		}
	}

	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		// Set the depends - add self aggs query as well with depends
		let depends = this.props.depends ? this.props.depends : {};
		if (this.sortObj) {
			this.enableSort(depends);
		}
		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, depends, this.props.size, this.props.from);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function(res) {
			// implementation to prevent initialize query issue if old query response is late then the newer query
			// then we will consider the response of new query and prevent to apply changes for old query response.
			// if queryStartTime of channel response is greater than the previous one only then apply changes
			if(res.mode === 'historic' && res.startTime > this.queryStartTime) {
				this.afterChannelResponse(res);
			} else if(res.mode === 'stream') {
				this.afterChannelResponse(res);
			}
		}.bind(this));
	}

	afterChannelResponse(res) {
		let data = res.data;
		let rawData, markersData, newData = [], currentData = [];
		this.streamFlag = false;
		if (res.mode === 'streaming') {
			this.channelMethod = 'streaming';
			let modData = this.streamDataModify(this.state.rawData, res);
			rawData = modData.rawData;
			newData = res;
			currentData = this.state.rawData;
			res = modData.res;
			this.streamFlag = true;
			markersData = this.setMarkersData(rawData);
		} else if (res.mode === 'historic') {
			this.queryStartTime = res.startTime;
			this.channelMethod = 'historic';
			newData = res.data.hits && res.data.hits.hits ? res.data.hits.hits : [];
			let normalizeCurrentData = this.normalizeCurrentData(res, this.state.rawData, newData);
			newData = normalizeCurrentData.newData;
			currentData = normalizeCurrentData.currentData;
			rawData = currentData.concat(newData);
		}
		this.setState({
			rawData: rawData,
			newData: newData,
			currentData: currentData,
			markersData: markersData
		}, function() {
			// Pass the historic or streaming data in index method
			res.allMarkers = rawData;
			let modifiedData = JSON.parse(JSON.stringify(res));
			modifiedData.newData = this.state.newData;
			modifiedData.currentData = this.state.currentData;
			delete modifiedData.data;
			let generatedData = this.props.onData ? this.props.onData(modifiedData) : this.defaultonData(res);
			this.setState({
				resultMarkup: generatedData
			});
			if (this.streamFlag) {
				this.streamMarkerInterval();
			}
		}.bind(this));
	}

	// normalize current data
	normalizeCurrentData(res, rawData, newData) {
		let appliedQuery = JSON.parse(JSON.stringify(res.appliedQuery));
		if(this.props.requestOnScroll) {
			delete appliedQuery.body.from;
			delete appliedQuery.body.size;
		}
		let currentData = JSON.stringify(appliedQuery) === JSON.stringify(this.appliedQuery) ? rawData : [];
		if(!currentData.length) {
			this.appliedQuery = appliedQuery;
		} else {
			newData = newData.filter((newRecord) => {
				let notExits = true;
				currentData.forEach((oldRecord) => {
					if(newRecord._id+'-'+newRecord._type === oldRecord._id+'-'+oldRecord._type) {
						notExits = false;
					}
				});
				return notExits;
			});
		}
		return {
			currentData: currentData,
			newData: newData
		};
	}

	// enable sort
	enableSort(depends) {
		depends[this.resultSortKey] = { operation: "must" };
		let sortObj = {
			key: this.resultSortKey,
			value: this.sortObj
		};
		helper.selectedSensor.setSortInfo(sortObj);
	}

	// append data if pagination is applied
	appendData(data) {
		let rawData = this.state.rawData;
		let hits = rawData.hits.hits.concat(data.hits.hits);
		rawData.hits.hits = _.uniqBy(hits, '_id');;
		return rawData;
	}

	// append stream boolean flag and also start time of stream
	streamDataModify(rawData, res) {
		if (res.data) {
			res.data.stream = true;
			res.data.streamStart = new Date();
			if (res.data._deleted) {
				let hits = rawData.hits.hits.filter((hit) => {
					return hit._id !== res.data._id;
				});
				rawData.hits.hits = hits;
			} else {
				let prevData = rawData.hits.hits.filter((hit) => {
					return hit._id === res.data._id;
				});
				let hits = rawData.hits.hits.filter((hit) => {
					return hit._id !== res.data._id;
				});
				rawData.hits.hits = hits;
				rawData.hits.hits.push(res.data);
			}
		}
		return {
			rawData: rawData,
			res: res,
			streamFlag: true
		};
	}

	// tranform the raw data to marker data
	setMarkersData(hits) {
		var self = this;
		if (hits) {
			return hits;
		} else {
			return [];
		}
	}

	// default markup
	defaultonData(res) {
		let result;
		if (res.allMarkers) {
			result = res.allMarkers.map((marker, index) => {
				return (
					<div
						key={index}
						style={{'borderBottom': '1px solid #eee', 'padding': '12px'}}
						className="makerInfo">
							<JsonPrint data={marker._source} />
					</div>
				);
			});
		}
		result = (
			<div className="row" style={{'marginTop': '60px'}}>
				{result}
			</div>
		)
		return result;
	}

	nextPage() {
		let channelOptionsObj = manager.channels[this.channelId].previousSelectedSensor['channel-options-' + this.channelId];
		let obj = {
			key: 'channel-options-' + this.channelId,
			value: {
				size: this.props.size,
				from: channelOptionsObj.from + this.props.size
			}
		};
		manager.nextPage(this.channelId);
	}

	listComponent() {
		let node = this.refs.ListContainer;
		if (node) {
			node.addEventListener('scroll', () => {
				if ($(node).scrollTop() + $(node).innerHeight() >= node.scrollHeight) {
					this.nextPage();
				}
			});
		}
	}

	handleSortSelect(event) {
		let index = event.target.value;
		this.sortObj = {
			[this.props.sortOptions[index]['appbaseField']]: {
				order: this.props.sortOptions[index]['sortBy']
			}
		};
		let obj = {
			key: this.resultSortKey,
			value: this.sortObj
		};
		helper.selectedSensor.set(obj, true, 'sortChange');
	}

	render() {
		let title = null, sortOptions = null;
		let cx = classNames({
			'rbc-title-active': this.props.title,
			'rbc-title-inactive': !this.props.title,
			'rbc-sort-active': this.props.sortOptions,
			'rbc-sort-inactive': !this.props.sortOptions
		});

		if(this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		if (this.props.sortOptions) {
			let options = this.props.sortOptions.map((item, index) => {
				return <option value={index} key={index}>{item.label}</option>;
			});

			sortOptions = (
				<div className="rbc-sortoptions input-field col">
					<select className="browser-default form-control" onChange={this.handleSortSelect}>
						{options}
					</select>
				</div>
			)
		}

		return (
			<div ref="ListContainer" className={`rbc rbc-resultlist card thumbnail ${cx}`}>
				{title}
				{sortOptions}
				{this.state.resultMarkup}
			</div >
		)
	}
}

ResultList.propTypes = {
	sensorId: React.PropTypes.string,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.string,
	sortBy: React.PropTypes.string,
	sortOptions: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			label: React.PropTypes.string,
			field: React.PropTypes.string,
			order: React.PropTypes.string,
		})
	),
	from: React.PropTypes.number,
	onData: React.PropTypes.func,
	size: React.PropTypes.number,
	requestOnScroll: React.PropTypes.bool
};

ResultList.defaultProps = {
	from: 0,
	size: 20,
	requestOnScroll: true
};

// context type
ResultList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
