"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require("../middleware/constants.js");

var TYPES = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require("../middleware/helper.js");


var TitleComponent = function TitleComponent(props) {
	return _react2.default.createElement(
		"h4",
		{ className: "rbc-title col s12 col-xs-12" },
		props.title
	);
};

var NumberBoxButtonComponent = function NumberBoxButtonComponent(props) {
	var cx = (0, _classnames2.default)({
		"rbc-btn-active": props.isActive,
		"rbc-btn-inactive": !props.isActive
	});
	var type = props.type;

	var increment = type == "plus" ? 1 : -1;

	return _react2.default.createElement(
		"button",
		{ className: "btn rbc-btn " + cx, onClick: props.isActive && function () {
				return props.handleChange(increment);
			} },
		_react2.default.createElement("span", { className: "fa fa-" + type + " rbc-icon" })
	);
};

var NumberComponent = function NumberComponent(props) {
	var label = props.label,
	    end = props.end,
	    start = props.start,
	    handleChange = props.handleChange;

	var value = props.value != undefined ? props.value : start;
	var isPlusActive = end != undefined ? value < end : true;
	var isMinusActive = start != undefined ? value > start : true;

	return _react2.default.createElement(
		"div",
		{ className: "rbc-numberbox-container col s12 col-xs-12" },
		_react2.default.createElement(
			"div",
			{ className: "rbc-label" },
			label
		),
		_react2.default.createElement(
			"div",
			{ className: "rbc-numberbox-btn-container" },
			_react2.default.createElement(NumberBoxButtonComponent, { isActive: isMinusActive, handleChange: handleChange, type: "minus" }),
			_react2.default.createElement(
				"span",
				{ className: "rbc-numberbox-number" },
				value
			),
			_react2.default.createElement(NumberBoxButtonComponent, { isActive: isPlusActive, handleChange: handleChange, type: "plus" })
		)
	);
};

var NumberBox = function (_Component) {
	_inherits(NumberBox, _Component);

	function NumberBox(props, context) {
		_classCallCheck(this, NumberBox);

		var _this = _possibleConstructorReturn(this, (NumberBox.__proto__ || Object.getPrototypeOf(NumberBox)).call(this, props));

		var focused = _this.props.focused;

		_this.urlParams = helper.URLParams.get(_this.props.componentId);
		var defaultSelected = _this.urlParams !== null ? _this.urlParams : _this.props.defaultSelected;
		_this.state = {
			currentValue: defaultSelected ? defaultSelected : _this.props.data.start,
			focused: focused
		};
		_this.type = "term";
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	_createClass(NumberBox, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.setQueryInfo();
			if (this.urlParams !== null) {
				this.updateQuery(this.urlParams);
			} else {
				setTimeout(this.handleChange.bind(this), 1000);
			}
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var _this2 = this;

			setTimeout(function () {
				var defaultValue = _this2.urlParams !== null ? _this2.urlParams : _this2.props.defaultSelected;
				if ((defaultValue || defaultValue === 0) && defaultValue !== _this2.state.currentValue) {
					_this2.setState({
						currentValue: defaultValue
					});
				}
				if (nextProps.queryFormat !== _this2.queryFormat) {
					_this2.queryFormat = nextProps.queryFormat;
					_this2.updateQuery();
				}
			}, 300);
		}

		// build query for this sensor only

	}, {
		key: "customQuery",
		value: function customQuery(queryValue) {
			var query = null;
			if (queryValue && (queryValue.value || queryValue.value === 0)) {
				var value = queryValue.value;
				switch (this.props.queryFormat) {
					case "exact":
						query = this.exactQuery(value);
						break;
					case "lte":
						query = this.lteQuery(value);
						break;
					case "gte":
					default:
						query = this.gteQuery(value);
						break;
				}
			}
			return query;
		}
	}, {
		key: "exactQuery",
		value: function exactQuery(value) {
			return _defineProperty({}, this.type, _defineProperty({}, this.props.appbaseField, value));
		}
	}, {
		key: "gteQuery",
		value: function gteQuery(value) {
			return {
				range: _defineProperty({}, this.props.appbaseField, {
					gte: value,
					boost: 2.0
				})
			};
		}
	}, {
		key: "lteQuery",
		value: function lteQuery(value) {
			return {
				range: _defineProperty({}, this.props.appbaseField, {
					lte: value,
					boost: 2.0
				})
			};
		}
	}, {
		key: "setQueryInfo",
		value: function setQueryInfo() {
			var _props = this.props,
			    componentId = _props.componentId,
			    appbaseField = _props.appbaseField;

			var obj = {
				key: componentId,
				value: {
					queryType: this.type,
					inputData: appbaseField,
					customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: "handleChange",
		value: function handleChange() {
			var increment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var _props2 = this.props,
			    componentId = _props2.componentId,
			    data = _props2.data;
			var start = data.start,
			    end = data.end;

			var inputVal = this.state.currentValue;

			start = start != undefined ? start : inputVal - 1;
			end = end != undefined ? end : inputVal + 1;

			if (increment > 0 && inputVal < end) {
				inputVal += 1;
			} else if (increment < 0 && inputVal > start) {
				inputVal -= 1;
			}

			this.setState({
				currentValue: inputVal
			}, this.updateQuery.bind(this));
		}
	}, {
		key: "updateQuery",
		value: function updateQuery() {
			var currentValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.start.currentValue;

			var obj = {
				key: this.props.componentId,
				value: {
					value: currentValue,
					queryFormat: this.props.queryFormat
				}
			};
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.URLParams.update(this.props.componentId, currentValue, this.props.URLParams);
			helper.selectedSensor.set(obj, true);
		}
	}, {
		key: "render",
		value: function render() {
			var _props3 = this.props,
			    title = _props3.title,
			    data = _props3.data,
			    labelPosition = _props3.labelPosition;
			var currentValue = this.state.currentValue;

			var ComponentTitle = title ? _react2.default.createElement(TitleComponent, { title: title }) : null;
			var cx = (0, _classnames2.default)({
				"rbc-title-active": title,
				"rbc-title-inactive": !title
			});
			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-numberbox col s12 col-xs-12 card thumbnail " + cx + " rbc-label-" + labelPosition, style: this.props.componentStyle },
				_react2.default.createElement(
					"div",
					{ className: "row" },
					ComponentTitle,
					_react2.default.createElement(NumberComponent, {
						handleChange: this.handleChange,
						value: currentValue,
						label: data.label,
						start: data.start,
						end: data.end
					})
				)
			);
		}
	}]);

	return NumberBox;
}(_react.Component);

exports.default = NumberBox;


NumberBox.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	data: _react2.default.PropTypes.shape({
		start: helper.validateThreshold,
		end: helper.validateThreshold,
		label: _react2.default.PropTypes.string
	}),
	defaultSelected: helper.valueValidation,
	labelPosition: _react2.default.PropTypes.oneOf(["top", "bottom", "left", "right"]),
	customQuery: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object,
	queryFormat: _react2.default.PropTypes.oneOf(["exact", "gte", "lte"]),
	URLParams: _react2.default.PropTypes.bool
};

NumberBox.defaultProps = {
	componentStyle: {},
	queryFormat: "gte",
	URLParams: false
};

// context type
NumberBox.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

NumberBox.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.NUMBER,
	labelPosition: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	queryFormat: TYPES.STRING,
	URLParams: TYPES.BOOLEAN
};