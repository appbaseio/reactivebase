"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _rcSlider = require("rc-slider");

var _rcSlider2 = _interopRequireDefault(_rcSlider);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require("../middleware/ChannelManager");

var _ChannelManager2 = _interopRequireDefault(_ChannelManager);

var _HistoGram = require("../addons/HistoGram");

var _InitialLoader = require("../addons/InitialLoader");

var _InitialLoader2 = _interopRequireDefault(_InitialLoader);

var _constants = require("../middleware/constants");

var TYPES = _interopRequireWildcard(_constants);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-lines: 0 */


var helper = require("../middleware/helper");

var RangeSlider = function (_Component) {
	_inherits(RangeSlider, _Component);

	function RangeSlider(props) {
		_classCallCheck(this, RangeSlider);

		var _this = _possibleConstructorReturn(this, (RangeSlider.__proto__ || Object.getPrototypeOf(RangeSlider)).call(this, props));

		var startThreshold = _this.props.range.start ? _this.props.range.start : 0;
		var endThreshold = _this.props.range.end ? _this.props.range.end : 5;
		var values = {};
		_this.urlParams = helper.URLParams.get(_this.props.componentId, false, true);
		_this.defaultSelected = _this.urlParams !== null ? _this.urlParams : _this.props.defaultSelected;
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

	// Get the items from Appbase when component is mounted


	_createClass(RangeSlider, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.setQueryInfo();
			this.createChannel();
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var _this2 = this;

			setTimeout(function () {
				var defaultValue = _this2.urlParams !== null ? _this2.urlParams : _this2.props.defaultSelected;
				// check defaultSelected
				if (defaultValue.start !== _this2.state.values.min || defaultValue.end !== _this2.state.values.max && nextProps.range.start <= defaultValue.start && nextProps.range.end >= defaultValue.end) {
					var rem = (defaultValue.end - defaultValue.start) % nextProps.stepValue;
					if (rem) {
						_this2.setState({
							values: {
								min: _this2.state.values.min,
								max: defaultValue.end - rem
							}
						});
						var obj = {
							key: _this2.props.componentId,
							value: {
								from: _this2.state.values.min,
								to: defaultValue.end - rem
							}
						};
						setTimeout(function () {
							if (_this2.props.onValueChange) {
								_this2.props.onValueChange(obj.value);
							}
							helper.URLParams.update(_this2.props.componentId, _this2.setURLParam(obj.value), _this2.props.URLParams);
							helper.selectedSensor.set(obj, true);
						}, 1000);
					} else {
						var values = {};
						values.min = defaultValue.start;
						values.max = defaultValue.end;
						_this2.setState({
							values: values,
							currentValues: values
						});
						var _obj = {
							key: _this2.props.componentId,
							value: {
								from: values.min,
								to: values.max
							}
						};
						setTimeout(function () {
							if (_this2.props.onValueChange) {
								_this2.props.onValueChange(_obj.value);
							}
							helper.URLParams.update(_this2.props.componentId, _this2.setURLParam(_obj.value), _this2.props.URLParams);
							helper.selectedSensor.set(_obj, true);
						}, 1000);
					}
				}
				// check range
				if (nextProps.range.start !== _this2.state.startThreshold || nextProps.range.end !== _this2.state.endThreshold) {
					if (nextProps.range.start <= defaultValue.start && nextProps.range.end >= defaultValue.end) {
						_this2.setState({
							startThreshold: nextProps.range.start,
							endThreshold: nextProps.range.end
						});
					} else {
						var _values = {
							min: _this2.state.values.min,
							max: _this2.state.values.max
						};
						if (_this2.state.values.min < nextProps.range.start) {
							_values.min = nextProps.range.start;
						}
						if (_this2.state.values.max > nextProps.range.end) {
							_values.max = nextProps.range.end;
						}
						_this2.setState({
							startThreshold: nextProps.range.start,
							endThreshold: nextProps.range.end,
							values: _values
						});
						var currentRange = {
							from: _values.min,
							to: _values.max
						};
						var _obj2 = {
							key: _this2.props.componentId,
							value: currentRange
						};
						if (_this2.props.onValueChange) {
							_this2.props.onValueChange(_obj2.value);
						}
						helper.URLParams.update(_this2.props.componentId, _this2.setURLParam(_obj2.value), _this2.props.URLParams);
						helper.selectedSensor.set(_obj2, true);
					}
					_this2.setRangeValue();
				}
				// drop value if it exceeds the threshold (based on step value)
				if (nextProps.stepValue !== _this2.props.stepValue) {
					var _rem = (defaultValue.end - defaultValue.start) % nextProps.stepValue;
					if (_rem) {
						_this2.setState({
							values: {
								min: _this2.state.values.min,
								max: defaultValue.end - _rem
							}
						});
						var _obj3 = {
							key: _this2.props.componentId,
							value: {
								from: _this2.state.values.min,
								to: defaultValue.end - _rem
							}
						};
						if (_this2.props.onValueChange) {
							_this2.props.onValueChange(_obj3.value);
						}
						helper.URLParams.update(_this2.props.componentId, _this2.setURLParam(_obj3.value), _this2.props.URLParams);
						helper.selectedSensor.set(_obj3, true);
					}
				}
			}, 300);
		}
	}, {
		key: "shouldComponentUpdate",
		value: function shouldComponentUpdate(nextProps, nextState) {
			if (nextProps.stepValue <= 0 || nextProps.stepValue > Math.floor((nextProps.range.end - nextProps.range.start) / 2)) {
				console.error("Step value is invalid, it should be less than or equal to " + Math.floor((nextProps.range.end - nextProps.range.start) / 2) + ".");
				return false;
			} else if (nextState.values.max > nextState.endThreshold) {
				return false;
			}
			return true;
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			if (this.channelId) {
				_ChannelManager2.default.stopStream(this.channelId);
			}
			if (this.channelListener) {
				this.channelListener.remove();
			}
			if (this.loadListener) {
				this.loadListener.remove();
			}
		}
	}, {
		key: "setURLParam",
		value: function setURLParam(value) {
			if ("from" in value && "to" in value) {
				value = {
					start: value.from,
					end: value.to
				};
			}
			return JSON.stringify(value);
		}

		// set the query type and input data

	}, {
		key: "setQueryInfo",
		value: function setQueryInfo() {
			var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField
				}
			};
			var obj1 = {
				key: this.props.componentId + "-internal",
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
	}, {
		key: "setRangeValue",
		value: function setRangeValue() {
			var objValue = {
				key: this.props.componentId + "-internal",
				value: this.props.range
			};
			if (this.props.onValueChange) {
				this.props.onValueChange(objValue.value);
			}
			helper.selectedSensor.set(objValue, true);
		}
	}, {
		key: "customQuery",
		value: function customQuery(record) {
			if (record) {
				return {
					range: _defineProperty({}, this.props.appbaseField, {
						gte: record.start,
						lte: record.end,
						boost: 2.0
					})
				};
			}
		}
	}, {
		key: "histogramQuery",
		value: function histogramQuery() {
			return _defineProperty({}, this.props.appbaseField, {
				"histogram": {
					"field": this.props.appbaseField,
					"interval": this.props.interval ? this.props.interval : Math.ceil((this.props.range.end - this.props.range.start) / 10)
				}
			});
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this3 = this;

			// Set the react - add self aggs query as well with react
			var react = this.props.react ? this.props.react : {};
			react.aggs = {
				key: this.props.appbaseField,
				sort: "asc",
				size: 1000,
				customQuery: this.histogramQuery
			};
			if (react && react.and && typeof react.and === "string") {
				react.and = [react.and];
			} else {
				react.and = react.and ? react.and : [];
			}
			react.and.push(this.props.componentId + "-internal");
			// create a channel and listen the changes
			var channelObj = _ChannelManager2.default.create(this.context.appbaseRef, this.context.type, react);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				if (res.error) {
					_this3.setState({
						queryStart: false
					});
				}
				if (res.appliedQuery && res.startTime > _this3.queryStartTime) {
					_this3.queryStartTime = res.startTime ? res.startTime : 0;
					var data = res.data;
					var rawData = void 0;
					if (res.mode === "streaming") {
						rawData = _this3.state.rawData;
						rawData.hits.hits.push(res.data);
					} else if (res.mode === "historic") {
						rawData = data;
					}
					_this3.setState({
						queryStart: false,
						rawData: rawData
					});
					_this3.setData(data);
				}
			});
			this.listenLoadingChannel(channelObj);
		}
	}, {
		key: "listenLoadingChannel",
		value: function listenLoadingChannel(channelObj) {
			var _this4 = this;

			this.loadListener = channelObj.emitter.addListener(channelObj.channelId + "-query", function (res) {
				if (res.appliedQuery) {
					_this4.setState({
						queryStart: res.queryState
					});
				}
			});
		}
	}, {
		key: "getSize",
		value: function getSize() {
			return Math.min(this.props.range.end - this.props.range.start, this.maxSize);
		}
	}, {
		key: "setData",
		value: function setData(data) {
			try {
				this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
			} catch (e) {
				console.log(e);
			}
		}

		// Handle function when value slider option is changing

	}, {
		key: "handleValuesChange",
		value: function handleValuesChange(component, values) {
			this.setState({
				values: values
			});
		}
	}, {
		key: "countCalc",
		value: function countCalc(min, max, newItems) {
			// const counts = [];
			// const storeItems = {};
			// newItems.forEach((item) => {
			// 	item.key = Math.floor(item.key);
			// 	if (!(item.key in storeItems)) {
			// 		storeItems[item.key] = item.doc_count;
			// 	} else {
			// 		storeItems[item.key] += item.doc_count;
			// 	}
			// });
			// return counts;
			return newItems.map(function (item) {
				return item.doc_count;
			});
		}
	}, {
		key: "addItemsToList",
		value: function addItemsToList(newItems) {
			var _this5 = this;

			newItems = _lodash2.default.orderBy(newItems, ["key"], ["asc"]);
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
					if (!_lodash2.default.isEqual(rangeValue.values, _this5.state.currentValues)) {
						_this5.handleResults(null, rangeValue.values);
					}
				});
			}
		}

		// Handle function when slider option change is completed

	}, {
		key: "handleResults",
		value: function handleResults(textVal, value) {
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
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.URLParams.update(this.props.componentId, this.setURLParam(obj.value), this.props.URLParams);
			helper.selectedSensor.set(obj, true);
			this.setState({
				currentValues: values,
				values: values
			});
		}
	}, {
		key: "render",
		value: function render() {
			var title = null,
			    histogram = null,
			    marks = {};

			if (this.props.title) {
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}
			if (this.state.counts && this.state.counts.length && this.props.showHistogram) {
				histogram = _react2.default.createElement(_HistoGram.HistoGramComponent, { data: this.state.counts });
			}
			if (this.props.rangeLabels.start || this.props.rangeLabels.end) {
				var _marks;

				marks = (_marks = {}, _defineProperty(_marks, this.state.startThreshold, this.props.rangeLabels.start), _defineProperty(_marks, this.state.endThreshold, this.props.rangeLabels.end), _marks);
			}

			var cx = (0, _classnames2.default)({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title,
				"rbc-labels-active": this.props.rangeLabels.start || this.props.rangeLabels.end,
				"rbc-labels-inactive": !this.props.rangeLabels.start && !this.props.rangeLabels.end,
				"rbc-initialloader-active": this.props.initialLoader,
				"rbc-initialloader-inactive": !this.props.initialLoader
			});

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-rangeslider card thumbnail col s12 col-xs-12 " + cx, style: this.props.componentStyle },
				title,
				histogram,
				_react2.default.createElement(
					"div",
					{ className: "rbc-rangeslider-container col s12 col-xs-12" },
					_react2.default.createElement(_rcSlider2.default, {
						range: true,
						value: [this.state.values.min, this.state.values.max],
						min: this.state.startThreshold,
						max: this.state.endThreshold,
						onChange: this.handleResults,
						step: this.props.stepValue,
						marks: marks
					})
				),
				this.props.initialLoader && this.state.queryStart ? _react2.default.createElement(_InitialLoader2.default, { defaultText: this.props.initialLoader }) : null
			);
		}
	}]);

	return RangeSlider;
}(_react.Component);

exports.default = RangeSlider;


RangeSlider.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	range: _react2.default.PropTypes.shape({
		start: helper.validateThreshold,
		end: helper.validateThreshold
	}),
	rangeLabels: _react2.default.PropTypes.shape({
		start: _react2.default.PropTypes.string,
		end: _react2.default.PropTypes.string
	}),
	defaultSelected: _react2.default.PropTypes.shape({
		start: _react2.default.PropTypes.number,
		end: _react2.default.PropTypes.number
	}),
	stepValue: helper.stepValidation,
	showHistogram: _react2.default.PropTypes.bool,
	customQuery: _react2.default.PropTypes.func,
	initialLoader: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	react: _react2.default.PropTypes.object,
	onValueChange: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object,
	interval: _react2.default.PropTypes.number,
	URLParams: _react2.default.PropTypes.bool
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
	componentStyle: {},
	URLParams: false
};

// context type
RangeSlider.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
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
	initialLoader: TYPES.OBJECT,
	componentStyle: TYPES.OBJECT,
	interval: TYPES.NUMBER,
	URLParams: TYPES.BOOLEAN
};