import React, { Component } from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');
import InitialLoader from '../addons/InitialLoader';

var _ = require('lodash');

export default class DropdownList extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			items: [],
			value: '',
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		this.selectAll = false;
		this.channelId = null;
		this.channelListener = null;
		this.previousSelectedSensor = {};
		this.defaultSelected = this.props.defaultSelected;
		this.handleChange = this.handleChange.bind(this);
		this.type = this.props.multipleSelect ? 'Terms' : 'Term';
		this.customQuery = this.customQuery.bind(this);
		this.renderOption = this.renderOption.bind(this);
	}

	// Get the items from Appbase when component is mounted
	componentDidMount() {
		this.setQueryInfo();
		this.createChannel();
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (this.props.multipleSelect) {
				if (!_.isEqual(this.defaultSelected, this.props.defaultSelected)) {
					this.defaultSelected = this.props.defaultSelected;
					let records = this.state.items.filter((record) => {
						return this.defaultSelected.indexOf(record.value) > -1 ? true : false;
					});
					if (records.length) {
						setTimeout(this.handleChange.bind(this, records), 1000);
					}
				}
			} else {
				if (this.defaultSelected != this.props.defaultSelected) {
					this.defaultSelected = this.props.defaultSelected;
					let records = this.state.items.filter((record) => {
						return record.value === this.defaultSelected;
					});
					if (records.length) {
						setTimeout(this.handleChange.bind(this, records), 1000);
					}
				}
			}
			if (this.sortBy !== this.props.sortBy) {
				this.sortBy = this.props.sortBy;
				this.handleSortSelect();
			}
			if (this.size !== this.props.size) {
				this.size = this.props.size;
				this.removeChannel();
				this.createChannel();
			}
		}, 300);
	}

	componentWillReceiveProps(nextProps) {
		let items = this.state.items;
		if (nextProps.selectAllLabel != this.props.selectAllLabel) {
			if (this.props.selectAllLabel) {
				items.shift();
			}
			items.unshift({ label: nextProps.selectAllLabel, value: nextProps.selectAllLabel });
			this.setState({
				items: items
			});
		}
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		this.removeChannel();
	}

	removeChannel() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if (this.loadListener) {
			this.loadListener.remove();
		}
	}

	// build query for this sensor only
	customQuery(value) {
		if (this.selectAll) {
			return {
				"exists": {
					'field': [this.props.appbaseField]
				}
			};
		} else if (value) {
			return {
				[this.type]: {
					[this.props.appbaseField]: value
				}
			};
		}
	}

	// set the query type and input data
	setQueryInfo() {
		var obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	includeAggQuery() {
		var obj = {
			key: this.props.componentId + '-sort',
			value: this.sortObj
		};
		helper.selectedSensor.setSortInfo(obj);
	}

	handleSortSelect() {
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		let obj = {
			key: this.props.componentId + '-sort',
			value: this.sortObj
		};
		helper.selectedSensor.set(obj, true, 'sortChange');
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		// Set the react - add self aggs query as well with react
		let react = this.props.react ? this.props.react : {};
		react['aggs'] = {
			key: this.props.appbaseField,
			sort: this.props.sortBy,
			size: this.props.size,
			sortRef: this.props.componentId + '-sort'
		};
		if (react && react.and && typeof react.and === 'string') {
			react.and = [react.and];
		} else {
			react.and = react.and ? react.and : [];
		}
		react.and.push(this.props.componentId + '-sort');
		this.includeAggQuery();
		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function(res) {
			if (res.error) {
				this.setState({
					queryStart: false
				});
			}
			if (res.appliedQuery) {
				let data = res.data;
				let rawData;
				if (res.mode === 'streaming') {
					rawData = this.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === 'historic') {
					rawData = data;
				}
				this.setState({
					queryStart: false,
					rawData: rawData
				});
				this.setData(rawData);
			}
		}.bind(this));
		this.listenLoadingChannel(channelObj);
	}

	listenLoadingChannel(channelObj) {
		this.loadListener = channelObj.emitter.addListener(channelObj.channelId + '-query', function(res) {
			if (res.appliedQuery) {
				this.setState({
					queryStart: res.queryState
				});
			}
		}.bind(this));
	}

	setData(data) {
		if (data.aggregations && data.aggregations[this.props.appbaseField] && data.aggregations[this.props.appbaseField].buckets) {
			this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
		}
	}

	renderOption(option) {
		return (
			<span key={option.value}>{option.value} {this.props.showCount && option.count ? (<span className="rbc-count">{option.count}</span>) : null}</span>
		)
	}

	addItemsToList(newItems) {
		newItems = newItems.map((item) => {
			item.label = item.key.toString();
			item.value = item.key.toString();
			item.count = null;
			if (this.props.showCount) {
				item.count = item.doc_count
			}
			return item
		});
		if (this.props.selectAllLabel) {
			newItems.unshift({ label: this.props.selectAllLabel, value: this.props.selectAllLabel });
		}
		this.setState({
			items: newItems
		});
		if (this.defaultSelected) {
			if (this.props.multipleSelect) {
				let records = this.state.items.filter((record) => {
					return this.defaultSelected.indexOf(record.value) > -1 ? true : false;
				});
				if (records.length) {
					this.handleChange(records);
				}
			} else {
				let records = this.state.items.filter((record) => {
					return record.value === this.defaultSelected;
				});
				if (records.length) {
					this.handleChange(records[0]);
				}
			}
		}
	}

	// Handler function when a value is selected
	handleChange(value) {
		let result;
		this.selectAll = false;
		if (this.props.multipleSelect) {
			result = [];
			value.map(item => {
				result.push(item.value);
			});
			if (this.props.selectAllLabel && (result.indexOf(this.props.selectAllLabel) > -1)) {
				result = this.props.selectAllLabel;
				this.selectAll = true;
			} else {
				result = result.join();
			}
		} else {
			result = value.value;
			if (this.props.selectAllLabel && result == this.props.selectAllLabel) {
				this.selectAll = true;
			}
		}
		this.setState({
			value: result
		});
		this.setValue(result, true);
	}

	// set value
	setValue(value, isExecuteQuery = false) {
		if (this.props.multipleSelect) {
			value = value.split(',');
		}
		var obj = {
			key: this.props.componentId,
			value: value
		};
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	render() {
		// Checking if component is single select or multiple select
		let title = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		let cx = classNames({
			'rbc-title-active': this.props.title,
			'rbc-title-inactive': !this.props.title,
			'rbc-placeholder-active': this.props.placeholder,
			'rbc-placeholder-inactive': !this.props.placeholder,
			'rbc-multidropdownlist': this.props.multipleSelect,
			'rbc-singledropdownlist': !this.props.multipleSelect,
			'rbc-count-active': this.props.showCount,
			'rbc-count-inactive': !this.props.showCount
		});

		return (
			<div className={`rbc col s12 col-xs-12 card thumbnail ${cx}`}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12">
						{this.state.items.length ?
							<Select
								options={this.state.items}
								clearable={false}
								value={this.state.value}
								onChange={this.handleChange}
								multi={this.props.multipleSelect}
								cache={false}
								placeholder={this.props.placeholder}
								optionRenderer={this.renderOption}
								searchable={true} /> : null }
					</div>
				</div>
				{this.props.initialLoader.show ? (<InitialLoader defaultText={this.props.initialLoader.text} queryState={this.state.queryStart}></InitialLoader>) : null}
			</div>
		);
	}
}

DropdownList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	size: helper.sizeValidation,
	multipleSelect: React.PropTypes.bool,
	showCount: React.PropTypes.bool,
	sortBy: React.PropTypes.oneOf(['asc', 'desc', 'count']),
	placeholder: React.PropTypes.string,
	selectAllLabel: React.PropTypes.string,
	initialLoader: React.PropTypes.shape({
		show: React.PropTypes.bool,
		text: React.PropTypes.string
	}),
	defaultSelected: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.array
	]),
	customQuery: React.PropTypes.func,
	react: React.PropTypes.object
};

// Default props value
DropdownList.defaultProps = {
	showCount: true,
	sortBy: 'count',
	size: 100,
	title: null,
	placeholder: 'Select...',
	selectAllLabel: null,
	initialLoader: {
		show: true
	}
};

// context type
DropdownList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
