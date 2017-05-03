import _isArray from "lodash/isArray";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";
var helper = require("../middleware/helper.js");
import * as TYPES from "../middleware/constants.js";

var ToggleButton = function (_Component) {
	_inherits(ToggleButton, _Component);

	function ToggleButton(props, context) {
		_classCallCheck(this, ToggleButton);

		var _this = _possibleConstructorReturn(this, (ToggleButton.__proto__ || Object.getPrototypeOf(ToggleButton)).call(this, props));

		_this.state = {
			selected: []
		};
		_this.type = "term";
		_this.defaultSelected = _this.props.defaultSelected;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(ToggleButton, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var _this2 = this;

			this.setQueryInfo();
			if (this.defaultSelected) {
				this.defaultSelected = _isArray(this.defaultSelected) ? this.defaultSelected : [this.defaultSelected];
				var records = this.props.data.filter(function (record) {
					return _this2.defaultSelected.indexOf(record.label) > -1;
				});
				if (records && records.length) {
					records.forEach(function (singleRecord) {
						setTimeout(_this2.handleChange.bind(_this2, singleRecord), 1000);
					});
				}
			}
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			var _this3 = this;

			if (this.defaultSelected != this.props.defaultSelected) {
				this.defaultSelected = this.props.defaultSelected;
				this.defaultSelected = _isArray(this.defaultSelected) ? this.defaultSelected : [this.defaultSelected];
				var records = this.props.data.filter(function (record) {
					return _this3.defaultSelected.indexOf(record.label) > -1;
				});
				if (records && records.length) {
					records.forEach(function (singleRecord) {
						setTimeout(_this3.handleChange.bind(_this3, singleRecord), 1000);
					});
				}
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
		value: function customQuery(record) {
			var query = null;
			if (record && record.length) {
				query = {
					bool: {
						should: generateRangeQuery(this.props.appbaseField),
						minimum_should_match: 1,
						boost: 1.0
					}
				};
				return query;
			}
			return query;

			function generateRangeQuery(appbaseField) {
				return record.map(function (singleRecord, index) {
					return {
						term: _defineProperty({}, appbaseField, singleRecord.value)
					};
				});
			}
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: "handleChange",
		value: function handleChange(record) {
			var selected = this.state.selected;
			var newSelection = [];
			var selectedIndex = null;
			selected.forEach(function (selectedRecord, index) {
				if (record.label === selectedRecord.label) {
					selectedIndex = index;
					selected.splice(index, 1);
				}
			});
			if (selectedIndex === null) {
				if (this.props.multiSelect) {
					selected.push(record);
					newSelection = selected;
				} else {
					newSelection.push(record);
				}
			} else {
				newSelection = selected;
			}
			this.setState({
				selected: newSelection
			});
			var obj = {
				key: this.props.componentId,
				value: newSelection
			};
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: "renderButtons",
		value: function renderButtons() {
			var _this4 = this;

			var buttons = void 0;
			var selectedText = this.state.selected.map(function (record) {
				return record.label;
			});
			if (this.props.data) {
				buttons = this.props.data.map(function (record, i) {
					return React.createElement(
						"button",
						{
							key: i, className: "btn rbc-btn " + (selectedText.indexOf(record.label) > -1 ? "rbc-btn-active" : "rbc-btn-inactive"),
							onClick: function onClick() {
								return _this4.handleChange(record);
							}, title: record.title ? record.title : record.label
						},
						record.label
					);
				});
			}
			return buttons;
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
				"rbc-multiselect-active": this.props.multiSelect,
				"rbc-multiselect-inactive": !this.props.multiSelect
			});
			return React.createElement(
				"div",
				{ className: "rbc rbc-togglebutton col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				React.createElement(
					"div",
					{ className: "row" },
					title,
					React.createElement(
						"div",
						{ className: "rbc-buttongroup col s12 col-xs-12" },
						this.renderButtons()
					)
				)
			);
		}
	}]);

	return ToggleButton;
}(Component);

export default ToggleButton;


ToggleButton.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
	multiSelect: React.PropTypes.bool,
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object
};

// Default props value
ToggleButton.defaultProps = {
	multiSelect: true,
	componentStyle: {}
};

// context type
ToggleButton.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

ToggleButton.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.KEYWORD,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	multiSelect: TYPES.BOOLEAN,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT
};