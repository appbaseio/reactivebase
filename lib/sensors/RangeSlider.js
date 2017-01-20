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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

		var startThreshold = _this.props.startThreshold ? _this.props.startThreshold : 0;
		var endThreshold = _this.props.endThreshold ? _this.props.endThreshold : 5;
		var values = {};
		values.min = _this.props.defaultSelected.start < _this.props.startThreshold ? _this.props.startThreshold : _this.props.defaultSelected.start;
		values.max = _this.props.defaultSelected.end < _this.props.endThreshold ? _this.props.defaultSelected.end : _this.props.endThreshold;
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
		_this.type = 'range';
		_this.channelId = null;
		_this.channelListener = null;
		_this.handleValuesChange = _this.handleValuesChange.bind(_this);
		_this.handleResults = _this.handleResults.bind(_this);
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
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			var _this2 = this;

			setTimeout(function () {
				if (_this2.state.values.min != _this2.props.defaultSelected.start || _this2.state.values.max != _this2.props.defaultSelected.end) {
					var values = {};
					values.min = _this2.props.defaultSelected.start;
					values.max = _this2.props.defaultSelected.end;
					_this2.setState({
						values: values,
						currentValues: values
					});
					var obj = {
						key: _this2.props.sensorId,
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
				key: this.props.sensorId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}

		// Create a channel which passes the depends and receive results whenever depends changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			// Set the depends - add self aggs query as well with depends
			var depends = this.props.depends ? this.props.depends : {};
			depends['aggs'] = {
				key: this.props.appbaseField,
				sort: this.props.sort,
				size: this.props.size
			};
			// create a channel and listen the changes
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, depends);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				var data = res.data;
				var rawData = void 0;
				if (res.mode === 'streaming') {
					rawData = this.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === 'historic') {
					rawData = data;
				}
				this.setState({
					rawData: rawData
				});
				this.setData(data);
			}.bind(this));
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
			var min = this.props.startThreshold ? this.props.startThreshold : newItems[0].key;
			var max = this.props.endThreshold ? this.props.endThreshold : newItems[itemLength - 1].key;
			if (itemLength > 1) {
				(function () {
					var rangeValue = {
						counts: _this3.countCalc(min, max, newItems),
						startThreshold: min,
						endThreshold: max,
						values: {
							min: min,
							max: max
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
			for (var i = min; i <= max; i++) {
				var item = _.find(newItems, { 'key': i });
				var val = item ? item.doc_count : 0;
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
				key: this.props.sensorId,
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
			    histogram = null;

			if (this.props.title) {
				title = _react2.default.createElement(
					'h4',
					{ className: 'rbc-title col s12 col-xs-12' },
					this.props.title
				);
			}
			if (this.state.counts && this.state.counts.length) {
				histogram = _react2.default.createElement(_HistoGram.HistoGramComponent, { data: this.state.counts });
			}

			var cx = (0, _classnames2.default)({
				'rbc-title-active': this.props.title,
				'rbc-title-inactive': !this.props.title
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-rangeslider card thumbnail col s12 col-xs-12 ' + cx },
				title,
				histogram,
				_react2.default.createElement(
					'div',
					{ className: 'rbc-rangeslider-container col s12 col-xs-12', style: { 'margin': '25px 0' } },
					_react2.default.createElement(_rcSlider2.default, { range: true,
						value: [this.state.values.min, this.state.values.max],
						min: this.state.startThreshold,
						max: this.state.endThreshold,
						onAfterChange: this.handleResults,
						step: this.props.stepValue
					})
				)
			);
		}
	}]);

	return RangeSlider;
}(_react.Component);

RangeSlider.propTypes = {
	sensorId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	startThreshold: _react2.default.PropTypes.number,
	endThreshold: _react2.default.PropTypes.number,
	defaultSelected: _react2.default.PropTypes.object,
	stepValue: _react2.default.PropTypes.number
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
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};