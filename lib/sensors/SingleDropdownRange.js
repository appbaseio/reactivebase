import _isEqual from "lodash/isEqual";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";
import Select from "react-select";
import * as TYPES from "../middleware/constants";


var helper = require("../middleware/helper");

var SingleDropdownRange = function (_Component) {
	_inherits(SingleDropdownRange, _Component);

	function SingleDropdownRange(props) {
		_classCallCheck(this, SingleDropdownRange);

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


	SingleDropdownRange.prototype.componentWillMount = function componentWillMount() {
		this.previousQuery = null; // initial value for onQueryChange
		this.setQueryInfo(this.props);
		this.checkDefault(this.props);
		this.listenFilter();
	};

	SingleDropdownRange.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.changeValue(nextProps.defaultSelected);
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.handleChange(this.state.selected);
		}
	};

	SingleDropdownRange.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	SingleDropdownRange.prototype.listenFilter = function listenFilter() {
		var _this2 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this2.props.componentId) {
				_this2.changeValue(null);
			}
		});
	};

	SingleDropdownRange.prototype.checkDefault = function checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId);
		var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	};

	SingleDropdownRange.prototype.changeValue = function changeValue(defaultValue) {
		var _this3 = this;

		if (!_isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if (this.defaultSelected) {
				var records = this.props.data.filter(function (record) {
					return record.label === _this3.defaultSelected;
				});
				if (records && records.length) {
					setTimeout(this.handleChange.bind(this, records[0]), 1000);
				} else {
					this.handleChange(null);
				}
			} else {
				this.handleChange(null);
			}
		}
	};

	// set the query type and input data


	SingleDropdownRange.prototype.setQueryInfo = function setQueryInfo(props) {
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
				component: "SingleDropdownRange",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	// build query for this sensor only


	SingleDropdownRange.prototype.customQuery = function customQuery(record) {
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
	};

	// handle the input change and pass the value inside sensor info


	SingleDropdownRange.prototype.handleChange = function handleChange(record) {
		var _this5 = this;

		this.setState({
			selected: record
		});
		var obj = {
			key: this.props.componentId,
			value: record
		};
		var execQuery = function execQuery() {
			var isExecuteQuery = true;
			if (_this5.props.onValueChange) {
				_this5.props.onValueChange(obj.value);
			}
			_this5.defaultSelected = record;
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

	// render


	SingleDropdownRange.prototype.render = function render() {
		var title = null;
		if (this.props.title) {
			title = React.createElement(
				"h4",
				{ className: "rbc-title col s12 col-xs-12" },
				this.props.title
			);
		}

		var data = this.props.data.map(function (item) {
			item.value = item.label;
			return item;
		});

		var cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder
		}, this.props.className);

		return React.createElement(
			"div",
			{ className: "rbc rbc-singledropdownrange col s12 col-xs-12 card thumbnail " + cx, style: this.props.style },
			React.createElement(
				"div",
				{ className: "row" },
				title,
				React.createElement(
					"div",
					{ className: "col s12 col-xs-12" },
					React.createElement(Select, {
						options: data,
						clearable: false,
						value: this.state.selected,
						onChange: this.handleChange,
						placeholder: this.props.placeholder,
						searchable: true
					})
				)
			)
		);
	};

	return SingleDropdownRange;
}(Component);

export default SingleDropdownRange;


SingleDropdownRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.string.isRequired,
	data: React.PropTypes.any.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	placeholder: React.PropTypes.string,
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	style: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	onQueryChange: React.PropTypes.func,
	filterLabel: React.PropTypes.string,
	className: React.PropTypes.string
};

// Default props value
SingleDropdownRange.defaultProps = {
	style: {},
	URLParams: false,
	showFilter: true
};

// context type
SingleDropdownRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

SingleDropdownRange.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	data: TYPES.OBJECT,
	dataFieldType: TYPES.NUMBER,
	defaultSelected: TYPES.STRING,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	filterLabel: TYPES.STRING,
	className: TYPES.STRING
};