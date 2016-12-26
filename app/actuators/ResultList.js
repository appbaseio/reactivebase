import {default as React, Component} from 'react';
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
		this.sortInfo = {
			order: this.props.sortBy
		};
		this.nextPage = this.nextPage.bind(this);
		this.appliedQuery = {};
	}

	componentDidMount() {
		this.createChannel();
		this.listComponent();
	}

	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		// Set the depends - add self aggs query as well with depends
		let depends = this.props.depends ? this.props.depends : {};
		this.enableSort(depends);
		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, depends, this.props.size, this.props.from);
		this.channelId = channelObj.channelId;
		channelObj.emitter.addListener(channelObj.channelId, function(res) {
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
		}.bind(this));
	}

	// normalize current data
	normalizeCurrentData(res, rawData, newData) {
		let appliedQuery = JSON.parse(JSON.stringify(res.appliedQuery));
		delete appliedQuery.body.from;
		delete appliedQuery.body.size;
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
		depends['ResultSort'] = { operation: "must" };
		let sortObj = {
			key: "ResultSort",
			value: {
				[this.props.appbaseField]: {
					'order': this.props.sortBy
				}
			}
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

	render() {
		let title = null,
			titleExists = false;
		if(this.props.title) {
			titleExists = true;
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		return (
			<div ref="ListContainer" className={`rbc rbc-resultlist card thumbnail title-${titleExists}`} style={this.props.containerStyle}>
				{title}
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
	from: React.PropTypes.number,
	onData: React.PropTypes.func,
	size: React.PropTypes.number,
	requestOnScroll: React.PropTypes.bool,
	containerStyle: React.PropTypes.any
};

ResultList.defaultProps = {
	from: 0,
	size: 20,
	requestOnScroll: true,
	containerStyle: {
		height: '700px',
		overflow: 'auto'
	}
};

// context type
ResultList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
