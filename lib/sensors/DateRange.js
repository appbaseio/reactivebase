import _isArray from "lodash/isArray";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { DateRangePicker } from "react-dates";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";

import moment from "moment";
import momentPropTypes from "react-moment-proptypes";

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
					if (moment(this.startDate).format(helper.dateFormat[this.props.queryFormat]) !== moment(this.props.defaultSelected.start).format(helper.dateFormat[this.props.queryFormat]) && moment(this.endDate).format(helper.dateFormat[this.props.queryFormat]) !== moment(this.props.defaultSelected.end).format(helper.dateFormat[this.props.queryFormat])) {
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
			if (_isArray(this.props.appbaseField) && this.props.appbaseField.length === 2) {
				query = {
					bool: {
						must: [{
							range: _defineProperty({}, this.props.appbaseField[0], {
								lte: moment(value.startDate).format(helper.dateFormat[this.props.queryFormat])
							})
						}, {
							range: _defineProperty({}, this.props.appbaseField[1], {
								gte: moment(value.endDate).format(helper.dateFormat[this.props.queryFormat])
							})
						}]
					}
				};
			} else if (_isArray(this.props.appbaseField)) {
				query = {
					range: _defineProperty({}, this.props.appbaseField[0], {
						gte: moment(value.startDate).format(helper.dateFormat[this.props.queryFormat]),
						lte: moment(value.endDate).format(helper.dateFormat[this.props.queryFormat])
					})
				};
			} else {
				query = {
					range: _defineProperty({}, this.props.appbaseField, {
						gte: moment(value.startDate).format(helper.dateFormat[this.props.queryFormat]),
						lte: moment(value.endDate).format(helper.dateFormat[this.props.queryFormat])
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
				{ className: "rbc rbc-daterange col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				title,
				React.createElement(
					"div",
					{ className: "rbc-daterange-component col s12 col-xs-12" },
					React.createElement(DateRangePicker, _extends({
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
}(Component);

export default DateRange;


DateRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	defaultSelected: React.PropTypes.shape({
		start: momentPropTypes.momentObj,
		end: momentPropTypes.momentObj
	}),
	numberOfMonths: React.PropTypes.number,
	allowAllDates: React.PropTypes.bool,
	extra: React.PropTypes.any,
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	queryFormat: React.PropTypes.oneOf(Object.keys(helper.dateFormat))
};

// Default props value
DateRange.defaultProps = {
	numberOfMonths: 2,
	allowAllDates: true,
	defaultSelected: {
		start: null,
		end: null
	},
	queryFormat: "epoch_millis"
};

// context type
DateRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
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
	queryFormat: TYPES.STRING
};