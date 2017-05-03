var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";
var helper = require("../middleware/helper.js");
import * as TYPES from "../middleware/constants.js";

var TextField = function (_Component) {
	_inherits(TextField, _Component);

	function TextField(props, context) {
		_classCallCheck(this, TextField);

		var _this = _possibleConstructorReturn(this, (TextField.__proto__ || Object.getPrototypeOf(TextField)).call(this, props));

		_this.state = {
			currentValue: ""
		};
		_this.type = "match";
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(TextField, [{
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
	}, {
		key: "checkDefault",
		value: function checkDefault() {
			if (this.props.defaultSelected && this.defaultSelected != this.props.defaultSelected) {
				this.defaultSelected = this.props.defaultSelected;
				setTimeout(this.setValue.bind(this, this.defaultSelected), 100);
			}
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

		// build query for this sensor only

	}, {
		key: "customQuery",
		value: function customQuery(value) {
			return _defineProperty({}, this.type, _defineProperty({}, this.props.appbaseField, value));
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: "handleChange",
		value: function handleChange(event) {
			var inputVal = event.target.value;
			this.setValue(inputVal);
		}
	}, {
		key: "setValue",
		value: function setValue(inputVal) {
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

		// render

	}, {
		key: "render",
		value: function render() {
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
				"rbc-title-inactive": !this.props.title,
				"rbc-placeholder-active": this.props.placeholder,
				"rbc-placeholder-inactive": !this.props.placeholder
			});

			return React.createElement(
				"div",
				{ className: "rbc rbc-textfield col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				title,
				React.createElement(
					"div",
					{ className: "rbc-input-container col s12 col-xs-12" },
					React.createElement("input", { className: "rbc-input", type: "text", onChange: this.handleChange, placeholder: this.props.placeholder, value: this.state.currentValue })
				)
			);
		}
	}]);

	return TextField;
}(Component);

export default TextField;


TextField.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	defaultSelected: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object
};

// Default props value
TextField.defaultProps = {
	componentStyle: {}
};

// context type
TextField.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

TextField.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.STRING,
	title: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT
};