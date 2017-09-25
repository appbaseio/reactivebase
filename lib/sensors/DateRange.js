var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			currentValue: {
				startDate: _this.props.defaultSelected.start,
				endDate: _this.props.defaultSelected.end
			},
			focusedInput: null
		};
		_this.type = "range";
		_this.urlParams = props.URLParams ? _this.getURLParams() : null;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.onFocusChange = _this.onFocusChange.bind(_this);
		return _this;
	}

	// Set query information


	DateRange.prototype.componentDidMount = function componentDidMount() {
		this.previousQuery = null; // initial value for onQueryChange
		this.setQueryInfo(this.props);
		this.checkDefault();
		this.listenFilter();
	};

	DateRange.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.checkDefault();
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.handleChange(this.state.currentValue);
		}
	};

	DateRange.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	DateRange.prototype.listenFilter = function listenFilter() {
		var _this2 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this2.props.componentId) {
				_this2.startDate = null;
				_this2.endDate = null;
				var dateSelectionObj = null;
				_this2.handleChange(dateSelectionObj);
			}
		});
	};

	DateRange.prototype.getURLParams = function getURLParams() {
		var urlParams = helper.URLParams.get(this.props.componentId, false, true);
		if (urlParams !== null) {
			urlParams = {
				start: moment(urlParams.start),
				end: moment(urlParams.end)
			};
		}
		return urlParams;
	};

	// handle focus


	DateRange.prototype.onFocusChange = function onFocusChange(focusedInput) {
		this.setState({ focusedInput: focusedInput });
	};

	// set the query type and input data


	DateRange.prototype.setQueryInfo = function setQueryInfo(props) {
		var _this3 = this;

		var getQuery = function getQuery(value) {
			var currentQuery = props.customQuery ? props.customQuery(value) : _this3.customQuery(value);
			if (_this3.props.onQueryChange && JSON.stringify(_this3.previousQuery) !== JSON.stringify(currentQuery)) {
				_this3.props.onQueryChange(_this3.previousQuery, currentQuery);
			}
			_this3.previousQuery = currentQuery;
			return currentQuery;
		};
		var obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.dataField,
				customQuery: getQuery,
				reactiveId: this.context.reactiveId,
				showFilter: props.showFilter,
				filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
				component: "DateRange"
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	DateRange.prototype.isDateChange = function isDateChange() {
		var _this4 = this;

		var flag = false;

		var checkDefault = function checkDefault(defaultSelected) {
			var flag1 = false;
			if (defaultSelected.start && defaultSelected.end) {
				_this4.startDate = defaultSelected.start;
				_this4.endDate = defaultSelected.end;
				flag1 = true;
			}
			return flag1;
		};

		var isChanged = function isChanged(defaultSelected) {
			if (moment(_this4.startDate).format(helper.dateFormat[_this4.props.queryFormat]) !== moment(defaultSelected.start).format(helper.dateFormat[_this4.props.queryFormat]) && moment(_this4.endDate).format(helper.dateFormat[_this4.props.queryFormat]) !== moment(defaultSelected.end).format(helper.dateFormat[_this4.props.queryFormat])) {
				_this4.startDate = defaultSelected.start;
				_this4.endDate = defaultSelected.end;
				flag = true;
			}
			return flag;
		};
		var defaultSelected = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		try {
			if (this.startDate && this.endDate) {
				flag = isChanged(defaultSelected);
			} else {
				flag = checkDefault.call(this, defaultSelected);
			}
		} catch (e) {
			flag = checkDefault.call(this, defaultSelected);
		}
		return flag;
	};

	DateRange.prototype.checkDefault = function checkDefault() {
		if (this.isDateChange()) {
			var dateSelectionObj = {
				startDate: this.startDate,
				endDate: this.endDate
			};
			setTimeout(this.handleChange.bind(this, dateSelectionObj), 1000);
		}
	};

	// build query for this sensor only


	DateRange.prototype.customQuery = function customQuery(value) {
		var query = null;
		if (value && value.startDate && value.endDate) {
			query = this.generateQuery(value);
		}
		return query;
	};

	DateRange.prototype.generateQuery = function generateQuery(value) {
		var query = void 0;
		if (Array.isArray(this.props.dataField) && this.props.dataField.length === 2) {
			var _range, _range2;

			query = {
				bool: {
					must: [{
						range: (_range = {}, _range[this.props.dataField[0]] = {
							lte: moment(value.startDate).format(helper.dateFormat[this.props.queryFormat])
						}, _range)
					}, {
						range: (_range2 = {}, _range2[this.props.dataField[1]] = {
							gte: moment(value.endDate).format(helper.dateFormat[this.props.queryFormat])
						}, _range2)
					}]
				}
			};
		} else if (Array.isArray(this.props.dataField)) {
			var _range3;

			query = {
				range: (_range3 = {}, _range3[this.props.dataField[0]] = {
					gte: moment(value.startDate).format(helper.dateFormat[this.props.queryFormat]),
					lte: moment(value.endDate).format(helper.dateFormat[this.props.queryFormat])
				}, _range3)
			};
		} else {
			var _range4;

			query = {
				range: (_range4 = {}, _range4[this.props.dataField] = {
					gte: moment(value.startDate).format(helper.dateFormat[this.props.queryFormat]),
					lte: moment(value.endDate).format(helper.dateFormat[this.props.queryFormat])
				}, _range4)
			};
		}
		return query;
	};

	// handle the input change and pass the value inside sensor info


	DateRange.prototype.handleChange = function handleChange(inputVal) {
		this.setState({
			currentValue: inputVal
		});
		// if (inputVal.startDate && inputVal.endDate) {
		// 	this.setValue(inputVal);
		// }
		this.setValue(inputVal);
	};

	DateRange.prototype.setValue = function setValue(inputVal) {
		var _this5 = this;

		var obj = {
			key: this.props.componentId,
			value: inputVal
		};

		var nextValue = {
			start: inputVal.startDate,
			end: inputVal.endDate
		};

		var execQuery = function execQuery() {
			var isExecuteQuery = true;
			if (_this5.props.onValueChange) {
				_this5.props.onValueChange(nextValue);
			}
			if (_this5.props.URLParams) {
				helper.URLParams.update(_this5.props.componentId, _this5.urlFriendlyValue(inputVal), _this5.props.URLParams);
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(nextValue).then(function () {
				execQuery();
			}).catch(function (e) {
				console.warn(_this5.props.componentId + " - beforeValueChange rejected the promise with", e);
			});
		} else {
			execQuery();
		}
	};

	DateRange.prototype.urlFriendlyValue = function urlFriendlyValue(value) {
		if (value && value.startDate && value.endDate) {
			value = {
				start: value.startDate,
				end: value.endDate
			};
			value = JSON.stringify(value);
		} else {
			value = null;
		}
		return value;
	};

	// allow all dates


	DateRange.prototype.allowAllDates = function allowAllDates() {
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


	DateRange.prototype.render = function render() {
		var _this6 = this;

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
		}, this.props.className);
		return React.createElement(
			"div",
			{ className: "rbc rbc-daterange col s12 col-xs-12 card thumbnail " + cx, style: this.props.style },
			title,
			React.createElement(
				"div",
				{ className: "rbc-daterange-component col s12 col-xs-12" },
				React.createElement(DateRangePicker, _extends({
					id: this.props.componentId,
					startDate: this.state.currentValue ? this.state.currentValue.startDate : null,
					endDate: this.state.currentValue ? this.state.currentValue.endDate : null,
					focusedInput: this.state.focusedInput,
					numberOfMonths: this.props.numberOfMonths
				}, this.props.extra, this.allowAllDates(), {
					onDatesChange: function onDatesChange(date) {
						_this6.handleChange(date);
					},
					onFocusChange: this.onFocusChange
				}))
			)
		);
	};

	return DateRange;
}(Component);

export default DateRange;


DateRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
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
	onQueryChange: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	style: React.PropTypes.object,
	queryFormat: React.PropTypes.oneOf(Object.keys(helper.dateFormat)),
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	className: React.PropTypes.string
};

// Default props value
DateRange.defaultProps = {
	numberOfMonths: 2,
	allowAllDates: true,
	defaultSelected: {
		start: null,
		end: null
	},
	queryFormat: "epoch_millis",
	URLParams: false,
	showFilter: true
};

// context type
DateRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

DateRange.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.ARRAY,
	dataFieldType: TYPES.DATE,
	title: TYPES.STRING,
	defaultSelected: TYPES.OBJECT,
	numberOfMonths: TYPES.NUMBER,
	allowAllDates: TYPES.BOOLEAN,
	extra: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION,
	queryFormat: TYPES.STRING,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING
};