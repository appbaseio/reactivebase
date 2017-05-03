var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

		var _this = _possibleConstructorReturn(this, (DataController.__proto__ || Object.getPrototypeOf(DataController)).call(this, props));

		_this.type = "match";
		_this.value = "customValue";
		return _this;
	}

	// Set query information


	_createClass(DataController, [{
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
			var valObj = {
				queryType: this.type,
				inputData: this.props.appbaseField
			};
			if (this.props.customQuery) {
				valObj.customQuery = this.props.customQuery;
			}
			var obj = {
				key: this.props.componentId,
				value: valObj
			};
			helper.selectedSensor.setSensorInfo(obj);
		}
	}, {
		key: "setValue",
		value: function setValue(value) {
			var obj = {
				key: this.props.componentId,
				value: value
			};
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			helper.selectedSensor.set(obj, isExecuteQuery);
		}

		// render

	}, {
		key: "render",
		value: function render() {
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
		}
	}]);

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
	componentStyle: React.PropTypes.object,
	defaultSelected: React.PropTypes.any
};

React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]);

// Default props value
DataController.defaultProps = {
	visible: false,
	defaultSelected: "default",
	componentStyle: {}
};

// context type
DataController.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

DataController.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.STRING,
	title: TYPES.STRING,
	visible: TYPES.BOOLEAN,
	dataLabel: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT
};