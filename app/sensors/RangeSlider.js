import { default as React, Component } from 'react';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
import { HistoGramComponent } from './component/HistoGram.js';
import Slider from 'rc-slider';
import { InitialLoader } from './InitialLoader';
var helper = require('../middleware/helper.js');
var _ = require('lodash');
import * as TYPES from '../middleware/constants.js';

export class RangeSlider extends Component {
	constructor(props, context) {
		super(props);
		let startThreshold = this.props.range.start ? this.props.range.start : 0;
		let endThreshold = this.props.range.end ? this.props.range.end : 5;
		let values = {};
		values.min = this.props.defaultSelected.start < startThreshold ? startThreshold : this.props.defaultSelected.start;
		values.max = this.props.defaultSelected.end < endThreshold ? this.props.defaultSelected.end :  endThreshold;
		this.state = {
			values: values,
			startThreshold: startThreshold,
			endThreshold: endThreshold,
			currentValues: [],
			counts: [],
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		this.maxSize = 100;
		this.type = 'range';
		this.channelId = null;
		this.channelListener = null;
		this.handleValuesChange = this.handleValuesChange.bind(this);
		this.handleResults = this.handleResults.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Get the items from Appbase when component is mounted
	componentDidMount() {
		this.setQueryInfo();
		this.createChannel();
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		if(this.channelId) {
			manager.stopStream(this.channelId);
		}
		if(this.channelListener) {
			this.channelListener.remove();
		}
		if(this.loadListener) {
			this.loadListener.remove();
		}
	}

	componentWillReceiveProps(nextProps) {
		setTimeout(() => {
			// check defaultSelected
			if (nextProps.defaultSelected.start !== this.state.values.min ||
				nextProps.defaultSelected.end !== this.state.values.max &&
				nextProps.range.start <= nextProps.defaultSelected.start &&
				nextProps.range.end >= nextProps.defaultSelected.end) {
				let rem = (nextProps.defaultSelected.end - nextProps.defaultSelected.start) % nextProps.stepValue;
				if (rem) {
					this.setState({
						values: {
							min: this.state.values.min,
							max: nextProps.defaultSelected.end - rem
						}
					});
					var obj = {
						key: this.props.componentId,
						value: {
							from: this.state.values.min,
							to: nextProps.defaultSelected.end - rem
						}
					};
					setTimeout(() => {
						helper.selectedSensor.set(obj, true);
					}, 1000);
				} else {
					let values = {};
					values.min = nextProps.defaultSelected.start;
					values.max = nextProps.defaultSelected.end;
					this.setState({
						values: values,
						currentValues: values
					});
					var obj = {
						key: this.props.componentId,
						value: {
							from: values.min,
							to: values.max
						}
					};
					setTimeout(() => {
						helper.selectedSensor.set(obj, true);
					}, 1000);
				}
			}
			// check range
			if (nextProps.range.start !== this.state.startThreshold ||
				nextProps.range.end !== this.state.endThreshold ) {
				if (nextProps.range.start <= nextProps.defaultSelected.start &&
					nextProps.range.end >= nextProps.defaultSelected.end) {
					this.setState({
						startThreshold: nextProps.range.start,
						endThreshold: nextProps.range.end
					});
				} else {
					let values = {
						min: this.state.values.min,
						max: this.state.values.max
					};
					if (this.state.values.min < nextProps.range.start) {
						values.min = nextProps.range.start;
					}
					if (this.state.values.max > nextProps.range.end) {
						values.max = nextProps.range.end;
					}
					this.setState({
						startThreshold: nextProps.range.start,
						endThreshold: nextProps.range.end,
						values: values
					});
					var currentRange = {
						from: values.min,
						to: values.max
					};
					var obj = {
						key: this.props.componentId,
						value: currentRange
					};
					helper.selectedSensor.set(obj, true);
				}
				this.setRangeValue();
			}
			// drop value if it exceeds the threshold (based on step value)
			if (nextProps.stepValue !== this.props.stepValue) {
				let rem = (nextProps.defaultSelected.end - nextProps.defaultSelected.start) % nextProps.stepValue;
				if (rem) {
					this.setState({
						values: {
							min: this.state.values.min,
							max: nextProps.defaultSelected.end - rem
						}
					});
					var obj = {
						key: this.props.componentId,
						value: {
							from: this.state.values.min,
							to: nextProps.defaultSelected.end - rem
						}
					};
					helper.selectedSensor.set(obj, true);
				}
			}
		}, 300);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if ((nextProps.stepValue <= 0) ||
			(nextProps.stepValue > Math.floor((nextProps['range']['end'] - nextProps['range']['start'])/2))) {
			console.error(`Step value is invalid, it should be less than or equal to ${Math.floor((nextProps['range']['end'] - nextProps['range']['start'])/2)}.`);
			return false;
		} else if (nextState.values.max > nextState.endThreshold) {
			return false;
		} else {
			return true;
		}
	}

	// Handle function when value slider option is changing
	handleValuesChange(component, values) {
		this.setState({
			values: values
		});
	}

	// set the query type and input data
	setQueryInfo() {
		var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField
				}
		};
		var obj1 = {
				key: this.props.componentId+'-internal',
				value: {
					queryType: 'range',
					inputData: this.props.appbaseField,
					customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
				}
		};
		helper.selectedSensor.setSensorInfo(obj);
		helper.selectedSensor.setSensorInfo(obj1);
		this.setRangeValue();
	}

	setRangeValue() {
		var objValue = {
			key: this.props.componentId+'-internal',
			value: this.props.range
		};
		helper.selectedSensor.set(objValue, true);
	}

	customQuery(record) {
		if(record) {
			return {
				range: {
						[this.props.appbaseField]: {
							gte: record.start,
							lte: record.end,
							boost: 2.0
					}
				}
			};
		}
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		// Set the react - add self aggs query as well with react
		let react = this.props.react ? this.props.react : {};
		react['aggs'] = {
			key: this.props.appbaseField,
			sort: 'asc',
			size: 1000
		};
		if(react && react.and && typeof react.and === 'string') {
			react.and = [react.and];
		} else {
			react.and = react.and ? react.and : [];
		}
		react.and.push(this.props.componentId+'-internal');
		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function(res) {
			if(res.error) {
				this.setState({
					queryStart: false
				});
			} 
			if(res.appliedQuery) {
				let data = res.data;
				let rawData;
				if(res.mode === 'streaming') {
					rawData = this.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if(res.mode === 'historic') {
					rawData = data;
				}
				this.setState({
					queryStart: false,
					rawData: rawData
				});
				this.setData(data);
			}
		}.bind(this));
		this.listenLoadingChannel(channelObj);
	}

	listenLoadingChannel(channelObj) {
		this.loadListener = channelObj.emitter.addListener(channelObj.channelId+'-query', function(res) {
			if(res.appliedQuery) {
				this.setState({
					queryStart: res.queryState
				});
			}
		}.bind(this));
	}

	getSize() {
		return Math.min(this.props.range.end - this.props.range.start, this.maxSize);
	}

	setData(data) {
		try {
			this.addItemsToList(eval(`data.aggregations["${this.props.appbaseField}"].buckets`));
		} catch(e) {
			console.log(e);
		}
	}

	addItemsToList(newItems) {
		newItems = _.orderBy(newItems, ['key'], ['asc']);
		let itemLength = newItems.length;
		let min = this.state.startThreshold ? this.state.startThreshold : newItems[0].key;
		let max = this.state.endThreshold ? this.state.endThreshold : newItems[itemLength-1].key;
		if(itemLength > 1) {
			let rangeValue = {
				counts: this.countCalc(min, max, newItems),
				startThreshold: min,
				endThreshold: max,
				values: {
					min: this.state.values.min,
					max: this.state.values.max
				}
			};
			this.setState(rangeValue, function() {
				this.handleResults(null, rangeValue.values);
			}.bind(this));
		}
	}

	countCalc(min, max, newItems) {
		let counts = [];
		var storeItems = {};
		newItems = newItems.map(function(item) {
			item.key = Math.floor(item.key);
			if(!storeItems.hasOwnProperty(item.key)) {
				storeItems[item.key] = item.doc_count;
			} else {
				storeItems[item.key] += item.doc_count;
			}
			return item;
		});
		for (var i = min; i <= max; i++) {
			var val = storeItems[i] ? storeItems[i] : 0;
			counts.push(val);
		}
		return counts;
	}

	// Handle function when slider option change is completed
	handleResults(textVal, value) {
		let values;
		if(textVal) {
			values = {
				min: textVal[0],
				max: textVal[1]
			};
		} else {
			values = value;
		}
		var real_values = {
			from: values.min,
			to: values.max
		}
		var obj = {
			key: this.props.componentId,
			value: real_values
		};
		helper.selectedSensor.set(obj, true);
		this.setState({
			currentValues: values,
			values: values
		});
	}

	render() {
		let title = null,
			histogram = null,
			marks = {};

		if(this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		if(this.state.counts && this.state.counts.length && this.props.showHistogram) {
			histogram = (<HistoGramComponent data={this.state.counts} />);
		}
		if (this.props.rangeLabels.start || this.props.rangeLabels.end) {
			marks = {
				[this.state.startThreshold]: this.props.rangeLabels.start,
				[this.state.endThreshold]: this.props.rangeLabels.end
			}
		}

		let cx = classNames({
			'rbc-title-active': this.props.title,
			'rbc-title-inactive': !this.props.title,
			'rbc-labels-active': this.props.rangeLabels.start || this.props.rangeLabels.end,
			'rbc-labels-inactive': !this.props.rangeLabels.start && !this.props.rangeLabels.end
		});

		return (
			<div className={`rbc rbc-rangeslider card thumbnail col s12 col-xs-12 ${cx}`}>
				{title}
				{histogram}
				<div className="rbc-rangeslider-container col s12 col-xs-12">
					<Slider range
						value={[this.state.values.min, this.state.values.max]}
						min={this.state.startThreshold}
						max={this.state.endThreshold}
						onChange={this.handleResults}
						step={this.props.stepValue}
						marks={marks}
					/>
				</div>
				{this.props.initialLoader.show ? (<InitialLoader defaultText={this.props.initialLoader.text} queryState={this.state.queryStart}></InitialLoader>) : null}
			</div>
		);
	}
}

RangeSlider.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	range: React.PropTypes.shape({
		start: helper.validateThreshold,
		end: helper.validateThreshold
	}),
	rangeLabels: React.PropTypes.shape({
		start: React.PropTypes.string,
		end: React.PropTypes.string
	}),
	defaultSelected: React.PropTypes.shape({
		start: React.PropTypes.number,
		end: React.PropTypes.number
	}),
	stepValue: helper.stepValidation,
	showHistogram: React.PropTypes.bool,
	initialLoader: React.PropTypes.shape({
		show: React.PropTypes.bool,
		text: React.PropTypes.string
	})
};

RangeSlider.defaultProps = {
	title: null,
	range: {
		start: 0,
		end: 10
	},
	rangeLabels: {
		start: "",
		end: ""
	},
	defaultSelected: {
		start: 0,
		end: 10
	},
	stepValue: 1,
	showHistogram: true,
	initialLoader: {
		show: true
	}
};

// context type
RangeSlider.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

RangeSlider.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	range: TYPES.OBJECT,
	rangeLabels: TYPES.OBJECT,
	defaultSelected: TYPES.OBJECT,
	stepValue: TYPES.NUMBER,
	showHistogram: TYPES.BOOLEAN,
	initialLoader: TYPES.OBJECT
};
