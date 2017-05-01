var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { SingleDatePicker } from "react-dates";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";
import moment from "moment";
import momentPropTypes from "react-moment-proptypes";

var helper = require("../middleware/helper");

var DatePicker = function (_Component) {
	_inherits(DatePicker, _Component);

	function DatePicker(props) {
		_classCallCheck(this, DatePicker);

		var _this = _possibleConstructorReturn(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call(this, props));

		_this.state = {
			currentValue: _this.props.defaultSelected,
			focused: _this.props.focused
		};
		_this.type = "range";
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(DatePicker, [{
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
		key: "checkDefault",
		value: function checkDefault() {
			if (this.props.defaultSelected && this.props.queryFormat && helper.dateFormat[this.props.queryFormat] && moment(this.defaultDate).format(helper.dateFormat[this.props.queryFormat]) !== moment(this.props.defaultSelected).format(helper.dateFormat[this.props.queryFormat])) {
				this.defaultDate = this.props.defaultSelected;
				setTimeout(this.handleChange.bind(this, this.defaultDate), 1000);
			}
		}

		// build query for this sensor only

	}, {
		key: "customQuery",
		value: function customQuery(value) {
			var query = null;
			if (value && this.props.queryFormat && helper.dateFormat[this.props.queryFormat]) {
				query = {
					range: _defineProperty({}, this.props.appbaseField, {
						gte: moment(value).subtract(24, "hours").format(helper.dateFormat[this.props.queryFormat]),
						lte: moment(value).format(helper.dateFormat[this.props.queryFormat])
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

		// handle focus

	}, {
		key: "handleFocus",
		value: function handleFocus(focus) {
			this.setState({
				focused: focus
			});
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
				title = React.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}

			var cx = classNames({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title
			});
			return React.createElement(
				"div",
				{ className: "rbc rbc-datepicker col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				title,
				React.createElement(
					"div",
					{ className: "col s12 col-xs-12" },
					React.createElement(SingleDatePicker, _extends({
						id: this.props.componentId,
						date: this.state.currentValue,
						placeholder: this.props.placeholder,
						focused: this.state.focused,
						numberOfMonths: this.props.numberOfMonths
					}, this.props.extra, this.allowAllDates(), {
						onDateChange: function onDateChange(date) {
							_this2.handleChange(date);
						},
						onFocusChange: function onFocusChange(_ref) {
							var focused = _ref.focused;
							_this2.handleFocus(focused);
						}
					}))
				)
			);
		}
	}]);

	return DatePicker;
}(Component);

export default DatePicker;


DatePicker.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	placeholder: React.PropTypes.string,
	defaultSelected: momentPropTypes.momentObj,
	focused: React.PropTypes.bool,
	numberOfMonths: React.PropTypes.number,
	allowAllDates: React.PropTypes.bool,
	extra: React.PropTypes.any,
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	queryFormat: React.PropTypes.oneOf(Object.keys(helper.dateFormat))
};

// Default props value
DatePicker.defaultProps = {
	placeholder: "Select Date",
	numberOfMonths: 1,
	focused: true,
	allowAllDates: true,
	defaultSelected: null,
	componentStyle: {},
	queryFormat: "epoch_millis"
};

// context type
DatePicker.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

DatePicker.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	defaultSelected: TYPES.OBJECT,
	focused: TYPES.BOOLEAN,
	numberOfMonths: TYPES.NUMBER,
	allowAllDates: TYPES.BOOLEAN,
	extra: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	queryFormat: TYPES.STRING
};