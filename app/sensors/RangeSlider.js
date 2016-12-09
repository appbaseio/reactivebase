import { default as React, Component } from 'react';
import { render } from 'react-dom';
import {manager} from '../middleware/ChannelManager.js';
import {HistoGramComponent} from './component/HistoGram.js';
import Slider from 'rc-slider';
var helper = require('../middleware/helper.js');
var Style = require('../helper/Style.js');

export class RangeSlider extends Component {

	constructor(props, context) {
		super(props);
		let startThreshold = this.props.startThreshold ? this.props.startThreshold : 0;
		let endThreshold = this.props.endThreshold ? this.props.endThreshold : 5;
		let values = {};
		values.min = this.props.defaultSelected.start < this.props.startThreshold ? this.props.startThreshold :  this.props.defaultSelected.start;
		values.max = this.props.defaultSelected.end < this.props.endThreshold ? this.props.endThreshold :  this.props.defaultSelected.end;
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
		this.handleValuesChange = this.handleValuesChange.bind(this);
		this.handleResults = this.handleResults.bind(this);
	}
	// Get the items from Appbase when component is mounted
	componentDidMount() {
		this.setQueryInfo();
		this.createChannel();
	}
	// Handle function when value slider option is changing
	handleValuesChange(component, values) {
		this.setState({
			values: values,
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
		var channelObj = manager.create(this.context.appbaseConfig, depends);
		channelObj.emitter.addListener(channelObj.channelId, function(res) {
			let data = res.data;
			let rawData;
			if(res.method === 'stream') {
				rawData = this.state.rawData;
				rawData.hits.hits.push(res.data);
			} else if(res.method === 'historic') {
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
		let min = this.props.startThreshold ? this.props.startThreshold : newItems[0].key;
		let max = this.props.endThreshold ? this.props.endThreshold : newItems[itemLength-1].key;
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
		 let title =null,
			histogram = null,
			titleExists = false;

		if(this.props.title) {
			titleExists = true;
			title = (<h4 className="ab-componentTitle col s12 col-xs-12">{this.props.title}</h4>);
		}
		if(this.state.counts && this.state.counts.length) {
			histogram = (<HistoGramComponent data={this.state.counts} />);
		}

		return (
			<div className="ab-component ab-SliderComponent card thumbnail col s12 col-xs-12">
				{title}
				{histogram}
				<div className="ab-SliderComponent-Container col s12 col-xs-12" style={{'margin': '25px 0'}}>
					<Slider range className="ab-slider"
						defaultValue={[this.state.values.min, this.state.values.max]}
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
	startThreshold: React.PropTypes.number,
	endThreshold: React.PropTypes.number,
	defaultSelected: React.PropTypes.object,
	stepValue: React.PropTypes.number
};

RangeSlider.defaultProps = {
	defaultSelected: {
		start: 0,
		end: 10
	},
	stepValue: 1,
	size: 100,
	title: null
};

// context type
RangeSlider.contextTypes = {
	appbaseConfig: React.PropTypes.any.isRequired
};
