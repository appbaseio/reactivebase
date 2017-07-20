var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			currentValue: _this.props.defaultSelected,
			focused: _this.props.focused
		};
		_this.type = "range";
		_this.urlParams = helper.URLParams.get(_this.props.componentId);
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	DatePicker.prototype.componentDidMount = function componentDidMount() {
		this.setQueryInfo();
		if (this.urlParams !== null) {
			this.handleChange(moment(this.urlParams), true);
		}
		this.checkDefault();
		this.listenFilter();
	};

	DatePicker.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
		this.checkDefault();
	};

	DatePicker.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	DatePicker.prototype.listenFilter = function listenFilter() {
		var _this2 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this2.props.componentId) {
				_this2.defaultDate = null;
				_this2.handleChange(_this2.defaultDate);
			}
		});
	};

	// set the query type and input data


	DatePicker.prototype.setQueryInfo = function setQueryInfo() {
		var obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery,
				reactiveId: this.context.reactiveId,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: "DatePicker"
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	DatePicker.prototype.checkDefault = function checkDefault() {
		if (this.urlParams !== null && this.props.queryFormat && helper.dateFormat[this.props.queryFormat] && moment(this.defaultDate).format(helper.dateFormat[this.props.queryFormat]) !== moment(this.urlParams).format(helper.dateFormat[this.props.queryFormat])) {
			this.defaultDate = moment(this.urlParams);
			setTimeout(this.handleChange.bind(this, this.defaultDate), 1000);
		} else if (this.props.defaultSelected && this.props.queryFormat && helper.dateFormat[this.props.queryFormat] && moment(this.defaultDate).format(helper.dateFormat[this.props.queryFormat]) !== moment(this.props.defaultSelected).format(helper.dateFormat[this.props.queryFormat])) {
			this.defaultDate = this.props.defaultSelected;
			setTimeout(this.handleChange.bind(this, this.defaultDate), 1000);
		}
	};

	// build query for this sensor only


	DatePicker.prototype.customQuery = function customQuery(value) {
		var query = null;
		if (value && this.props.queryFormat && helper.dateFormat[this.props.queryFormat]) {
			var _range;

			query = {
				range: (_range = {}, _range[this.props.appbaseField] = {
					gte: moment(value).subtract(24, "hours").format(helper.dateFormat[this.props.queryFormat]),
					lte: moment(value).format(helper.dateFormat[this.props.queryFormat])
				}, _range)
			};
		}
		return query;
	};

	// handle the input change and pass the value inside sensor info


	DatePicker.prototype.handleChange = function handleChange(inputVal) {
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
		helper.URLParams.update(this.props.componentId, inputVal, this.props.URLParams);
		helper.selectedSensor.set(obj, isExecuteQuery);
	};

	// handle focus


	DatePicker.prototype.handleFocus = function handleFocus(focus) {
		this.setState({
			focused: focus
		});
	};

	// allow all dates


	DatePicker.prototype.allowAllDates = function allowAllDates() {
		var outsideObj = void 0;
		if (this.props.allowAllDates) {
			outsideObj = {
				isOutsideRange: function isOutsideRange() {
					return false;
				}
			};
		}

		return outsideObj;
	};

	// render


	DatePicker.prototype.render = function render() {
		var _this3 = this;

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
						_this3.handleChange(date);
					},
					onFocusChange: function onFocusChange(_ref) {
						var focused = _ref.focused;
						_this3.handleFocus(focused);
					}
				}))
			)
		);
	};

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
	queryFormat: React.PropTypes.oneOf(Object.keys(helper.dateFormat)),
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string
};

// Default props value
DatePicker.defaultProps = {
	placeholder: "Select Date",
	numberOfMonths: 1,
	focused: true,
	allowAllDates: true,
	defaultSelected: null,
	componentStyle: {},
	queryFormat: "epoch_millis",
	URLParams: false,
	showFilter: true
};

// context type
DatePicker.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

DatePicker.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.DATE,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	defaultSelected: TYPES.OBJECT,
	focused: TYPES.BOOLEAN,
	numberOfMonths: TYPES.NUMBER,
	allowAllDates: TYPES.BOOLEAN,
	extra: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	queryFormat: TYPES.STRING,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING
};