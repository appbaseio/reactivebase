import _isEqual from "lodash/isEqual";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";
var helper = require("../middleware/helper.js");
import * as TYPES from "../middleware/constants.js";

var SingleRange = function (_Component) {
	_inherits(SingleRange, _Component);

	function SingleRange(props, context) {
		_classCallCheck(this, SingleRange);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			selected: null
		};
		_this.type = "range";
		_this.urlParams = helper.URLParams.get(_this.props.componentId);
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	SingleRange.prototype.componentWillMount = function componentWillMount() {
		this.setQueryInfo();
		this.checkDefault(this.props);
		this.listenFilter();
	};

	SingleRange.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		this.checkDefault(nextProps);
	};

	SingleRange.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	SingleRange.prototype.listenFilter = function listenFilter() {
		var _this2 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this2.props.componentId) {
				_this2.changeValue(null);
			}
		});
	};

	SingleRange.prototype.checkDefault = function checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId);
		var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	};

	SingleRange.prototype.changeValue = function changeValue(defaultValue) {
		var _this3 = this;

		if (!_isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if (this.defaultSelected) {
				var records = this.props.data.filter(function (record) {
					return record.label === _this3.defaultSelected;
				});
				if (records && records.length) {
					setTimeout(this.handleChange.bind(this, records[0]), 1000);
				}
			} else {
				this.handleChange(null);
			}
		}
	};

	// set the query type and input data


	SingleRange.prototype.setQueryInfo = function setQueryInfo() {
		var obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery,
				reactiveId: this.context.reactiveId,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: "SingleRange",
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	// build query for this sensor only


	SingleRange.prototype.customQuery = function customQuery(record) {
		if (record) {
			var _range;

			return {
				range: (_range = {}, _range[this.props.appbaseField] = {
					gte: record.start,
					lte: record.end,
					boost: 2.0
				}, _range)
			};
		}
	};

	// handle the input change and pass the value inside sensor info


	SingleRange.prototype.handleChange = function handleChange(record) {
		this.setState({
			selected: record
		});
		var obj = {
			key: this.props.componentId,
			value: record
		};
		this.defaultSelected = record;
		// pass the selected sensor value with componentId as key,
		var isExecuteQuery = true;
		if (this.props.onValueChange) {
			this.props.onValueChange(obj.value);
		}
		helper.URLParams.update(this.props.componentId, record ? record.label : null, this.props.URLParams);
		helper.selectedSensor.set(obj, isExecuteQuery);
	};

	SingleRange.prototype.renderButtons = function renderButtons() {
		var _this4 = this;

		var buttons = void 0;
		var selectedText = this.state.selected && this.state.selected.label ? this.state.selected.label : "";
		if (this.props.data) {
			buttons = this.props.data.map(function (record, i) {
				var cx = classNames({
					"rbc-radio-active": _this4.props.showRadio,
					"rbc-radio-inactive": !_this4.props.showRadio,
					"rbc-list-item-active": selectedText === record.label,
					"rbc-list-item-inactive": selectedText !== record.label
				});

				return React.createElement(
					"div",
					{ className: "rbc-list-item row " + cx, key: i, onClick: function onClick() {
							return _this4.handleChange(record);
						} },
					React.createElement("input", {
						type: "radio",
						className: "rbc-radio-item",
						checked: selectedText === record.label,
						value: record.label
					}),
					React.createElement(
						"label",
						{ className: "rbc-label" },
						record.label
					)
				);
			});
		}
		return buttons;
	};

	// render


	SingleRange.prototype.render = function render() {
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
			"rbc-radio-active": this.props.showRadio,
			"rbc-radio-inactive": !this.props.showRadio
		});

		return React.createElement(
			"div",
			{ className: "rbc rbc-singlerange col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
			React.createElement(
				"div",
				{ className: "row" },
				title,
				React.createElement(
					"div",
					{ className: "col s12 col-xs-12 rbc-list-container" },
					this.renderButtons()
				)
			)
		);
	};

	return SingleRange;
}(Component);

export default SingleRange;


SingleRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	showRadio: React.PropTypes.bool
};

// Default props value
SingleRange.defaultProps = {
	title: null,
	componentStyle: {},
	showFilter: true,
	showRadio: true
};

// context type
SingleRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

SingleRange.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	showRadio: TYPES.BOOLEAN
};