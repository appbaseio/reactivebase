'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DateRange = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDates = require('react-dates');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var moment = require('moment');
var momentPropTypes = require('react-moment-proptypes');

var helper = require('../middleware/helper.js');

var DateRange = exports.DateRange = function (_Component) {
	_inherits(DateRange, _Component);

	function DateRange(props, context) {
		_classCallCheck(this, DateRange);

		var _this = _possibleConstructorReturn(this, (DateRange.__proto__ || Object.getPrototypeOf(DateRange)).call(this, props));

		_this.state = {
			currentValue: {
				startDate: _this.props.startDate,
				endDate: _this.props.endDate
			},
			focusedInput: null
		};
		_this.type = 'range';
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.onFocusChange = _this.onFocusChange.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(DateRange, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.setQueryInfo();
		}

		// set the query type and input data

	}, {
		key: 'setQueryInfo',
		value: function setQueryInfo() {
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

		// build query for this sensor only

	}, {
		key: 'customQuery',
		value: function customQuery(value) {
			var query = null;
			if (value) {
				query = {
					'range': _defineProperty({}, this.props.appbaseField, {
						gte: value.startDate,
						lte: value.endDate
					})
				};
			}
			return query;
		}

		// use this only if want to create actuators
		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			var react = this.props.react ? this.props.react : {};
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, react);
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: 'handleChange',
		value: function handleChange(inputVal) {
			this.setState({
				'currentValue': inputVal
			});
			var obj = {
				key: this.props.componentId,
				value: inputVal
			};
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			helper.selectedSensor.set(obj, isExecuteQuery);
		}

		// handle focus

	}, {
		key: 'onFocusChange',
		value: function onFocusChange(focusedInput) {
			this.setState({ focusedInput: focusedInput });
		}

		// allow all dates

	}, {
		key: 'allowAllDates',
		value: function allowAllDates() {
			var outsideObj = void 0;
			if (this.props.allowAllDates) {
				outsideObj = {
					isOutsideRange: isOutsideRange
				};
			}
			function isOutsideRange() {
				return false;
			}
			// isOutsideRange={() => false}
			return outsideObj;
		}

		// render

	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var title = null;
			if (this.props.title) {
				title = _react2.default.createElement(
					'h4',
					{ className: 'rbc-title col s12 col-xs-12' },
					this.props.title
				);
			}

			var cx = (0, _classnames2.default)({
				'rbc-title-active': this.props.title,
				'rbc-title-inactive': !this.props.title
			});
			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-daterange col s12 col-xs-12 card thumbnail ' + cx },
				title,
				_react2.default.createElement(
					'div',
					{ className: 'rbc-daterange-component col s12 col-xs-12' },
					_react2.default.createElement(_reactDates.DateRangePicker, _extends({
						id: this.props.componentId,
						startDate: this.state.currentValue.startDate,
						endDate: this.state.currentValue.endDate,
						focusedInput: this.state.focusedInput,
						numberOfMonths: this.props.numberOfMonths
					}, this.props.extra, this.allowAllDates(), {
						onDatesChange: function onDatesChange(date) {
							_this2.handleChange(date);
						},
						onFocusChange: this.onFocusChange
					}))
				)
			);
		}
	}]);

	return DateRange;
}(_react.Component);

DateRange.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.string,
	placeholder: _react2.default.PropTypes.string,
	startDate: momentPropTypes.momentObj,
	endDate: momentPropTypes.momentObj,
	numberOfMonths: _react2.default.PropTypes.number,
	allowAllDates: _react2.default.PropTypes.bool,
	extra: _react2.default.PropTypes.any
};

// Default props value
DateRange.defaultProps = {
	placeholder: 'Select Date',
	numberOfMonths: 2,
	allowAllDates: true,
	startDate: null,
	endDate: null
};

// context type
DateRange.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};