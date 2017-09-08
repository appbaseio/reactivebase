/* eslint max-lines: 0 */
import React, { Component } from "react";
import Slider from "rc-slider";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import { HistoGramComponent } from "../addons/HistoGram";
import InitialLoader from "../addons/InitialLoader";
import * as TYPES from "../middleware/constants";
import _ from "lodash";

const helper = require("../middleware/helper");

export default class RangeSlider extends Component {
	constructor(props) {
		super(props);
		const startThreshold = this.props.range.start ? this.props.range.start : 0;
		const endThreshold = this.props.range.end ? this.props.range.end : 5;
		const values = {};
		this.urlParams = helper.URLParams.get(this.props.componentId, false, true);
		this.defaultSelected = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		if (!this.defaultSelected) {
			this.defaultSelected = {
				start: startThreshold,
				end: endThreshold
			};
		}
		values.min = this.defaultSelected.start < startThreshold ? startThreshold : this.defaultSelected.start;
		values.max = this.defaultSelected.end < endThreshold ? this.defaultSelected.end : endThreshold;
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
		this.queryStartTime = 0;
		this.type = "range";
		this.channelId = null;
		this.channelListener = null;
		this.handleValuesChange = this.handleValuesChange.bind(this);
		this.handleResults = this.handleResults.bind(this);
		this.customQuery = this.customQuery.bind(this);
		this.histogramQuery = this.histogramQuery.bind(this);
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setReact(this.props);
		this.setQueryInfo();
		this.createChannel();
	}

	componentDidMount() {
		if (this.props.defaultSelected) {
			this.handleResults(null, {min: this.props.defaultSelected.start, max: this.props.defaultSelected.end});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(this.props.react, nextProps.react)) {
			this.setReact(nextProps);
			manager.update(this.channelId, this.react, nextProps.size, 0, false);
		}

		const execQuery = (obj) => {
			if (nextProps.onValueChange) {
				const nextValue = {
					start: obj.value.from,
					end: obj.value.to
				};
				nextProps.onValueChange(nextValue);
			}
			helper.URLParams.update(nextProps.componentId, this.setURLParam(obj.value), nextProps.URLParams);
			helper.selectedSensor.set(obj, true);
		};

		setTimeout(() => {
			let defaultValue = this.urlParams !== null ? this.urlParams : nextProps.defaultSelected;
			if (!_.isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
				defaultValue = nextProps.defaultSelected;
			}

			// check defaultSelected
			if ((defaultValue && defaultValue.start !== this.state.values.min) ||
				(defaultValue && defaultValue.end !== this.state.values.max) &&
				nextProps.range.start <= defaultValue.start &&
				nextProps.range.end >= defaultValue.end) {
				const rem = (defaultValue.end - defaultValue.start) % nextProps.stepValue;
				if (rem) {
					const values = {
						min: this.state.values.min,
						max: defaultValue.end - rem
					}
					this.setState({
						values
					});
					const obj = {
						key: nextProps.componentId,
						value: {
							from: values.min,
							to: values.max
						}
					};
					setTimeout(() => {
						if (this.props.beforeValueChange) {
							const nextValue = {
								start: values.min,
								end: values.max
							};
							this.props.beforeValueChange(nextValue)
							.then(() => {
								execQuery(obj);
							})
							.catch((e) => {
								console.warn(`${this.props.componentId} - beforeValueChange rejected the promise with`, e);
							});
						} else {
							execQuery(obj);
						}
					}, 1000);
				} else {
					const values = {};
					values.min = defaultValue.start;
					values.max = defaultValue.end;
					this.setState({
						values,
						currentValues: values
					});
					const obj = {
						key: nextProps.componentId,
						value: {
							from: values.min,
							to: values.max
						}
					};
					setTimeout(() => {
						if (this.props.beforeValueChange) {
							const nextValue = {
								start: values.min,
								end: values.max
							};
							this.props.beforeValueChange(nextValue)
							.then(() => {
								execQuery(obj);
							})
							.catch((e) => {
								console.warn(`${this.props.componentId} - beforeValueChange rejected the promise with`, e);
							});
						} else {
							execQuery(obj);
						}
					}, 1000);
				}
			}
			// check range
			if (nextProps.range.start !== this.state.startThreshold ||
				nextProps.range.end !== this.state.endThreshold) {
				if (nextProps.range.start <= defaultValue.start &&
					nextProps.range.end >= defaultValue.end) {
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
					if (this.props.beforeValueChange) {
						const nextValue = {
							start: values.min,
							end: values.max
						};
						this.props.beforeValueChange(nextValue)
						.then(() => {
							execQuery();
						})
						.catch((e) => {
							console.warn(`${this.props.componentId} - beforeValueChange rejected the promise with`, e);
						});
					} else {
						execQuery();
					}
				}
				this.setRangeValue();
			}
			// drop value if it exceeds the threshold (based on step value)
			if (nextProps.stepValue !== this.props.stepValue) {
				const rem = (defaultValue.end - defaultValue.start) % nextProps.stepValue;
				if (rem) {
					this.setState({
						values: {
							min: this.state.values.min,
							max: defaultValue.end - rem
						}
					});
					const obj = {
						key: this.props.componentId,
						value: {
							from: this.state.values.min,
							to: defaultValue.end - rem
						}
					};
					if (this.props.onValueChange) {
						const nextValue = {
							start: obj.value.from,
							end: obj.value.to
						};
						this.props.onValueChange(nextValue);
					}
					helper.URLParams.update(this.props.componentId, this.setURLParam(obj.value), this.props.URLParams);
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

	setURLParam(value) {
		if("from" in value && "to" in value) {
			value = {
				start: value.from,
				end: value.to
			};
		}
		return JSON.stringify(value);
	}

	// set the query type and input data
	setQueryInfo() {
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.dataField
			}
		};
		const getQuery = (value) => {
			const currentQuery = this.props.customQuery ? this.props.customQuery(value) : this.customQuery(value);
			if (this.props.onQueryChange && JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
				this.props.onQueryChange(this.previousQuery, currentQuery);
			}
			this.previousQuery = currentQuery;
			return currentQuery;
		};
		const obj1 = {
			key: `${this.props.componentId}-internal`,
			value: {
				queryType: "range",
				inputData: this.props.dataField,
				customQuery: getQuery,
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
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
		helper.selectedSensor.set(objValue, true);
	}

	customQuery(record) {
		if (record) {
			return {
				range: {
					[this.props.dataField]: {
						gte: record.start,
						lte: record.end,
						boost: 2.0
					}
				}
			};
		}
	}

	histogramQuery() {
		return {
			[this.props.dataField]: {
				"histogram": {
					"field": this.props.dataField,
					"interval": this.props.interval ? this.props.interval : Math.ceil((this.props.range.end - this.props.range.start)/10)
				}
			}
		};
	}

	setReact(props) {
		// Set the react - add self aggs query as well with react
		const react = Object.assign({}, props.react);
		react.aggs = {
			key: props.dataField,
			sort: "asc",
			size: 1000,
			customQuery: this.histogramQuery
		};
		const reactAnd = [`${props.componentId}-internal`]
		this.react = helper.setupReact(react, reactAnd);
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		// create a channel and listen the changes
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, (res) => {
			if (res.error) {
				this.setState({
					queryStart: false
				});
			}
			if (res.appliedQuery && res.startTime > this.queryStartTime) {
				this.queryStartTime = res.startTime ? res.startTime : 0;
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
			this.addItemsToList(data.aggregations[this.props.dataField].buckets);
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
		return newItems.map(item => item.doc_count);
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
				if(!_.isEqual(rangeValue.values, this.state.currentValues)) {
					this.handleResults(null, rangeValue.values);
				}
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

		const nextValue = {
			start: realValues.from,
			end: realValues.to
		};

		const execQuery = () => {
			if (this.props.onValueChange) {
				this.props.onValueChange(nextValue);
			}
			helper.URLParams.update(this.props.componentId, this.setURLParam(obj.value), this.props.URLParams);
			helper.selectedSensor.set(obj, true);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(nextValue)
			.then(() => {
				execQuery();
			})
			.catch((e) => {
				console.warn(`${this.props.componentId} - beforeValueChange rejected the promise with`, e);
			});
		} else {
			execQuery();
		}

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
		}, this.props.className);

		const keyAttributes = {
			start: "start",
			end: "end"
		};

		if (this.props.defaultSelected) {
			keyAttributes.start = this.state.values.min;
			keyAttributes.end = this.state.values.max;
		}

		return (
			<div className={`rbc rbc-rangeslider card thumbnail col s12 col-xs-12 ${cx}`} style={this.props.style}>
				{title}
				{histogram}
				<div className="rbc-rangeslider-container col s12 col-xs-12" key={`rbc-rangeslider-${keyAttributes.start}-${keyAttributes.end}`}>
					<Slider
						range
						defaultValue={[this.state.values.min, this.state.values.max]}
						min={this.state.startThreshold}
						max={this.state.endThreshold}
						onAfterChange={this.handleResults}
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
	dataField: React.PropTypes.string.isRequired,
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
	onValueChange: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	style: React.PropTypes.object,
	interval: React.PropTypes.number,
	onQueryChange: React.PropTypes.func,
	URLParams: React.PropTypes.bool,
	className: React.PropTypes.string
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
	stepValue: 1,
	showHistogram: true,
	style: {},
	URLParams: false
};

// context type
RangeSlider.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

RangeSlider.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	range: TYPES.OBJECT,
	rangeLabels: TYPES.OBJECT,
	defaultSelected: TYPES.OBJECT,
	stepValue: TYPES.NUMBER,
	showHistogram: TYPES.BOOLEAN,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT,
	style: TYPES.OBJECT,
	interval: TYPES.NUMBER,
	onQueryChange: TYPES.FUNCTION,
	URLParams: TYPES.BOOLEAN,
	className: TYPES.STRING
};
