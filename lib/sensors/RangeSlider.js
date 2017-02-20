'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RangeSlider = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

var _HistoGram = require('./component/HistoGram.js');

var _rcSlider = require('rc-slider');

var _rcSlider2 = _interopRequireDefault(_rcSlider);

var _InitialLoader = require('./InitialLoader');

var _constants = require('../middleware/constants.js');

var TYPES = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');
var _ = require('lodash');

var RangeSlider = exports.RangeSlider = function (_Component) {
	_inherits(RangeSlider, _Component);

	function RangeSlider(props, context) {
		_classCallCheck(this, RangeSlider);

		var _this = _possibleConstructorReturn(this, (RangeSlider.__proto__ || Object.getPrototypeOf(RangeSlider)).call(this, props));

		var startThreshold = _this.props.range.start ? _this.props.range.start : 0;
		var endThreshold = _this.props.range.end ? _this.props.range.end : 5;
		var values = {};
		values.min = _this.props.defaultSelected.start < startThreshold ? startThreshold : _this.props.defaultSelected.start;
		values.max = _this.props.defaultSelected.end < endThreshold ? _this.props.defaultSelected.end : endThreshold;
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
		_this.type = 'range';
		_this.channelId = null;
		_this.channelListener = null;
		_this.handleValuesChange = _this.handleValuesChange.bind(_this);
		_this.handleResults = _this.handleResults.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(RangeSlider, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.setQueryInfo();
			this.createChannel();
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.channelId) {
				_ChannelManager.manager.stopStream(this.channelId);
			}
			if (this.channelListener) {
				this.channelListener.remove();
			}
			if (this.loadListener) {
				this.loadListener.remove();
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var _this2 = this;

			setTimeout(function () {
				// check defaultSelected
				if (nextProps.defaultSelected.start !== _this2.state.values.min || nextProps.defaultSelected.end !== _this2.state.values.max && nextProps.range.start <= nextProps.defaultSelected.start && nextProps.range.end >= nextProps.defaultSelected.end) {
					var rem = (nextProps.defaultSelected.end - nextProps.defaultSelected.start) % nextProps.stepValue;
					if (rem) {
						_this2.setState({
							values: {
								min: _this2.state.values.min,
								max: nextProps.defaultSelected.end - rem
							}
						});
						var obj = {
							key: _this2.props.componentId,
							value: {
								from: _this2.state.values.min,
								to: nextProps.defaultSelected.end - rem
							}
						};
						helper.selectedSensor.set(obj, true);
					} else {
						var values = {};
						values.min = nextProps.defaultSelected.start;
						values.max = nextProps.defaultSelected.end;
						_this2.setState({
							values: values,
							currentValues: values
						});
						var obj = {
							key: _this2.props.componentId,
							value: {
								from: values.min,
								to: values.max
							}
						};
						helper.selectedSensor.set(obj, true);
					}
				}
				// check range
				if (nextProps.range.start !== _this2.state.startThreshold || nextProps.range.end !== _this2.state.endThreshold) {
					if (nextProps.range.start <= nextProps.defaultSelected.start && nextProps.range.end >= nextProps.defaultSelected.end) {
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
						var obj = {
							key: _this2.props.componentId,
							value: currentRange
						};
						helper.selectedSensor.set(obj, true);
					}
					_this2.setRangeValue();
				}
				// drop value if it exceeds the threshold (based on step value)
				if (nextProps.stepValue !== _this2.props.stepValue) {
					var _rem = (nextProps.defaultSelected.end - nextProps.defaultSelected.start) % nextProps.stepValue;
					if (_rem) {
						_this2.setState({
							values: {
								min: _this2.state.values.min,
								max: nextProps.defaultSelected.end - _rem
							}
						});
						var obj = {
							key: _this2.props.componentId,
							value: {
								from: _this2.state.values.min,
								to: nextProps.defaultSelected.end - _rem
							}
						};
						helper.selectedSensor.set(obj, true);
					}
				}
			}, 300);
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			if (nextProps.stepValue <= 0 || nextProps.stepValue > Math.floor((nextProps['range']['end'] - nextProps['range']['start']) / 2)) {
				console.error('Step value is invalid, it should be less than or equal to ' + Math.floor((nextProps['range']['end'] - nextProps['range']['start']) / 2) + '.');
				return false;
			} else if (nextState.values.max > nextState.endThreshold) {
				return false;
			} else {
				return true;
			}
		}

		// Handle function when value slider option is changing

	}, {
		key: 'handleValuesChange',
		value: function handleValuesChange(component, values) {
			this.setState({
				values: values
			});
		}

		// set the query type and input data

	}, {
		key: 'setQueryInfo',
		value: function setQueryInfo() {
			var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField
				}
			};
			var obj1 = {
				key: this.props.componentId + '-internal',
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
	}, {
		key: 'setRangeValue',
		value: function setRangeValue() {
			var objValue = {
				key: this.props.componentId + '-internal',
				value: this.props.range
			};
			helper.selectedSensor.set(objValue, true);
		}
	}, {
		key: 'customQuery',
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

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			// Set the react - add self aggs query as well with react
			var react = this.props.react ? this.props.react : {};
			react['aggs'] = {
				key: this.props.appbaseField,
				sort: 'asc',
				size: 1000
			};
			if (react && react.and && typeof react.and === 'string') {
				react.and = [react.and];
			} else {
				react.and = react.and ? react.and : [];
			}
			react.and.push(this.props.componentId + '-internal');
			// create a channel and listen the changes
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, react);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				if (res.error) {
					this.setState({
						queryStart: false
					});
				}
				if (res.appliedQuery) {
					var data = res.data;
					var rawData = void 0;
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
					this.setData(data);
				}
			}.bind(this));
			this.listenLoadingChannel(channelObj);
		}
	}, {
		key: 'listenLoadingChannel',
		value: function listenLoadingChannel(channelObj) {
			this.loadListener = channelObj.emitter.addListener(channelObj.channelId + '-query', function (res) {
				if (res.appliedQuery) {
					this.setState({
						queryStart: res.queryState
					});
				}
			}.bind(this));
		}
	}, {
		key: 'getSize',
		value: function getSize() {
			return Math.min(this.props.range.end - this.props.range.start, this.maxSize);
		}
	}, {
		key: 'setData',
		value: function setData(data) {
			try {
				this.addItemsToList(eval('data.aggregations["' + this.props.appbaseField + '"].buckets'));
			} catch (e) {
				console.log(e);
			}
		}
	}, {
		key: 'addItemsToList',
		value: function addItemsToList(newItems) {
			var _this3 = this;

			newItems = _.orderBy(newItems, ['key'], ['asc']);
			var itemLength = newItems.length;
			var min = this.state.startThreshold ? this.state.startThreshold : newItems[0].key;
			var max = this.state.endThreshold ? this.state.endThreshold : newItems[itemLength - 1].key;
			if (itemLength > 1) {
				(function () {
					var rangeValue = {
						counts: _this3.countCalc(min, max, newItems),
						startThreshold: min,
						endThreshold: max,
						values: {
							min: _this3.state.values.min,
							max: _this3.state.values.max
						}
					};
					_this3.setState(rangeValue, function () {
						this.handleResults(null, rangeValue.values);
					}.bind(_this3));
				})();
			}
		}
	}, {
		key: 'countCalc',
		value: function countCalc(min, max, newItems) {
			var counts = [];
			var storeItems = {};
			newItems = newItems.map(function (item) {
				item.key = Math.floor(item.key);
				if (!storeItems.hasOwnProperty(item.key)) {
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

	}, {
		key: 'handleResults',
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
			var real_values = {
				from: values.min,
				to: values.max
			};
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
	}, {
		key: 'render',
		value: function render() {
			var title = null,
			    histogram = null,
			    marks = {};

			if (this.props.title) {
				title = _react2.default.createElement(
					'h4',
					{ className: 'rbc-title col s12 col-xs-12' },
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
				'rbc-title-active': this.props.title,
				'rbc-title-inactive': !this.props.title,
				'rbc-labels-active': this.props.rangeLabels.start || this.props.rangeLabels.end,
				'rbc-labels-inactive': !this.props.rangeLabels.start && !this.props.rangeLabels.end
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-rangeslider card thumbnail col s12 col-xs-12 ' + cx },
				title,
				histogram,
				_react2.default.createElement(
					'div',
					{ className: 'rbc-rangeslider-container col s12 col-xs-12' },
					_react2.default.createElement(_rcSlider2.default, { range: true,
						value: [this.state.values.min, this.state.values.max],
						min: this.state.startThreshold,
						max: this.state.endThreshold,
						onChange: this.handleResults,
						step: this.props.stepValue,
						marks: marks
					})
				),
				this.props.initialLoader.show ? _react2.default.createElement(_InitialLoader.InitialLoader, { defaultText: this.props.initialLoader.text, queryState: this.state.queryStart }) : null
			);
		}
	}]);

	return RangeSlider;
}(_react.Component);

RangeSlider.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.string,
	range: _react2.default.PropTypes.shape({
		start: helper.validateThreshold,
		end: helper.validateThreshold
	}),
	defaultSelected: _react2.default.PropTypes.object,
	showHistogram: _react2.default.PropTypes.bool,
	stepValue: helper.stepValidation,
	rangeLabels: _react2.default.PropTypes.shape({
		start: _react2.default.PropTypes.string,
		end: _react2.default.PropTypes.string
	}),
	initialLoader: _react2.default.PropTypes.shape({
		show: _react2.default.PropTypes.bool,
		text: _react2.default.PropTypes.string
	})
};

RangeSlider.defaultProps = {
	defaultSelected: {
		start: 0,
		end: 10
	},
	range: {
		start: 0,
		end: 10
	},
	rangeLabels: {
		start: null,
		end: null
	},
	showHistogram: true,
	stepValue: 1,
	title: null,
	initialLoader: {
		show: true
	}
};

// context type
RangeSlider.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

RangeSlider.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	range: TYPES.OBJECT,
	defaultSelected: TYPES.OBJECT,
	stepValue: TYPES.NUMBER,
	rangeLabels: TYPES.OBJECT,
	initialLoader: TYPES.OBJECT
};