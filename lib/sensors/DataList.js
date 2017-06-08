"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require("../middleware/ChannelManager");

var _ChannelManager2 = _interopRequireDefault(_ChannelManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint max-lines: 0 */


var helper = require("../middleware/helper");

var DataList = function (_Component) {
	_inherits(DataList, _Component);

	function DataList(props) {
		_classCallCheck(this, DataList);

		var _this = _possibleConstructorReturn(this, (DataList.__proto__ || Object.getPrototypeOf(DataList)).call(this, props));

		_this.state = {
			data: props.data,
			selected: null
		};

		_this.type = _this.props.multipleSelect ? "Terms" : "Term";
		_this.urlParams = helper.URLParams.get(_this.props.componentId, true);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.renderObjectList = _this.renderObjectList.bind(_this);
		_this.renderStringList = _this.renderStringList.bind(_this);
		return _this;
	}

	_createClass(DataList, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.setQueryInfo();
			this.checkDefault(this.props);
			this.listenFilter();
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			this.checkDefault(nextProps);
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			if (this.filterListener) {
				this.filterListener.remove();
			}
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			this.setState({
				data: nextProps.data
			});
		}
	}, {
		key: "listenFilter",
		value: function listenFilter() {
			var _this2 = this;

			this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
				if (data === _this2.props.componentId) {
					_this2.reset();
				}
			});
		}
	}, {
		key: "checkDefault",
		value: function checkDefault(props) {
			this.urlParams = helper.URLParams.get(props.componentId, true);
			var defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
			this.changeValue(defaultValue);
		}
	}, {
		key: "changeValue",
		value: function changeValue(defaultValue) {
			var _this3 = this;

			if (!_.isEqual(this.defaultSelected, defaultValue)) {
				this.defaultSelected = defaultValue;
				if (defaultValue) {
					if (this.props.multipleSelect) {
						if (Array.isArray(defaultValue)) {
							defaultValue.forEach(function (item) {
								_this3.state.data.some(function (record) {
									if (record.label ? record.label === item : record === item) {
										setTimeout(function () {
											_this3.handleCheckboxChange(record);
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
								_this3.handleChange(record);
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
	}, {
		key: "customQuery",
		value: function customQuery(record) {
			if (record) {
				var listQuery = _defineProperty({}, this.type, _defineProperty({}, this.props.appbaseField, record));
				return this.props.multipleSelect ? record.length ? listQuery : null : listQuery;
			}
			return null;
		}
	}, {
		key: "reset",
		value: function reset() {
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
		}
	}, {
		key: "handleChange",
		value: function handleChange(record) {
			var value = record;

			if (_typeof(this.state.data[0]) === "object") {
				value = record.value;
			}

			this.setState({
				selected: value
			});

			this.executeQuery(value);
		}
	}, {
		key: "handleCheckboxChange",
		value: function handleCheckboxChange(record) {
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
			});

			this.executeQuery(selected);
		}
	}, {
		key: "executeQuery",
		value: function executeQuery(value) {
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
		}
	}, {
		key: "renderObjectList",
		value: function renderObjectList() {
			var _this4 = this;

			var _state2 = this.state,
			    data = _state2.data,
			    selected = _state2.selected;

			var list = void 0;

			if (data) {
				if (this.props.multipleSelect) {
					list = data.map(function (record, i) {
						return _react2.default.createElement(
							"div",
							{ className: "rbc-list-item row", key: record.label + "-" + i, onClick: function onClick() {
									return _this4.handleCheckboxChange(record);
								} },
							_react2.default.createElement("input", {
								type: "checkbox",
								className: "rbc-checkbox-item",
								checked: selected && selected.indexOf(record.value) >= 0,
								onChange: function onChange() {}
							}),
							_react2.default.createElement(
								"label",
								{ className: "rbc-label" },
								record.label
							)
						);
					});
				} else {
					list = data.map(function (record, i) {
						return _react2.default.createElement(
							"div",
							{ className: "rbc-list-item row", key: record.label + "-" + i, onClick: function onClick() {
									return _this4.handleChange(record);
								} },
							_react2.default.createElement("input", {
								type: "radio",
								className: "rbc-radio-item",
								checked: selected && selected === record.value,
								onChange: function onChange() {}
							}),
							_react2.default.createElement(
								"label",
								{ className: "rbc-label" },
								record.label
							)
						);
					});
				}
			}
			return list;
		}
	}, {
		key: "renderStringList",
		value: function renderStringList() {
			var _this5 = this;

			var _state3 = this.state,
			    data = _state3.data,
			    selected = _state3.selected;

			var list = void 0;

			if (data) {
				if (this.props.multipleSelect) {
					list = data.map(function (record, i) {
						return _react2.default.createElement(
							"div",
							{ className: "rbc-list-item row", key: record + "-" + i, onClick: function onClick() {
									return _this5.handleCheckboxChange(record);
								} },
							_react2.default.createElement("input", {
								type: "checkbox",
								className: "rbc-checkbox-item",
								checked: selected && selected.indexOf(record) >= 0,
								onChange: function onChange() {}
							}),
							_react2.default.createElement(
								"label",
								{ className: "rbc-label" },
								record
							)
						);
					});
				} else {
					list = data.map(function (record) {
						return _react2.default.createElement(
							"div",
							{ className: "rbc-list-item row", key: record + "-" + i, onClick: function onClick() {
									return _this5.handleChange(record);
								} },
							_react2.default.createElement("input", {
								type: "radio",
								className: "rbc-radio-item",
								checked: selected === record,
								onChange: function onChange() {}
							}),
							_react2.default.createElement(
								"label",
								{ className: "rbc-label" },
								record
							)
						);
					});
				}
			}
			return list;
		}
	}, {
		key: "render",
		value: function render() {
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
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}

			var cx = (0, _classnames2.default)({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title,
				"rbc-placeholder-active": this.props.placeholder,
				"rbc-placeholder-inactive": !this.props.placeholder,
				"rbc-singledatalist": !this.props.multipleSelect,
				"rbc-multidatalist": this.props.multipleSelect,
				"rbc-initialloader-active": this.props.initialLoader,
				"rbc-initialloader-inactive": !this.props.initialLoader
			});

			return _react2.default.createElement(
				"div",
				{ className: "rbc col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				title,
				_react2.default.createElement(
					"div",
					{ className: "rbc-list-container clearfix" },
					listComponent
				)
			);
		}
	}]);

	return DataList;
}(_react.Component);

exports.default = DataList;


DataList.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	data: _react2.default.PropTypes.array,
	defaultSelected: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.array]),
	multipleSelect: _react2.default.PropTypes.bool,
	customQuery: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object,
	URLParams: _react2.default.PropTypes.bool,
	allowFilter: _react2.default.PropTypes.bool
};

// Default props value
DataList.defaultProps = {
	title: null,
	componentStyle: {},
	URLParams: false,
	multipleSelect: false
};

DataList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};