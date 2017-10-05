import _orderBy from "lodash/orderBy";
import _isEqual from "lodash/isEqual";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint max-lines: 0 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import { HistoGramComponent } from "../addons/HistoGram";
import InitialLoader from "../addons/InitialLoader";
import * as TYPES from "../middleware/constants";


var Range = Slider.Range;

var helper = require("../middleware/helper");

var RangeSlider = function (_Component) {
	_inherits(RangeSlider, _Component);

	function RangeSlider(props) {
		_classCallCheck(this, RangeSlider);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		var startThreshold = props.range.start ? props.range.start : 0;
		var endThreshold = props.range.end ? props.range.end : 5;
		var values = {};
		_this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId, false, true) : null;
		_this.defaultSelected = _this.urlParams !== null ? _this.urlParams : props.defaultSelected;
		if (!_this.defaultSelected) {
			_this.defaultSelected = {
				start: startThreshold,
				end: endThreshold
			};
		}
		values.min = _this.defaultSelected.start < startThreshold ? startThreshold : _this.defaultSelected.start;
		values.max = _this.defaultSelected.end < endThreshold ? _this.defaultSelected.end : endThreshold;
		_this.state = {
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
		_this.maxSize = 100;
		_this.queryStartTime = 0;
		_this.type = "range";
		_this.channelId = null;
		_this.channelListener = null;
		_this.handleValuesChange = _this.handleValuesChange.bind(_this);
		_this.handleResults = _this.handleResults.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.histogramQuery = _this.histogramQuery.bind(_this);
		return _this;
	}

	RangeSlider.prototype.componentWillMount = function componentWillMount() {
		this.previousQuery = null; // initial value for onQueryChange
		this.setReact(this.props);
		this.setQueryInfo();
		this.createChannel();
		if (this.props.defaultSelected) {
			this.handleResults(null, { min: this.props.defaultSelected.start, max: this.props.defaultSelected.end });
		}
	};

	RangeSlider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		var _this2 = this;

		if (!_isEqual(this.props.react, nextProps.react)) {
			this.setReact(nextProps);
			manager.update(this.channelId, this.react, nextProps.size, 0, false);
		}

		var execQuery = function execQuery(obj) {
			if (nextProps.onValueChange) {
				var nextValue = {
					start: obj.value.from,
					end: obj.value.to
				};
				nextProps.onValueChange(nextValue);
			}
			if (nextProps.URLParams) {
				helper.URLParams.update(nextProps.componentId, _this2.setURLParam(obj.value), nextProps.URLParams);
			}
			helper.selectedSensor.set(obj, true);
		};

		var defaultValue = this.urlParams !== null ? this.urlParams : nextProps.defaultSelected;
		if (!_isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			defaultValue = nextProps.defaultSelected;
		}

		// check defaultSelected
		if (defaultValue && defaultValue.start !== this.props.defaultSelected.start || defaultValue && defaultValue.end !== this.props.defaultSelected.end && nextProps.range.start <= defaultValue.start && nextProps.range.end >= defaultValue.end) {
			var rem = (defaultValue.end - defaultValue.start) % nextProps.stepValue;
			if (rem) {
				var values = {
					min: this.state.values.min,
					max: defaultValue.end - rem
				};
				this.setState({
					values: values
				});
				var obj = {
					key: nextProps.componentId,
					value: {
						from: values.min,
						to: values.max
					}
				};
				setTimeout(function () {
					if (_this2.props.beforeValueChange) {
						var nextValue = {
							start: values.min,
							end: values.max
						};
						_this2.props.beforeValueChange(nextValue).then(function () {
							execQuery(obj);
						}).catch(function (e) {
							console.warn(_this2.props.componentId + " - beforeValueChange rejected the promise with", e);
						});
					} else {
						execQuery(obj);
					}
				}, 1000);
			} else {
				var _values = {};
				_values.min = defaultValue.start;
				_values.max = defaultValue.end;
				this.setState({
					values: _values,
					currentValues: _values
				});
				var _obj = {
					key: nextProps.componentId,
					value: {
						from: _values.min,
						to: _values.max
					}
				};
				setTimeout(function () {
					if (_this2.props.beforeValueChange) {
						var nextValue = {
							start: _values.min,
							end: _values.max
						};
						_this2.props.beforeValueChange(nextValue).then(function () {
							execQuery(_obj);
						}).catch(function (e) {
							console.warn(_this2.props.componentId + " - beforeValueChange rejected the promise with", e);
						});
					} else {
						execQuery(_obj);
					}
				}, 1000);
			}
		}
		// check range
		if (nextProps.range.start !== this.state.startThreshold || nextProps.range.end !== this.state.endThreshold) {
			if (nextProps.range.start <= defaultValue.start && nextProps.range.end >= defaultValue.end) {
				this.setState({
					startThreshold: nextProps.range.start,
					endThreshold: nextProps.range.end
				});
			} else {
				var _values2 = {
					min: this.state.values.min,
					max: this.state.values.max
				};
				if (this.state.values.min < nextProps.range.start) {
					_values2.min = nextProps.range.start;
				}
				if (this.state.values.max > nextProps.range.end) {
					_values2.max = nextProps.range.end;
				}
				this.setState({
					startThreshold: nextProps.range.start,
					endThreshold: nextProps.range.end,
					values: _values2
				});
				var currentRange = {
					from: _values2.min,
					to: _values2.max
				};
				var _obj2 = {
					key: this.props.componentId,
					value: currentRange
				};
				if (this.props.beforeValueChange) {
					var nextValue = {
						start: _values2.min,
						end: _values2.max
					};
					this.props.beforeValueChange(nextValue).then(function () {
						execQuery();
					}).catch(function (e) {
						console.warn(_this2.props.componentId + " - beforeValueChange rejected the promise with", e);
					});
				} else {
					execQuery();
				}
			}
			this.setRangeValue();
		}
		// drop value if it exceeds the threshold (based on step value)
		if (nextProps.stepValue !== this.props.stepValue) {
			var _rem = (defaultValue.end - defaultValue.start) % nextProps.stepValue;
			if (_rem) {
				this.setState({
					values: {
						min: this.state.values.min,
						max: defaultValue.end - _rem
					}
				});
				var _obj3 = {
					key: this.props.componentId,
					value: {
						from: this.state.values.min,
						to: defaultValue.end - _rem
					}
				};
				if (this.props.onValueChange) {
					var _nextValue = {
						start: _obj3.value.from,
						end: _obj3.value.to
					};
					this.props.onValueChange(_nextValue);
				}
				if (this.props.URLParams) {
					helper.URLParams.update(this.props.componentId, this.setURLParam(_obj3.value), this.props.URLParams);
				}
				helper.selectedSensor.set(_obj3, true);
			}
		}
	};

	RangeSlider.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.stepValue <= 0 || nextProps.stepValue > Math.floor((nextProps.range.end - nextProps.range.start) / 2)) {
			console.error("Step value is invalid, it should be less than or equal to " + Math.floor((nextProps.range.end - nextProps.range.start) / 2) + ".");
			return false;
		} else if (nextState.values.max > nextState.endThreshold) {
			return false;
		}
		return true;
	};

	// stop streaming request and remove listener when component will unmount


	RangeSlider.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if (this.loadListener) {
			this.loadListener.remove();
		}
	};

	RangeSlider.prototype.setURLParam = function setURLParam(value) {
		if ("from" in value && "to" in value) {
			value = {
				start: value.from,
				end: value.to
			};
		}
		return JSON.stringify(value);
	};

	// set the query type and input data


	RangeSlider.prototype.setQueryInfo = function setQueryInfo() {
		var _this3 = this;

		var getQuery = function getQuery(value) {
			var currentQuery = _this3.props.customQuery ? _this3.props.customQuery(value) : _this3.customQuery(value);
			if (_this3.props.onQueryChange && JSON.stringify(_this3.previousQuery) !== JSON.stringify(currentQuery)) {
				_this3.props.onQueryChange(_this3.previousQuery, currentQuery);
			}
			_this3.previousQuery = currentQuery;
			return currentQuery;
		};
		var obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.dataField,
				customQuery: this.customQuery,
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		var obj1 = {
			key: this.props.componentId + "-internal",
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
	};

	RangeSlider.prototype.setRangeValue = function setRangeValue() {
		var objValue = {
			key: this.props.componentId + "-internal",
			value: this.props.range
		};
		helper.selectedSensor.set(objValue, true);
	};

	RangeSlider.prototype.customQuery = function customQuery(record) {
		if (record) {
			var _range;

			return {
				range: (_range = {}, _range[this.props.dataField] = {
					gte: record.start,
					lte: record.end,
					boost: 2.0
				}, _range)
			};
		}
	};

	RangeSlider.prototype.histogramQuery = function histogramQuery() {
		var _ref;

		return _ref = {}, _ref[this.props.dataField] = {
			histogram: {
				field: this.props.dataField,
				interval: this.props.interval ? this.props.interval : Math.ceil((this.props.range.end - this.props.range.start) / 10)
			}
		}, _ref;
	};

	RangeSlider.prototype.setReact = function setReact(props) {
		// Set the react - add self aggs query as well with react
		var react = Object.assign({}, props.react);
		react.aggs = {
			key: props.dataField,
			sort: "asc",
			size: 1000,
			customQuery: this.histogramQuery
		};
		var reactAnd = [props.componentId + "-internal"];
		this.react = helper.setupReact(react, reactAnd);
	};

	// Create a channel which passes the react and receive results whenever react changes


	RangeSlider.prototype.createChannel = function createChannel() {
		var _this4 = this;

		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
			if (res.error) {
				_this4.setState({
					queryStart: false
				});
			}
			if (res.appliedQuery && res.startTime > _this4.queryStartTime) {
				_this4.queryStartTime = res.startTime ? res.startTime : 0;
				var data = res.data;
				var rawData = void 0;
				if (res.mode === "streaming") {
					rawData = _this4.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === "historic") {
					rawData = data;
				}
				_this4.setState({
					queryStart: false,
					rawData: rawData
				});
				_this4.setData(data);
			}
		});
		this.listenLoadingChannel(channelObj);
	};

	RangeSlider.prototype.listenLoadingChannel = function listenLoadingChannel(channelObj) {
		var _this5 = this;

		this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
			if (res.appliedQuery) {
				_this5.setState({
					queryStart: res.queryState
				});
			}
		});
	};

	RangeSlider.prototype.getSize = function getSize() {
		return Math.min(this.props.range.end - this.props.range.start, this.maxSize);
	};

	RangeSlider.prototype.setData = function setData(data) {
		try {
			this.addItemsToList(data.aggregations[this.props.dataField].buckets);
		} catch (e) {
			console.log(e);
		}
	};

	// Handle function when value slider option is changing


	RangeSlider.prototype.handleValuesChange = function handleValuesChange(component, values) {
		this.setState({
			values: values
		});
	};

	RangeSlider.prototype.countCalc = function countCalc(min, max, newItems) {
		return newItems.map(function (item) {
			return item.doc_count;
		});
	};

	RangeSlider.prototype.addItemsToList = function addItemsToList(newItems) {
		var _this6 = this;

		newItems = _orderBy(newItems, ["key"], ["asc"]);
		var itemLength = newItems.length;
		var min = this.state.startThreshold ? this.state.startThreshold : newItems[0].key;
		var max = this.state.endThreshold ? this.state.endThreshold : newItems[itemLength - 1].key;
		if (itemLength > 1) {
			var rangeValue = {
				counts: this.countCalc(min, max, newItems),
				startThreshold: min,
				endThreshold: max,
				values: {
					min: this.state.values.min,
					max: this.state.values.max
				}
			};
			this.setState(rangeValue, function () {
				if (!_isEqual(rangeValue.values, _this6.state.currentValues)) {
					_this6.handleResults(null, rangeValue.values);
				}
			});
		}
	};

	// Handle function when slider option change is completed


	RangeSlider.prototype.handleResults = function handleResults(textVal, value) {
		var _this7 = this;

		var values = void 0;
		if (textVal) {
			values = {
				min: textVal[0],
				max: textVal[1]
			};
		} else {
			values = value;
		}
		var realValues = {
			from: values.min,
			to: values.max
		};
		var obj = {
			key: this.props.componentId,
			value: realValues
		};

		var nextValue = {
			start: realValues.from,
			end: realValues.to
		};

		var execQuery = function execQuery() {
			if (_this7.props.onValueChange) {
				_this7.props.onValueChange(nextValue);
			}
			if (_this7.props.URLParams) {
				helper.URLParams.update(_this7.props.componentId, _this7.setURLParam(obj.value), _this7.props.URLParams);
			}
			helper.selectedSensor.set(nextValue, true);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(nextValue).then(function () {
				execQuery();
			}).catch(function (e) {
				console.warn(_this7.props.componentId + " - beforeValueChange rejected the promise with", e);
			});
		} else {
			execQuery();
		}

		this.setState({
			currentValues: values,
			values: values
		});
	};

	RangeSlider.prototype.render = function render() {
		var title = null,
		    histogram = null,
		    marks = {};

		if (this.props.title) {
			title = React.createElement(
				"h4",
				{ className: "rbc-title col s12 col-xs-12" },
				this.props.title
			);
		}
		if (this.state.counts && this.state.counts.length && this.props.showHistogram) {
			histogram = React.createElement(HistoGramComponent, { data: this.state.counts });
		}
		if (this.props.rangeLabels.start || this.props.rangeLabels.end) {
			var _marks;

			marks = (_marks = {}, _marks[this.state.startThreshold] = this.props.rangeLabels.start, _marks[this.state.endThreshold] = this.props.rangeLabels.end, _marks);
		}

		var cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-labels-active": this.props.rangeLabels.start || this.props.rangeLabels.end,
			"rbc-labels-inactive": !this.props.rangeLabels.start && !this.props.rangeLabels.end,
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader
		}, this.props.className);

		var keyAttributes = {
			start: "start",
			end: "end"
		};

		if (this.props.defaultSelected) {
			keyAttributes.start = this.state.values.min;
			keyAttributes.end = this.state.values.max;
		}

		return React.createElement(
			"div",
			{ className: "rbc rbc-rangeslider card thumbnail col s12 col-xs-12 " + cx, style: this.props.style },
			title,
			histogram,
			React.createElement(
				"div",
				{ className: "rbc-rangeslider-container col s12 col-xs-12", key: "rbc-rangeslider-" + keyAttributes.start + "-" + keyAttributes.end },
				React.createElement(Range, {
					defaultValue: [this.state.values.min, this.state.values.max],
					min: this.state.startThreshold,
					max: this.state.endThreshold,
					onAfterChange: this.handleResults,
					step: this.props.stepValue,
					marks: marks
				})
			),
			this.props.initialLoader && this.state.queryStart ? React.createElement(InitialLoader, { defaultText: this.props.initialLoader }) : null
		);
	};

	return RangeSlider;
}(Component);

export default RangeSlider;


RangeSlider.propTypes = {
	componentId: PropTypes.string.isRequired,
	dataField: PropTypes.string.isRequired,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	range: PropTypes.shape({
		start: helper.validateThreshold,
		end: helper.validateThreshold
	}),
	rangeLabels: PropTypes.shape({
		start: PropTypes.string,
		end: PropTypes.string
	}),
	defaultSelected: PropTypes.shape({
		start: PropTypes.number,
		end: PropTypes.number
	}),
	stepValue: helper.stepValidation,
	showHistogram: PropTypes.bool,
	customQuery: PropTypes.func,
	initialLoader: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	react: PropTypes.object,
	onValueChange: PropTypes.func,
	beforeValueChange: PropTypes.func,
	style: PropTypes.object,
	interval: PropTypes.number,
	onQueryChange: PropTypes.func,
	URLParams: PropTypes.bool,
	className: PropTypes.string
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
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired
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