var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";

var helper = require("../middleware/helper");

var DataList = function (_Component) {
	_inherits(DataList, _Component);

	function DataList(props) {
		_classCallCheck(this, DataList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			data: props.data,
			selected: null
		};

		_this.type = _this.props.multipleSelect ? "Terms" : "Term";
		_this.urlParams = helper.URLParams.get(_this.props.componentId, props.multipleSelect);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.renderObjectList = _this.renderObjectList.bind(_this);
		_this.renderStringList = _this.renderStringList.bind(_this);
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
		var _this2 = this;

		this.setState({
			data: nextProps.data
		}, function () {
			_this2.checkDefault(nextProps);
		});
	};

	DataList.prototype.listenFilter = function listenFilter() {
		var _this3 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this3.props.componentId) {
				_this3.reset();
			}
		});
	};

	DataList.prototype.checkDefault = function checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId, props.multipleSelect);
		var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	};

	DataList.prototype.changeValue = function changeValue(defaultValue) {
		var _this4 = this;

		if (!_.isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if (defaultValue) {
				if (this.props.multipleSelect) {
					if (Array.isArray(defaultValue)) {
						defaultValue.forEach(function (item) {
							_this4.state.data.some(function (record) {
								if (record.label ? record.label === item : record === item) {
									setTimeout(function () {
										_this4.handleCheckboxChange(record);
									}, 100);
									return true;
								}
							});
						});
					} else {
						console.error(this.props.componentId + " - defaultSelected should be an array");
					}
				} else {
					this.state.data.some(function (record) {
						if (record.label ? record.label === defaultValue : record === defaultValue) {
							_this4.handleChange(record);
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
		if (record) {
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
		var _this5 = this;

		var value = record;

		if (_typeof(this.state.data[0]) === "object") {
			value = record.value;
		}

		this.setState({
			selected: value
		}, function () {
			_this5.defaultSelected = value;
		});

		this.executeQuery(value);
	};

	DataList.prototype.handleCheckboxChange = function handleCheckboxChange(record) {
		var _this6 = this;

		var _state = this.state,
		    selected = _state.selected,
		    data = _state.data;

		var value = record;

		if (_typeof(data[0]) === "object") {
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
			selected: selected
		}, function () {
			_this6.defaultSelected = selected;
		});

		this.executeQuery(selected);
	};

	DataList.prototype.executeQuery = function executeQuery(value) {
		var obj = {
			key: this.props.componentId,
			value: value
		};

		if (this.props.onValueChange) {
			this.props.onValueChange(value);
		}

		var selectedValue = typeof value === "string" ? value.trim() ? value : null : value;
		helper.URLParams.update(this.props.componentId, selectedValue, this.props.URLParams);
		helper.selectedSensor.set(obj, true);
	};

	DataList.prototype.renderObjectList = function renderObjectList() {
		var _this7 = this;

		var _state2 = this.state,
		    data = _state2.data,
		    selected = _state2.selected;

		var list = void 0;

		if (data) {
			if (this.props.multipleSelect) {
				list = data.map(function (record, i) {
					return React.createElement(
						"div",
						{ className: "rbc-list-item row", key: record.label + "-" + i, onClick: function onClick() {
								return _this7.handleCheckboxChange(record);
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
				list = data.map(function (record, i) {
					return React.createElement(
						"div",
						{ className: "rbc-list-item row", key: record.label + "-" + i, onClick: function onClick() {
								return _this7.handleChange(record);
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
		return list;
	};

	DataList.prototype.renderStringList = function renderStringList() {
		var _this8 = this;

		var _state3 = this.state,
		    data = _state3.data,
		    selected = _state3.selected;

		var list = void 0;

		if (data) {
			if (this.props.multipleSelect) {
				list = data.map(function (record, i) {
					return React.createElement(
						"div",
						{ className: "rbc-list-item row", key: record + "-" + i, onClick: function onClick() {
								return _this8.handleCheckboxChange(record);
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
				list = data.map(function (record, i) {
					return React.createElement(
						"div",
						{ className: "rbc-list-item row", key: record + "-" + i, onClick: function onClick() {
								return _this8.handleChange(record);
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
		return list;
	};

	DataList.prototype.render = function render() {
		var listComponent = null,
		    searchComponent = null,
		    title = null;

		if (this.state.data.length === 0) {
			return null;
		} else {
			if (_typeof(this.state.data[0]) === "object") {
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
	data: React.PropTypes.array,
	defaultSelected: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
	multipleSelect: React.PropTypes.bool,
	customQuery: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string
};

// Default props value
DataList.defaultProps = {
	title: null,
	componentStyle: {},
	URLParams: false,
	multipleSelect: false,
	showFilter: true
};

DataList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};