/* eslint max-lines: 0 */
import React, { Component } from "react";
import Slider from "rc-slider";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import { HistoGramComponent } from "../addons/HistoGram";
import InitialLoader from "../addons/InitialLoader";
import * as TYPES from "../middleware/constants";

const helper = require("../middleware/helper");
const _ = require("lodash");

export default class RangeSlider extends Component {
	constructor(props) {
		super(props);
		const startThreshold = this.props.range.start ? this.props.range.start : 0;
		const endThreshold = this.props.range.end ? this.props.range.end : 5;
		const values = {};
		values.min = this.props.defaultSelected.start < startThreshold ? startThreshold : this.props.defaultSelected.start;
		values.max = this.props.defaultSelected.end < endThreshold ? this.props.defaultSelected.end : endThreshold;
		this.state = {
			values,
			startThreshold,
			endThreshold,
			currentValues: [],
			counts: [],
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		this.maxSize = 100;
		this.type = "range";
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

	componentWillReceiveProps(nextProps) {
		setTimeout(() => {
			// check defaultSelected
			if (nextProps.defaultSelected.start !== this.state.values.min ||
				nextProps.defaultSelected.end !== this.state.values.max &&
				nextProps.range.start <= nextProps.defaultSelected.start &&
				nextProps.range.end >= nextProps.defaultSelected.end) {
				const rem = (nextProps.defaultSelected.end - nextProps.defaultSelected.start) % nextProps.stepValue;
				if (rem) {
					this.setState({
						values: {
							min: this.state.values.min,
							max: nextProps.defaultSelected.end - rem
						}
					});
					const obj = {
						key: this.props.componentId,
						value: {
							from: this.state.values.min,
							to: nextProps.defaultSelected.end - rem
						}
					};
					setTimeout(() => {
						if(this.props.onValueChange) {
							this.props.onValueChange(obj.value);
						}
						helper.selectedSensor.set(obj, true);
					}, 1000);
				} else {
					const values = {};
					values.min = nextProps.defaultSelected.start;
					values.max = nextProps.defaultSelected.end;
					this.setState({
						values,
						currentValues: values
					});
					const obj = {
						key: this.props.componentId,
						value: {
							from: values.min,
							to: values.max
						}
					};
					setTimeout(() => {
						if(this.props.onValueChange) {
							this.props.onValueChange(obj.value);
						}
						helper.selectedSensor.set(obj, true);
					}, 1000);
				}
			}
			// check range
			if (nextProps.range.start !== this.state.startThreshold ||
				nextProps.range.end !== this.state.endThreshold) {
				if (nextProps.range.start <= nextProps.defaultSelected.start &&
					nextProps.range.end >= nextProps.defaultSelected.end) {
					this.setState({
						startThreshold: nextProps.range.start,
						endThreshold: nextProps.range.end
					});
				} else {
					const values = {
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
						values
					});
					const currentRange = {
						from: values.min,
						to: values.max
					};
					const obj = {
						key: this.props.componentId,
						value: currentRange
					};
					if(this.props.onValueChange) {
						this.props.onValueChange(obj.value);
					}
					helper.selectedSensor.set(obj, true);
				}
				this.setRangeValue();
			}
			// drop value if it exceeds the threshold (based on step value)
			if (nextProps.stepValue !== this.props.stepValue) {
				const rem = (nextProps.defaultSelected.end - nextProps.defaultSelected.start) % nextProps.stepValue;
				if (rem) {
					this.setState({
						values: {
							min: this.state.values.min,
							max: nextProps.defaultSelected.end - rem
						}
					});
					const obj = {
						key: this.props.componentId,
						value: {
							from: this.state.values.min,
							to: nextProps.defaultSelected.end - rem
						}
					};
					if(this.props.onValueChange) {
						this.props.onValueChange(obj.value);
					}
					helper.selectedSensor.set(obj, true);
				}
			}
		}, 300);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if ((nextProps.stepValue <= 0) ||
			(nextProps.stepValue > Math.floor((nextProps.range.end - nextProps.range.start) / 2))) {
			console.error(`Step value is invalid, it should be less than or equal to ${Math.floor((nextProps.range.end - nextProps.range.start) / 2)}.`);
			return false;
		} else if (nextState.values.max > nextState.endThreshold) {
			return false;
		}
		return true;
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
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

	// set the query type and input data
	setQueryInfo() {
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField
			}
		};
		const obj1 = {
			key: `${this.props.componentId}-internal`,
			value: {
				queryType: "range",
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
		helper.selectedSensor.setSensorInfo(obj1);
		this.setRangeValue();
	}

	setRangeValue() {
		const objValue = {
			key: `${this.props.componentId}-internal`,
			value: this.props.range
		};
		if(this.props.onValueChange) {
			this.props.onValueChange(objValue.value);
		}
		helper.selectedSensor.set(objValue, true);
	}

	customQuery(record) {
		if (record) {
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
		const react = this.props.react ? this.props.react : {};
		react.aggs = {
			key: this.props.appbaseField,
			sort: "asc",
			size: 1000
		};
		if (react && react.and && typeof react.and === "string") {
			react.and = [react.and];
		} else {
			react.and = react.and ? react.and : [];
		}
		react.and.push(`${this.props.componentId}-internal`);
		// create a channel and listen the changes
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, (res) => {
			if (res.error) {
				this.setState({
					queryStart: false
				});
			}
			if (res.appliedQuery) {
				const data = res.data;
				let rawData;
				if (res.mode === "streaming") {
					rawData = this.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === "historic") {
					rawData = data;
				}
				this.setState({
					queryStart: false,
					rawData
				});
				this.setData(data);
			}
		});
		this.listenLoadingChannel(channelObj);
	}

	listenLoadingChannel(channelObj) {
		this.loadListener = channelObj.emitter.addListener(`${channelObj.channelId}-query`, (res) => {
			if (res.appliedQuery) {
				this.setState({
					queryStart: res.queryState
				});
			}
		});
	}

	getSize() {
		return Math.min(this.props.range.end - this.props.range.start, this.maxSize);
	}

	setData(data) {
		try {
			this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
		} catch (e) {
			console.log(e);
		}
	}

	// Handle function when value slider option is changing
	handleValuesChange(component, values) {
		this.setState({
			values
		});
	}

	countCalc(min, max, newItems) {
		const counts = [];
		const storeItems = {};
		newItems.forEach((item) => {
			item.key = Math.floor(item.key);
			if (!(item.key in storeItems)) {
				storeItems[item.key] = item.doc_count;
			} else {
				storeItems[item.key] += item.doc_count;
			}
		});
		for (let i = min; i <= max; i += 1) {
			const val = storeItems[i] ? storeItems[i] : 0;
			counts.push(val);
		}
		return counts;
	}

	addItemsToList(newItems) {
		newItems = _.orderBy(newItems, ["key"], ["asc"]);
		const itemLength = newItems.length;
		const min = this.state.startThreshold ? this.state.startThreshold : newItems[0].key;
		const max = this.state.endThreshold ? this.state.endThreshold : newItems[itemLength - 1].key;
		if (itemLength > 1) {
			const rangeValue = {
				counts: this.countCalc(min, max, newItems),
				startThreshold: min,
				endThreshold: max,
				values: {
					min: this.state.values.min,
					max: this.state.values.max
				}
			};
			this.setState(rangeValue, () => {
				this.handleResults(null, rangeValue.values);
			});
		}
	}

	// Handle function when slider option change is completed
	handleResults(textVal, value) {
		let values;
		if (textVal) {
			values = {
				min: textVal[0],
				max: textVal[1]
			};
		} else {
			values = value;
		}
		const realValues = {
			from: values.min,
			to: values.max
		};
		const obj = {
			key: this.props.componentId,
			value: realValues
		};
		if(this.props.onValueChange) {
			this.props.onValueChange(obj.value);
		}
		helper.selectedSensor.set(obj, true);
		this.setState({
			currentValues: values,
			values
		});
	}

	render() {
		let title = null,
			histogram = null,
			marks = {};

		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		if (this.state.counts && this.state.counts.length && this.props.showHistogram) {
			histogram = (<HistoGramComponent data={this.state.counts} />);
		}
		if (this.props.rangeLabels.start || this.props.rangeLabels.end) {
			marks = {
				[this.state.startThreshold]: this.props.rangeLabels.start,
				[this.state.endThreshold]: this.props.rangeLabels.end
			};
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-labels-active": this.props.rangeLabels.start || this.props.rangeLabels.end,
			"rbc-labels-inactive": !this.props.rangeLabels.start && !this.props.rangeLabels.end,
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader
		});

		return (
			<div className={`rbc rbc-rangeslider card thumbnail col s12 col-xs-12 ${cx}`}>
				{title}
				{histogram}
				<div className="rbc-rangeslider-container col s12 col-xs-12">
					<Slider
						range
						value={[this.state.values.min, this.state.values.max]}
						min={this.state.startThreshold}
						max={this.state.endThreshold}
						onChange={this.handleResults}
						step={this.props.stepValue}
						marks={marks}
					/>
				</div>
				{this.props.initialLoader && this.state.queryStart ? (<InitialLoader defaultText={this.props.initialLoader} />) : null}
			</div>
		);
	}
}

RangeSlider.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
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
	customQuery: React.PropTypes.func,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	react: React.PropTypes.object,
	onValueChange: React.PropTypes.func
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
	showHistogram: true
};

// context type
RangeSlider.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

RangeSlider.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	range: TYPES.OBJECT,
	rangeLabels: TYPES.OBJECT,
	defaultSelected: TYPES.OBJECT,
	stepValue: TYPES.NUMBER,
	showHistogram: TYPES.BOOLEAN,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT
};
