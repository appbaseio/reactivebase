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

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _reactMomentProptypes = require("react-moment-proptypes");

var _reactMomentProptypes2 = _interopRequireDefault(_reactMomentProptypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
		_this.urlParams = _this.getURLParams();
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
			this.listenFilter();
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps() {
			this.checkDefault();
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			if (this.filterListener) {
				this.filterListener.remove();
			}
		}
	}, {
		key: "listenFilter",
		value: function listenFilter() {
			var _this2 = this;

			this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
				if (data === _this2.props.componentId) {
					_this2.startDate = null;
					_this2.endDate = null;
					var dateSelectionObj = null;
					_this2.handleChange(dateSelectionObj);
				}
			});
		}
	}, {
		key: "getURLParams",
		value: function getURLParams() {
			var urlParams = helper.URLParams.get(this.props.componentId, false, true);
			if (urlParams !== null) {
				urlParams = {
					start: (0, _moment2.default)(urlParams.start),
					end: (0, _moment2.default)(urlParams.end)
				};
			}
			return urlParams;
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
			var _this3 = this;

			var flag = false;

			var checkDefault = function checkDefault(defaultSelected) {
				var flag1 = false;
				if (defaultSelected.start && defaultSelected.end) {
					_this3.startDate = defaultSelected.start;
					_this3.endDate = defaultSelected.end;
					flag1 = true;
				}
				return flag1;
			};

			var isChanged = function isChanged(defaultSelected) {
				if ((0, _moment2.default)(_this3.startDate).format(helper.dateFormat[_this3.props.queryFormat]) !== (0, _moment2.default)(defaultSelected.start).format(helper.dateFormat[_this3.props.queryFormat]) && (0, _moment2.default)(_this3.endDate).format(helper.dateFormat[_this3.props.queryFormat]) !== (0, _moment2.default)(defaultSelected.end).format(helper.dateFormat[_this3.props.queryFormat])) {
					_this3.startDate = defaultSelected.start;
					_this3.endDate = defaultSelected.end;
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
			if (_lodash2.default.isArray(this.props.appbaseField) && this.props.appbaseField.length === 2) {
				query = {
					bool: {
						must: [{
							range: _defineProperty({}, this.props.appbaseField[0], {
								lte: (0, _moment2.default)(value.startDate).format(helper.dateFormat[this.props.queryFormat])
							})
						}, {
							range: _defineProperty({}, this.props.appbaseField[1], {
								gte: (0, _moment2.default)(value.endDate).format(helper.dateFormat[this.props.queryFormat])
							})
						}]
					}
				};
			} else if (_lodash2.default.isArray(this.props.appbaseField)) {
				query = {
					range: _defineProperty({}, this.props.appbaseField[0], {
						gte: (0, _moment2.default)(value.startDate).format(helper.dateFormat[this.props.queryFormat]),
						lte: (0, _moment2.default)(value.endDate).format(helper.dateFormat[this.props.queryFormat])
					})
				};
			} else {
				query = {
					range: _defineProperty({}, this.props.appbaseField, {
						gte: (0, _moment2.default)(value.startDate).format(helper.dateFormat[this.props.queryFormat]),
						lte: (0, _moment2.default)(value.endDate).format(helper.dateFormat[this.props.queryFormat])
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
			// if (inputVal.startDate && inputVal.endDate) {
			// 	this.setValue(inputVal);
			// }
			this.setValue(inputVal);
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
			helper.URLParams.update(this.props.componentId, this.urlFriendlyValue(inputVal), this.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: "urlFriendlyValue",
		value: function urlFriendlyValue(value) {
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
			var _this4 = this;

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
						startDate: this.state.currentValue ? this.state.currentValue.startDate : null,
						endDate: this.state.currentValue ? this.state.currentValue.endDate : null,
						focusedInput: this.state.focusedInput,
						numberOfMonths: this.props.numberOfMonths
					}, this.props.extra, this.allowAllDates(), {
						onDatesChange: function onDatesChange(date) {
							_this4.handleChange(date);
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
		start: _reactMomentProptypes2.default.momentObj,
		end: _reactMomentProptypes2.default.momentObj
	}),
	numberOfMonths: _react2.default.PropTypes.number,
	allowAllDates: _react2.default.PropTypes.bool,
	extra: _react2.default.PropTypes.any,
	customQuery: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object,
	queryFormat: _react2.default.PropTypes.oneOf(Object.keys(helper.dateFormat)),
	URLParams: _react2.default.PropTypes.bool,
	allowFilter: _react2.default.PropTypes.bool
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
	allowFilter: true
};

// context type
DateRange.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

DateRange.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.ARRAY,
	appbaseFieldType: TYPES.DATE,
	title: TYPES.STRING,
	defaultSelected: TYPES.OBJECT,
	numberOfMonths: TYPES.NUMBER,
	allowAllDates: TYPES.BOOLEAN,
	extra: TYPES.OBJECT,
	customQuery: TYPES.FUNCTION,
	queryFormat: TYPES.STRING,
	URLParams: TYPES.BOOLEAN,
	allowFilter: TYPES.BOOLEAN
};