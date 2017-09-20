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
		this.previousQuery = null; // initial value for onQueryChange
		this.setQueryInfo(this.props);
		this.checkDefault(this.props);
		this.listenFilter();
	};

	SingleRange.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.checkDefault(nextProps);
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.handleChange(this.state.selected);
		}
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


	SingleRange.prototype.setQueryInfo = function setQueryInfo(props) {
		var _this4 = this;

		var getQuery = function getQuery(value) {
			var currentQuery = props.customQuery ? props.customQuery(value) : _this4.customQuery(value);
			if (_this4.props.onQueryChange && JSON.stringify(_this4.previousQuery) !== JSON.stringify(currentQuery)) {
				_this4.props.onQueryChange(_this4.previousQuery, currentQuery);
			}
			_this4.previousQuery = currentQuery;
			return currentQuery;
		};
		var obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.dataField,
				customQuery: getQuery,
				reactiveId: this.context.reactiveId,
				showFilter: props.showFilter,
				filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
				component: "SingleRange",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	// build query for this sensor only


	SingleRange.prototype.customQuery = function customQuery(record) {
		if (record) {
			var _range;

			return {
				range: (_range = {}, _range[this.props.dataField] = {
					gte: record.start,
					lte: record.end,
					boost: 2.0
				}, _range)
			};
		}
		return null;
	};

	// handle the input change and pass the value inside sensor info


	SingleRange.prototype.handleChange = function handleChange(record) {
		var _this5 = this;

		this.setState({
			selected: record
		});
		var obj = {
			key: this.props.componentId,
			value: record
		};
		this.defaultSelected = record;

		var execQuery = function execQuery() {
			var isExecuteQuery = true;
			if (_this5.props.onValueChange) {
				_this5.props.onValueChange(obj.value);
			}
			helper.URLParams.update(_this5.props.componentId, record ? record.label : null, _this5.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(obj.value).then(function () {
				execQuery();
			}).catch(function (e) {
				console.warn(_this5.props.componentId + " - beforeValueChange rejected the promise with", e);
			});
		} else {
			execQuery();
		}
	};

	SingleRange.prototype.renderButtons = function renderButtons() {
		var _this6 = this;

		var buttons = void 0;
		var selectedText = this.state.selected && this.state.selected.label ? this.state.selected.label : "";
		if (this.props.data) {
			buttons = this.props.data.map(function (record, i) {
				var cx = classNames({
					"rbc-radio-active": _this6.props.showRadio,
					"rbc-radio-inactive": !_this6.props.showRadio,
					"rbc-list-item-active": selectedText === record.label,
					"rbc-list-item-inactive": selectedText !== record.label
				});

				return React.createElement(
					"div",
					{ className: "rbc-list-item row " + cx, key: i, onClick: function onClick() {
							return _this6.handleChange(record);
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
		}, this.props.className);

		return React.createElement(
			"div",
			{ className: "rbc rbc-singlerange col s12 col-xs-12 card thumbnail " + cx, style: this.props.style },
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
	dataField: React.PropTypes.string.isRequired,
	data: React.PropTypes.any.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	style: React.PropTypes.object,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	onQueryChange: React.PropTypes.func,
	showRadio: React.PropTypes.bool,
	className: React.PropTypes.string
};

// Default props value
SingleRange.defaultProps = {
	title: null,
	style: {},
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
	dataField: TYPES.STRING,
	data: TYPES.OBJECT,
	dataFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	onQueryChange: TYPES.FUNCTION,
	showRadio: TYPES.BOOLEAN,
	className: TYPES.STRING
};