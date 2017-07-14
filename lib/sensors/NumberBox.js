function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";
var helper = require("../middleware/helper.js");
import * as TYPES from "../middleware/constants.js";

var TitleComponent = function TitleComponent(props) {
	return React.createElement(
		"h4",
		{ className: "rbc-title col s12 col-xs-12" },
		props.title
	);
};

var NumberBoxButtonComponent = function NumberBoxButtonComponent(props) {
	var cx = classNames({
		"rbc-btn-active": props.isActive,
		"rbc-btn-inactive": !props.isActive
	});
	var type = props.type;

	var increment = type == "plus" ? 1 : -1;

	return React.createElement(
		"button",
		{ className: "btn rbc-btn " + cx, onClick: props.isActive && function () {
				return props.handleChange(increment);
			} },
		React.createElement("span", { className: "fa fa-" + type + " rbc-icon" })
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

	return React.createElement(
		"div",
		{ className: "rbc-numberbox-container col s12 col-xs-12" },
		React.createElement(
			"div",
			{ className: "rbc-label" },
			label
		),
		React.createElement(
			"div",
			{ className: "rbc-numberbox-btn-container" },
			React.createElement(NumberBoxButtonComponent, { isActive: isMinusActive, handleChange: handleChange, type: "minus" }),
			React.createElement(
				"span",
				{ className: "rbc-numberbox-number" },
				value
			),
			React.createElement(NumberBoxButtonComponent, { isActive: isPlusActive, handleChange: handleChange, type: "plus" })
		)
	);
};

var NumberBox = function (_Component) {
	_inherits(NumberBox, _Component);

	function NumberBox(props, context) {
		_classCallCheck(this, NumberBox);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

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

	NumberBox.prototype.componentWillMount = function componentWillMount() {
		this.setQueryInfo();
		if (this.urlParams !== null) {
			this.updateQuery(this.urlParams);
		} else {
			setTimeout(this.handleChange.bind(this), 1000);
		}
	};

	NumberBox.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
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
	};

	// build query for this sensor only


	NumberBox.prototype.customQuery = function customQuery(queryValue) {
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
	};

	NumberBox.prototype.exactQuery = function exactQuery(value) {
		var _type, _ref;

		return _ref = {}, _ref[this.type] = (_type = {}, _type[this.props.appbaseField] = value, _type), _ref;
	};

	NumberBox.prototype.gteQuery = function gteQuery(value) {
		var _range;

		return {
			range: (_range = {}, _range[this.props.appbaseField] = {
				gte: value,
				boost: 2.0
			}, _range)
		};
	};

	NumberBox.prototype.lteQuery = function lteQuery(value) {
		var _range2;

		return {
			range: (_range2 = {}, _range2[this.props.appbaseField] = {
				lte: value,
				boost: 2.0
			}, _range2)
		};
	};

	NumberBox.prototype.setQueryInfo = function setQueryInfo() {
		var _props = this.props,
		    componentId = _props.componentId,
		    appbaseField = _props.appbaseField;

		var obj = {
			key: componentId,
			value: {
				queryType: this.type,
				inputData: appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery,
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	// handle the input change and pass the value inside sensor info


	NumberBox.prototype.handleChange = function handleChange() {
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
	};

	NumberBox.prototype.updateQuery = function updateQuery() {
		var currentValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.currentValue;

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
	};

	NumberBox.prototype.render = function render() {
		var _props3 = this.props,
		    title = _props3.title,
		    data = _props3.data,
		    labelPosition = _props3.labelPosition;
		var currentValue = this.state.currentValue;

		var ComponentTitle = title ? React.createElement(TitleComponent, { title: title }) : null;
		var cx = classNames({
			"rbc-title-active": title,
			"rbc-title-inactive": !title
		});
		return React.createElement(
			"div",
			{ className: "rbc rbc-numberbox col s12 col-xs-12 card thumbnail " + cx + " rbc-label-" + labelPosition, style: this.props.componentStyle },
			React.createElement(
				"div",
				{ className: "row" },
				ComponentTitle,
				React.createElement(NumberComponent, {
					handleChange: this.handleChange,
					value: currentValue,
					label: data.label,
					start: data.start,
					end: data.end
				})
			)
		);
	};

	return NumberBox;
}(Component);

export default NumberBox;


NumberBox.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	data: React.PropTypes.shape({
		start: helper.validateThreshold,
		end: helper.validateThreshold,
		label: React.PropTypes.string
	}),
	defaultSelected: helper.valueValidation,
	labelPosition: React.PropTypes.oneOf(["top", "bottom", "left", "right"]),
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	queryFormat: React.PropTypes.oneOf(["exact", "gte", "lte"]),
	URLParams: React.PropTypes.bool
};

NumberBox.defaultProps = {
	componentStyle: {},
	queryFormat: "gte",
	URLParams: false
};

// context type
NumberBox.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
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