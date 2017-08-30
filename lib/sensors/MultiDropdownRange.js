import _isEqual from "lodash/isEqual";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import Select from "react-select";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";


var helper = require("../middleware/helper");

var MultiDropdownRange = function (_Component) {
	_inherits(MultiDropdownRange, _Component);

	function MultiDropdownRange(props) {
		_classCallCheck(this, MultiDropdownRange);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			selected: ""
		};
		_this.type = "range";
		_this.state.data = _this.props.data.map(function (item) {
			item.value = item.label;
			return item;
		});
		_this.urlParams = helper.URLParams.get(_this.props.componentId, true);
		_this.defaultSelected = _this.urlParams !== null ? _this.urlParams : _this.props.defaultSelected;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	MultiDropdownRange.prototype.componentWillMount = function componentWillMount() {
		var _this2 = this;

		this.setQueryInfo(this.props);
		if (this.defaultSelected) {
			var records = this.state.data.filter(function (record) {
				return _this2.defaultSelected.indexOf(record.label) > -1;
			});
			if (records && records.length) {
				setTimeout(this.handleChange.bind(this, records), 1000);
			}
		}
		this.listenFilter();
	};

	MultiDropdownRange.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.urlParams = helper.URLParams.get(nextProps.componentId, true);
			var defaultValue = this.urlParams !== null ? this.urlParams : nextProps.defaultSelected;
			this.valueChange(defaultValue);
		}
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.valueChange(this.state.selected, true);
		}
	};

	MultiDropdownRange.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	MultiDropdownRange.prototype.listenFilter = function listenFilter() {
		var _this3 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this3.props.componentId) {
				_this3.defaultSelected = null;
				_this3.handleChange(null);
			}
		});
	};

	MultiDropdownRange.prototype.valueChange = function valueChange(defaultValue, execute) {
		var _this4 = this;

		if (!_isEqual(this.defaultSelected, defaultValue) || execute) {
			this.defaultSelected = defaultValue;
			var records = this.state.data.filter(function (record) {
				return _this4.defaultSelected.indexOf(record.label) > -1;
			});
			if (records && records.length) {
				if (this.urlParams !== null) {
					this.handleChange(records);
				} else {
					setTimeout(this.handleChange.bind(this, records), 1000);
				}
			} else {
				setTimeout(this.handleChange.bind(this, null), 1000);
			}
		}
	};

	// set the query type and input data


	MultiDropdownRange.prototype.setQueryInfo = function setQueryInfo(props) {
		var obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.appbaseField,
				customQuery: props.customQuery ? props.customQuery : this.customQuery,
				reactiveId: this.context.reactiveId,
				showFilter: props.showFilter,
				filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
				component: "MultiDropdownRange",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	// build query for this sensor only


	MultiDropdownRange.prototype.customQuery = function customQuery(record) {
		function generateRangeQuery(appbaseField) {
			if (record.length > 0) {
				return record.map(function (singleRecord) {
					var _range;

					return {
						range: (_range = {}, _range[appbaseField] = {
							gte: singleRecord.start,
							lte: singleRecord.end,
							boost: 2.0
						}, _range)
					};
				});
			}
		}

		if (record) {
			var query = {
				bool: {
					should: generateRangeQuery(this.props.appbaseField),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
	};

	// handle the input change and pass the value inside sensor info


	MultiDropdownRange.prototype.handleChange = function handleChange(record) {
		var _this5 = this;

		var selected = record ? [] : null;
		if (record) {
			selected = record.map(function (item) {
				return item.label;
			});
			selected = selected.join();
		}
		selected = selected === "" ? null : selected;
		record = record === "" ? null : record;
		record = record && record.length ? record : null;
		this.setState({
			selected: selected
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
			helper.URLParams.update(_this5.props.componentId, selected, _this5.props.URLParams);
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


	MultiDropdownRange.prototype.render = function render() {
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
			{ className: "rbc rbc-multidropdownrange col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
			React.createElement(
				"div",
				{ className: "row" },
				title,
				React.createElement(
					"div",
					{ className: "col s12 col-xs-12" },
					React.createElement(Select, {
						options: this.state.data,
						value: this.state.selected,
						onChange: this.handleChange,
						clearable: false,
						multi: true,
						placeholder: this.props.placeholder,
						searchable: true
					})
				)
			)
		);
	};

	return MultiDropdownRange;
}(Component);

export default MultiDropdownRange;


MultiDropdownRange.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	placeholder: React.PropTypes.string,
	data: React.PropTypes.any.isRequired,
	beforeValueChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	defaultSelected: React.PropTypes.array,
	customQuery: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string
};

// Default props value
MultiDropdownRange.defaultProps = {
	URLParams: false,
	showFilter: true
};

// context type
MultiDropdownRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

MultiDropdownRange.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.NUMBER,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING
};