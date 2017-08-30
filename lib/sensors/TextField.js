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

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			currentValue: ""
		};
		_this.type = "match";
		_this.urlParams = helper.URLParams.get(_this.props.componentId);
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	TextField.prototype.componentWillMount = function componentWillMount() {
		this.setQueryInfo(this.props);
		this.listenFilter();
	};

	TextField.prototype.componentDidMount = function componentDidMount() {
		this.checkDefault(this.props);
	};

	TextField.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.checkDefault(nextProps);
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.setValue(this.state.currentValue);
		}
	};

	TextField.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	TextField.prototype.listenFilter = function listenFilter() {
		var _this2 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this2.props.componentId) {
				_this2.valueChange(null);
			}
		});
	};

	TextField.prototype.checkDefault = function checkDefault(props) {
		this.urlParams = helper.URLParams.get(this.props.componentId);
		var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.valueChange(defaultValue);
	};

	TextField.prototype.valueChange = function valueChange(defaultValue) {
		if (this.defaultSelected != defaultValue) {
			this.defaultSelected = defaultValue;
			this.setValue(this.defaultSelected);
		}
	};

	// set the query type and input data


	TextField.prototype.setQueryInfo = function setQueryInfo(props) {
		var obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.appbaseField,
				customQuery: props.customQuery ? props.customQuery : this.customQuery,
				reactiveId: this.context.reactiveId,
				showFilter: props.showFilter,
				filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
				component: "TextField",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	// build query for this sensor only


	TextField.prototype.customQuery = function customQuery(value) {
		var _type, _ref;

		return _ref = {}, _ref[this.type] = (_type = {}, _type[this.props.appbaseField] = value, _type), _ref;
	};

	// handle the input change and pass the value inside sensor info


	TextField.prototype.handleChange = function handleChange(event) {
		var inputVal = event.target.value;
		this.setValue(inputVal);
	};

	TextField.prototype.setValue = function setValue(inputVal) {
		var _this3 = this;

		this.setState({
			currentValue: inputVal
		});
		var obj = {
			key: this.props.componentId,
			value: inputVal
		};
		this.defaultSelected = inputVal;

		var execQuery = function execQuery() {
			var isExecuteQuery = true;
			if (_this3.props.onValueChange) {
				_this3.props.onValueChange(obj.value);
			}
			helper.URLParams.update(_this3.props.componentId, inputVal, _this3.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(obj.value).then(function () {
				execQuery();
			}).catch(function (e) {
				console.warn(_this3.props.componentId + " - beforeValueChange rejected the promise with", e);
			});
		} else {
			execQuery();
		}
	};

	// render


	TextField.prototype.render = function render() {
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
				React.createElement("input", { className: "rbc-input", type: "text", onChange: this.handleChange, placeholder: this.props.placeholder, value: this.state.currentValue ? this.state.currentValue : "" })
			)
		);
	};

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
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string
};

// Default props value
TextField.defaultProps = {
	componentStyle: {},
	URLParams: false,
	showFilter: true
};

// context type
TextField.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

TextField.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.STRING,
	title: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING
};