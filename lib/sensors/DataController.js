function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";

var helper = require("../middleware/helper");

var DataController = function (_Component) {
	_inherits(DataController, _Component);

	function DataController(props) {
		_classCallCheck(this, DataController);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.type = "match";
		_this.value = "customValue";
		_this.urlParams = helper.URLParams.get(_this.props.componentId);
		return _this;
	}

	// Set query information


	DataController.prototype.componentWillMount = function componentWillMount() {
		this.setQueryInfo();
		this.checkDefault();
	};

	DataController.prototype.componentWillUpdate = function componentWillUpdate() {
		this.checkDefault();
	};

	DataController.prototype.checkDefault = function checkDefault() {
		this.defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		if (this.defaultValue && this.defaultSelected != this.defaultValue) {
			this.defaultSelected = this.defaultValue;
			setTimeout(this.setValue.bind(this, this.defaultSelected), 100);
		}
	};

	// set the query type and input data


	DataController.prototype.setQueryInfo = function setQueryInfo() {
		var valObj = {
			queryType: this.type,
			inputData: this.props.appbaseField,
			reactiveId: this.context.reactiveId,
			showFilter: this.props.showFilter,
			filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
			component: "DataController",
			defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
		};
		if (this.props.customQuery) {
			valObj.customQuery = this.props.customQuery;
		}
		var obj = {
			key: this.props.componentId,
			value: valObj
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	DataController.prototype.setValue = function setValue(value) {
		var _this2 = this;

		var obj = {
			key: this.props.componentId,
			value: value
		};

		var execQuery = function execQuery() {
			if (_this2.props.onValueChange) {
				_this2.props.onValueChange(obj.value);
			}
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			helper.URLParams.update(_this2.props.componentId, value, _this2.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(obj.value).then(function () {
				execQuery();
			}).catch(function (e) {
				console.warn(_this2.props.componentId + " - beforeValueChange rejected the promise with", e);
			});
		} else {
			execQuery();
		}
	};

	// render


	DataController.prototype.render = function render() {
		var title = null,
		    dataLabel = null;
		if (this.props.title) {
			title = React.createElement(
				"h4",
				{ className: "rbc-title col s12 col-xs-12" },
				this.props.title
			);
		}
		if (this.props.dataLabel) {
			dataLabel = React.createElement(
				"span",
				{ className: "rbc-datalabel col s12 col-xs-12" },
				this.props.dataLabel
			);
		}

		var cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-datalabel-active": this.props.dataLabel,
			"rbc-datalabel-inactive": !this.props.dataLabel,
			"rbc-visible-active": this.props.visible,
			"rbc-visible-inactive": !this.props.visible
		});

		return React.createElement(
			"div",
			{ className: "rbc rbc-datacontroller card thumbnail " + cx, style: this.props.componentStyle },
			this.props.visible ? React.createElement(
				"div",
				null,
				title,
				dataLabel
			) : null
		);
	};

	return DataController;
}(Component);

export default DataController;


DataController.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	visible: React.PropTypes.bool,
	dataLabel: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	defaultSelected: React.PropTypes.any,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string
};

React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]);

// Default props value
DataController.defaultProps = {
	visible: false,
	defaultSelected: "default",
	componentStyle: {},
	URLParams: false,
	showFilter: true
};

// context type
DataController.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

DataController.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.STRING,
	title: TYPES.STRING,
	visible: TYPES.BOOLEAN,
	dataLabel: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING
};