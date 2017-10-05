function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
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
		_this.urlParams = props.URLParams ? helper.URLParams.get(props.componentId) : null;
		return _this;
	}

	// Set query information


	DataController.prototype.componentWillMount = function componentWillMount() {
		this.previousQuery = null; // initial value for onQueryChange
		this.setQueryInfo(this.props);
		this.checkDefault();
	};

	DataController.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.setValue(this.defaultSelected);
		}
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected);
		}
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


	DataController.prototype.setQueryInfo = function setQueryInfo(props) {
		var _this2 = this;

		var valObj = {
			queryType: this.type,
			reactiveId: this.context.reactiveId,
			showFilter: props.showFilter,
			filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
			component: "DataController",
			defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
		};
		if (props.customQuery) {
			var customQuery = function customQuery(value) {
				var currentQuery = props.customQuery(value);
				if (_this2.props.onQueryChange && JSON.stringify(_this2.previousQuery) !== JSON.stringify(currentQuery)) {
					_this2.props.onQueryChange(_this2.previousQuery, currentQuery);
				}
				_this2.previousQuery = currentQuery;
				return currentQuery;
			};
			valObj.customQuery = customQuery;
		}
		var obj = {
			key: props.componentId,
			value: valObj
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	DataController.prototype.setValue = function setValue(value) {
		var _this3 = this;

		var obj = {
			key: this.props.componentId,
			value: value
		};

		var execQuery = function execQuery() {
			if (_this3.props.onValueChange) {
				_this3.props.onValueChange(obj.value);
			}
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			if (_this3.props.URLParams) {
				helper.URLParams.update(_this3.props.componentId, value, _this3.props.URLParams);
			}
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
		}, this.props.className);

		return React.createElement(
			"div",
			{ className: "rbc rbc-datacontroller card thumbnail " + cx, style: this.props.style },
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
	componentId: PropTypes.string.isRequired,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	visible: PropTypes.bool,
	dataLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	customQuery: PropTypes.func.isRequired,
	onValueChange: PropTypes.func,
	onQueryChange: PropTypes.func,
	beforeValueChange: PropTypes.func,
	style: PropTypes.object,
	defaultSelected: PropTypes.any,
	URLParams: PropTypes.bool,
	showFilter: PropTypes.bool,
	filterLabel: PropTypes.string,
	className: PropTypes.string
};

PropTypes.oneOfType([PropTypes.string, PropTypes.element]);

// Default props value
DataController.defaultProps = {
	visible: false,
	defaultSelected: "default",
	style: {},
	URLParams: false,
	showFilter: true
};

// context type
DataController.contextTypes = {
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired,
	reactiveId: PropTypes.number
};

DataController.types = {
	componentId: TYPES.STRING,
	title: TYPES.STRING,
	visible: TYPES.BOOLEAN,
	dataLabel: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING
};