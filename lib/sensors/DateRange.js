"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDates = require("react-dates");

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require("../middleware/constants");

var TYPES = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var moment = require("moment");
var _ = require("lodash");
var momentPropTypes = require("react-moment-proptypes");
var helper = require("../middleware/helper");

var DateRange = function (_Component) {
	_inherits(DateRange, _Component);

	function DateRange(props) {
		_classCallCheck(this, DateRange);

		var _this = _possibleConstructorReturn(this, (DateRange.__proto__ || Object.getPrototypeOf(DateRange)).call(this, props));

		_this.state = {
			currentValue: {
				startDate: _this.props.defaultSelected.start,
				endDate: _this.props.defaultSelected.end
			},
			focusedInput: null
		};
		_this.type = "range";
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.onFocusChange = _this.onFocusChange.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(DateRange, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.setQueryInfo();
			this.checkDefault();
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			this.checkDefault();
		}

		// handle focus

	}, {
		key: "onFocusChange",
		value: function onFocusChange(focusedInput) {
			this.setState({ focusedInput: focusedInput });
		}

		// set the query type and input data

	}, {
		key: "setQueryInfo",
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
	}, {
		key: "isDateChange",
		value: function isDateChange() {
			var flag = false;

			function checkDefault() {
				var flag1 = false;
				if (this.props.defaultSelected.start && this.props.defaultSelected.end) {
					this.startDate = this.props.defaultSelected.start;
					this.endDate = this.props.defaultSelected.end;
					flag1 = true;
				}
				return flag1;
			}

			try {
				if (this.startDate && this.endDate) {
					if (moment(this.startDate).format("YYYY-MM-DD") !== moment(this.props.defaultSelected.start).format("YYYY-MM-DD") && moment(this.endDate).format("YYYY-MM-DD") !== moment(this.props.defaultSelected.end).format("YYYY-MM-DD")) {
						this.startDate = this.props.defaultSelected.start;
						this.endDate = this.props.defaultSelected.end;
						flag = true;
					}
				} else {
					flag = checkDefault.call(this);
				}
			} catch (e) {
				flag = checkDefault.call(this);
			}
			return flag;
		}
	}, {
		key: "checkDefault",
		value: function checkDefault() {
			if (this.isDateChange()) {
				var dateSelectionObj = {
					startDate: this.startDate,
					endDate: this.endDate
				};
				setTimeout(this.handleChange.bind(this, dateSelectionObj), 1000);
			}
		}

		// build query for this sensor only

	}, {
		key: "customQuery",
		value: function customQuery(value) {
			var query = null;
			if (value && value.startDate && value.endDate) {
				query = this.generateQuery(value);
			}
			return query;
		}
	}, {
		key: "generateQuery",
		value: function generateQuery(value) {
			var query = void 0;
			if (_.isArray(this.props.appbaseField) && this.props.appbaseField.length === 2) {
				query = {
					bool: {
						must: [{
							"range": _defineProperty({}, this.props.appbaseField[0], {
								"lte": moment(value.startDate).format("YYYYMMDD")
							})
						}, {
							"range": _defineProperty({}, this.props.appbaseField[1], {
								"gte": moment(value.endDate).format("YYYYMMDD")
							})
						}]
					}
				};
			} else if (_.isArray(this.props.appbaseField)) {
				query = {
					range: _defineProperty({}, this.props.appbaseField[0], {
						gte: moment(value.startDate).format("YYYYMMDD"),
						lte: moment(value.endDate).format("YYYYMMDD")
					})
				};
			} else {
				query = {
					range: _defineProperty({}, this.props.appbaseField, {
						gte: value.startDate,
						lte: value.endDate
					})
				};
			}
			return query;
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: "handleChange",
		value: function handleChange(inputVal) {
			this.setState({
				currentValue: inputVal
			});
			if (inputVal.startDate && inputVal.endDate) {
				this.setValue(inputVal);
			}
		}
	}, {
		key: "setValue",
		value: function setValue(inputVal) {
			var obj = {
				key: this.props.componentId,
				value: inputVal
			};
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
		}

		// allow all dates

	}, {
		key: "allowAllDates",
		value: function allowAllDates() {
			var outsideObj = void 0;
			if (this.props.allowAllDates) {
				outsideObj = {
					isOutsideRange: function isOutsideRange() {
						return false;
					}
				};
			}

			return outsideObj;
		}

		// render

	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var title = null;
			if (this.props.title) {
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}

			var cx = (0, _classnames2.default)({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title
			});
			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-daterange col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				title,
				_react2.default.createElement(
					"div",
					{ className: "rbc-daterange-component col s12 col-xs-12" },
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

exports.default = DateRange;


DateRange.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.array]),
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	defaultSelected: _react2.default.PropTypes.shape({
		start: momentPropTypes.momentObj,
		end: momentPropTypes.momentObj
	}),
	numberOfMonths: _react2.default.PropTypes.number,
	allowAllDates: _react2.default.PropTypes.bool,
	extra: _react2.default.PropTypes.any,
	customQuery: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object
};

// Default props value
DateRange.defaultProps = {
	numberOfMonths: 2,
	allowAllDates: true,
	defaultSelected: {
		start: null,
		end: null
	}
};

// context type
DateRange.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

DateRange.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.STRING,
	title: TYPES.STRING,
	defaultSelected: TYPES.OBJECT,
	numberOfMonths: TYPES.NUMBER,
	allowAllDates: TYPES.BOOLEAN,
	extra: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT
};