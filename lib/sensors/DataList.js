import _isEqual from "lodash/isEqual";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import { StaticSearch } from "../addons/StaticSearch";


var helper = require("../middleware/helper");

var DataList = function (_Component) {
	_inherits(DataList, _Component);

	function DataList(props) {
		_classCallCheck(this, DataList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			data: [].concat(props.data),
			selected: null,
			selectAll: false
		};

		_this.type = _this.props.multipleSelect ? "Terms" : "Term";
		_this.urlParams = helper.URLParams.get(_this.props.componentId, props.multipleSelect);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.renderObjectList = _this.renderObjectList.bind(_this);
		_this.renderStringList = _this.renderStringList.bind(_this);
		_this.filterBySearch = _this.filterBySearch.bind(_this);
		_this.onSelectAll = _this.onSelectAll.bind(_this);
		return _this;
	}

	DataList.prototype.componentWillMount = function componentWillMount() {
		this.setQueryInfo();
		this.checkDefault(this.props);
		this.listenFilter();
	};

	DataList.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	DataList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.data
		});
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			if (nextProps.defaultSelected && nextProps.defaultSelected === nextProps.selectAllLabel) {
				this.onSelectAll();
			} else {
				this.changeValue(nextProps.defaultSelected);
			}
		}
	};

	DataList.prototype.listenFilter = function listenFilter() {
		var _this2 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this2.props.componentId) {
				_this2.reset();
			}
		});
	};

	DataList.prototype.checkDefault = function checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId, props.multipleSelect);
		var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		if (props.multipleSelect && Array.isArray(defaultValue) && props.selectAllLabel === defaultValue[0] || !props.multipleSelect && props.selectAllLabel === defaultValue) {
			this.onSelectAll();
		} else {
			this.changeValue(defaultValue);
		}
	};

	DataList.prototype.changeValue = function changeValue(defaultValue) {
		var _this3 = this;

		if (!_isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if (defaultValue) {
				if (this.props.multipleSelect) {
					if (Array.isArray(defaultValue)) {
						var selected = [];
						defaultValue.forEach(function (item) {
							_this3.state.data.some(function (record) {
								if (record.label ? record.label === item : record === item) {
									selected.push(record);
									return true;
								}
							});
						});
						// when defaultSelected is updated, the selected values should be set without depending on their previous state
						this.setState({
							selected: selected
						}, function () {
							_this3.defaultSelected = selected;
							_this3.executeQuery(selected);
						});
					} else {
						console.error(this.props.componentId + " - defaultSelected should be an array");
					}
				} else {
					this.state.data.some(function (record) {
						if (record.label ? record.label === defaultValue : record === defaultValue) {
							setTimeout(function () {
								_this3.handleChange(record);
							}, 100);
							return true;
						}
					});
				}
			} else if (defaultValue === null) {
				if (this.props.multipleSelect) {
					this.handleCheckboxChange(null);
				} else {
					this.handleChange(null);
				}
			}
		}
	};

	// set the query type and input data


	DataList.prototype.setQueryInfo = function setQueryInfo() {
		var obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery,
				reactiveId: this.context.reactiveId,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: this.props.component,
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	};

	DataList.prototype.customQuery = function customQuery(record) {
		if (this.state.selectAll) {
			return {
				exists: {
					field: [this.props.appbaseField]
				}
			};
		} else if (record) {
			var _type, _listQuery;

			var listQuery = (_listQuery = {}, _listQuery[this.type] = (_type = {}, _type[this.props.appbaseField] = record, _type), _listQuery);
			return this.props.multipleSelect ? record.length ? listQuery : null : listQuery;
		}
		return null;
	};

	DataList.prototype.reset = function reset() {
		this.setState({
			selected: this.props.multipleSelect ? [] : ""
		});

		var obj = {
			key: this.props.componentId,
			value: null
		};

		if (this.props.onValueChange) {
			this.props.onValueChange(null);
		}

		helper.URLParams.update(this.props.componentId, null, this.props.URLParams);
		helper.selectedSensor.set(obj, true);
	};

	DataList.prototype.handleChange = function handleChange(record) {
		var _this4 = this;

		var value = record;

		if (_typeof(this.state.data[0]) === "object") {
			value = record.value;
		}

		this.setState({
			selected: value,
			selectAll: false
		}, function () {
			_this4.defaultSelected = value;
			_this4.executeQuery(value);
		});
	};

	DataList.prototype.handleCheckboxChange = function handleCheckboxChange(record) {
		var _this5 = this;

		var _state = this.state,
		    selected = _state.selected,
		    data = _state.data;

		var value = record;

		if (_typeof(this.props.data[0]) === "object") {
			value = record.value;
		}

		if (selected && selected.length) {
			var index = selected.indexOf(value);

			if (index >= 0) {
				selected.splice(index, 1);
			} else {
				selected.push(value);
			}
		} else {
			selected = [value];
		}

		this.setState({
			selected: selected,
			selectAll: false
		}, function () {
			_this5.defaultSelected = selected;
			_this5.executeQuery(selected);
		});
	};

	DataList.prototype.executeQuery = function executeQuery(value) {
		var obj = {
			key: this.props.componentId,
			value: value
		};

		if (this.props.onValueChange) {
			if (this.state.selectAll) {
				this.props.onValueChange(this.props.data);
			} else {
				this.props.onValueChange(value);
			}
		}

		var selectedValue = typeof value === "string" ? value.trim() ? value : null : value;
		helper.URLParams.update(this.props.componentId, selectedValue, this.props.URLParams);
		helper.selectedSensor.set(obj, true);
	};

	DataList.prototype.renderObjectList = function renderObjectList() {
		var _this6 = this;

		var _state2 = this.state,
		    data = _state2.data,
		    selected = _state2.selected;

		var list = void 0;

		if (data) {
			if (this.props.multipleSelect) {
				var cx = classNames({
					"rbc-checkbox-active": this.props.showCheckbox,
					"rbc-checkbox-inactive": !this.props.showCheckbox
				});
				list = data.map(function (record, i) {
					return React.createElement(
						"div",
						{
							className: "rbc-list-item row " + cx + " " + (selected && selected === record.value ? "rbc-list-item-active" : ""),
							key: record.label + "-" + i,
							onClick: function onClick() {
								_this6.handleCheckboxChange(record);
							} },
						React.createElement("input", {
							type: "checkbox",
							className: "rbc-checkbox-item",
							checked: selected && selected.indexOf(record.value) >= 0,
							onChange: function onChange() {}
						}),
						React.createElement(
							"label",
							{ className: "rbc-label" },
							record.label
						)
					);
				});
			} else {
				var _cx = classNames({
					"rbc-radio-active": this.props.showRadio,
					"rbc-radio-inactive": !this.props.showRadio
				});
				list = data.map(function (record, i) {
					return React.createElement(
						"div",
						{
							className: "rbc-list-item row " + _cx + " " + (selected && selected === record.value ? "rbc-list-item-active" : ""),
							key: record.label + "-" + i,
							onClick: function onClick() {
								return _this6.handleChange(record);
							} },
						React.createElement("input", {
							type: "radio",
							className: "rbc-radio-item",
							checked: selected && selected === record.value,
							onChange: function onChange() {}
						}),
						React.createElement(
							"label",
							{ className: "rbc-label" },
							record.label
						)
					);
				});
			}
		}
		if (this.props.selectAllLabel) {
			list.unshift(this.getSelectAll());
		}
		return list;
	};

	DataList.prototype.renderStringList = function renderStringList() {
		var _this7 = this;

		var _state3 = this.state,
		    data = _state3.data,
		    selected = _state3.selected;

		var list = void 0;

		if (data) {
			if (this.props.multipleSelect) {
				var cx = classNames({
					"rbc-checkbox-active": this.props.showCheckbox,
					"rbc-checkbox-inactive": !this.props.showCheckbox
				});
				list = data.map(function (record, i) {
					return React.createElement(
						"div",
						{
							className: "rbc-list-item row " + cx + " " + (selected === record ? "rbc-list-item-active" : ""),
							key: record + "-" + i,
							onClick: function onClick() {
								_this7.handleCheckboxChange(record);
							} },
						React.createElement("input", {
							type: "checkbox",
							className: "rbc-checkbox-item",
							checked: selected && selected.indexOf(record) >= 0,
							onChange: function onChange() {}
						}),
						React.createElement(
							"label",
							{ className: "rbc-label" },
							record
						)
					);
				});
			} else {
				var _cx2 = classNames({
					"rbc-radio-active": this.props.showRadio,
					"rbc-radio-inactive": !this.props.showRadio
				});
				list = data.map(function (record, i) {
					return React.createElement(
						"div",
						{
							className: "rbc-list-item row " + _cx2 + " " + (selected === record ? "rbc-list-item-active" : ""),
							key: record + "-" + i,
							onClick: function onClick() {
								return _this7.handleChange(record);
							} },
						React.createElement("input", {
							type: "radio",
							className: "rbc-radio-item",
							checked: selected === record,
							onChange: function onChange() {}
						}),
						React.createElement(
							"label",
							{ className: "rbc-label" },
							record
						)
					);
				});
			}
		}
		if (this.props.selectAllLabel) {
			list.unshift(this.getSelectAll());
		}
		return list;
	};

	DataList.prototype.getSelectAll = function getSelectAll(list) {
		var selectAllItem = null;
		if (this.props.multipleSelect) {
			var cx = classNames({
				"rbc-checkbox-active": this.props.showCheckbox,
				"rbc-checkbox-inactive": !this.props.showCheckbox
			});
			selectAllItem = React.createElement(
				"div",
				{
					className: "rbc-list-item row " + cx + " " + (this.state.selectAll ? "rbc-list-item-active" : ""),
					key: "select-all",
					onClick: this.onSelectAll },
				React.createElement("input", {
					type: "checkbox",
					className: "rbc-checkbox-item",
					checked: this.state.selectAll,
					onChange: function onChange() {}
				}),
				React.createElement(
					"label",
					{ className: "rbc-label" },
					this.props.selectAllLabel
				)
			);
		} else {
			var _cx3 = classNames({
				"rbc-radio-active": this.props.showRadio,
				"rbc-radio-inactive": !this.props.showRadio
			});
			selectAllItem = React.createElement(
				"div",
				{
					className: "rbc-list-item row " + _cx3 + " " + (this.state.selectAll ? "rbc-list-item-active" : ""),
					key: "select-all",
					onClick: this.onSelectAll },
				React.createElement("input", {
					type: "radio",
					className: "rbc-radio-item",
					checked: this.state.selectAll,
					onChange: function onChange() {}
				}),
				React.createElement(
					"label",
					{ className: "rbc-label" },
					this.props.selectAllLabel
				)
			);
		}
		return selectAllItem;
	};

	DataList.prototype.onSelectAll = function onSelectAll() {
		var _this8 = this;

		if (this.props.multipleSelect) {
			if (this.state.selectAll) {
				this.setState({
					selected: [],
					selectAll: false
				}, function () {
					_this8.executeQuery(null);
				});
			} else {
				this.setState({
					selected: [].concat(this.props.data),
					selectAll: true
				}, function () {
					_this8.executeQuery(_this8.props.selectAllLabel);
				});
			}
		} else {
			this.setState({
				selected: this.props.selectAllLabel,
				selectAll: true
			}, function () {
				_this8.executeQuery(_this8.props.selectAllLabel);
			});
		}
	};

	DataList.prototype.filterBySearch = function filterBySearch(value) {
		if (value && value.trim() !== "") {
			var data = null;
			if (_typeof(this.props.data[0]) === "object") {
				data = this.props.data.filter(function (item) {
					return item.label.toLowerCase().indexOf(value.toLowerCase()) > -1;
				});
			} else {
				data = this.props.data.filter(function (item) {
					return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
				});
			}
			this.setState({
				data: data
			});
		} else if (value.trim() === "") {
			this.setState({
				data: this.props.data
			});
		}
	};

	DataList.prototype.render = function render() {
		var listComponent = null,
		    title = null;

		if (this.props.data.length === 0) {
			return null;
		} else {
			if (_typeof(this.props.data[0]) === "object") {
				listComponent = this.renderObjectList();
			} else {
				listComponent = this.renderStringList();
			}
		}

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
			"rbc-placeholder-inactive": !this.props.placeholder,
			"rbc-singledatalist": !this.props.multipleSelect,
			"rbc-multidatalist": this.props.multipleSelect,
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader
		});

		return React.createElement(
			"div",
			{ className: "rbc col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
			title,
			this.props.showSearch ? React.createElement(StaticSearch, {
				placeholder: this.props.placeholder,
				changeCallback: this.filterBySearch
			}) : null,
			React.createElement(
				"div",
				{ className: "rbc-list-container clearfix" },
				listComponent
			)
		);
	};

	return DataList;
}(Component);

export default DataList;


DataList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
	data: React.PropTypes.array,
	defaultSelected: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
	multipleSelect: React.PropTypes.bool,
	customQuery: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	showRadio: React.PropTypes.bool,
	showCheckbox: React.PropTypes.bool,
	selectAllLabel: React.PropTypes.string
};

// Default props value
DataList.defaultProps = {
	title: null,
	showSearch: false,
	placeholder: "Search",
	componentStyle: {},
	URLParams: false,
	multipleSelect: false,
	showFilter: true,
	showRadio: true,
	showCheckbox: true
};

DataList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};