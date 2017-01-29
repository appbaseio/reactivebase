import { default as React, Component } from 'react';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
import { HistoGramComponent } from './component/HistoGram.js';
import Slider from 'rc-slider';
var helper = require('../middleware/helper.js');
var _ = require('lodash');

export class RangeSlider extends Component {
	constructor(props, context) {
		super(props);
		let startThreshold = this.props.threshold.start ? this.props.threshold.start : 0;
		let endThreshold = this.props.threshold.end ? this.props.threshold.end : 5;
		let values = {};
		values.min = this.props.defaultSelected.start < this.props.threshold.start ? this.props.threshold.start :  this.props.defaultSelected.start;
		values.max = this.props.defaultSelected.end < this.props.threshold.end ? this.props.defaultSelected.end :  this.props.threshold.end;
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
		this.type = 'range';
		this.channelId = null;
		this.channelListener = null;
		this.handleValuesChange = this.handleValuesChange.bind(this);
		this.handleResults = this.handleResults.bind(this);
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
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (this.state.values.min != this.props.defaultSelected.start ||
				this.state.values.max != this.props.defaultSelected.end) {
				let values = {};
				values.min = this.props.defaultSelected.start;
				values.max = this.props.defaultSelected.end;
				this.setState({
					values: values,
					currentValues: values
				});
				var obj = {
					key: this.props.sensorId,
					value: {
						from: values.min,
						to: values.max
					}
				};
				helper.selectedSensor.set(obj, true);
			}
		}, 300);
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
				key: this.props.sensorId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField
				}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		// Set the depends - add self aggs query as well with depends
		let depends = this.props.depends ? this.props.depends : {};
		depends['aggs'] = {
			key: this.props.appbaseField,
			sort: this.props.sort,
			size: this.props.size
		};
		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, depends);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function(res) {
			let data = res.data;
			let rawData;
			if(res.mode === 'streaming') {
				rawData = this.state.rawData;
				rawData.hits.hits.push(res.data);
			} else if(res.mode === 'historic') {
				rawData = data;
			}
			this.setState({
				rawData: rawData
			});
			this.setData(data);
		}.bind(this));
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
		let min = this.props.threshold.start ? this.props.threshold.start : newItems[0].key;
		let max = this.props.threshold.end ? this.props.threshold.end : newItems[itemLength-1].key;
		if(itemLength > 1) {
			let rangeValue = {
				counts: this.countCalc(min, max, newItems),
				startThreshold: min,
				endThreshold: max,
				values: {
					min: min,
					max: max
				}
			};
			this.setState(rangeValue, function() {
				this.handleResults(null, rangeValue.values);
			}.bind(this));
		}
	}

	countCalc(min, max, newItems) {
		let counts = [];
		for(let i = min; i <= max; i++) {
			let item = _.find(newItems, {'key': i});
			let val =  item ? item.doc_count : 0;
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
			key: this.props.sensorId,
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
			histogram = null;

		if(this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		if(this.state.counts && this.state.counts.length) {
			histogram = (<HistoGramComponent data={this.state.counts} />);
		}

		let cx = classNames({
			'rbc-title-active': this.props.title,
			'rbc-title-inactive': !this.props.title
		});

		return (
			<div className={`rbc rbc-rangeslider card thumbnail col s12 col-xs-12 ${cx}`}>
				{title}
				{histogram}
				<div className="rbc-rangeslider-container col s12 col-xs-12" style={{'margin': '25px 0'}}>
					<Slider range
						value={[this.state.values.min, this.state.values.max]}
						min={this.state.startThreshold}
						max={this.state.endThreshold}
						onAfterChange={this.handleResults}
						step={this.props.stepValue}
					/>
				</div>
			</div>
		);
	}
}

RangeSlider.propTypes = {
	sensorId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	threshold: React.PropTypes.shape({
		start: helper.validateThreshold,
		end: helper.validateThreshold
	}),
	defaultSelected: React.PropTypes.object,
	stepValue: React.PropTypes.number
};

RangeSlider.defaultProps = {
	defaultSelected: {
		start: 0,
		end: 10
	},
	threshold: {
		start: 0,
		end: 10
	},
	stepValue: 1,
	size: 100,
	title: null
};

// context type
RangeSlider.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
