import _isObject from "lodash/isObject";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import classNames from "classnames";

import moment from "moment";
var helper = require("../middleware/helper.js");

var SelectedFilters = function (_Component) {
	_inherits(SelectedFilters, _Component);

	function SelectedFilters(props, context) {
		_classCallCheck(this, SelectedFilters);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			filters: {}
		};
		_this.blacklist = ["NumberBox", "RangeSlider"];
		return _this;
	}

	SelectedFilters.prototype.componentDidMount = function componentDidMount() {
		this.listenChanges();
	};

	SelectedFilters.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.sensorListener) {
			this.sensorListener.remove();
		}
	};

	SelectedFilters.prototype.listenChanges = function listenChanges() {
		this.sensorListener = helper.sensorEmitter.addListener("sensorChange", this.updateSensors.bind(this));
	};

	SelectedFilters.prototype.updateSensors = function updateSensors(data) {
		var _this2 = this;

		var isanyChange = false;
		var filters = this.state.filters;

		Object.keys(data).forEach(function (item) {
			var selectedFilter = _this2.isSibling(item);
			if (selectedFilter) {
				if (data[item] && (typeof data[item] === "string" && data[item].trim() !== "" || Array.isArray(data[item]) && data[item].length > 0 || Object.keys(data[item]).length !== 0)) {
					filters[item] = {
						value: data[item],
						component: selectedFilter.component,
						filterLabel: selectedFilter.filterLabel
					};
				} else {
					if (item in filters) {
						delete filters[item];
					}
				}
				isanyChange = true;
			}
		});
		if (!isanyChange) {
			filters = [];
		}
		this.setState({
			filters: filters
		});
	};

	SelectedFilters.prototype.isSibling = function isSibling(siblingComponentId) {
		var filter = null;
		var sensorInfo = helper.selectedSensor.get(siblingComponentId, "sensorInfo");
		if (sensorInfo && sensorInfo.showFilter && sensorInfo.component && (sensorInfo.reactiveId === 0 || sensorInfo.reactiveId) && this.blacklist.indexOf(sensorInfo.component) < 0 && this.context.reactiveId === sensorInfo.reactiveId) {
			filter = {
				component: sensorInfo.component,
				filterLabel: sensorInfo.filterLabel
			};
		}
		return filter;
	};

	SelectedFilters.prototype.clearFilter = function clearFilter(item) {
		var filters = this.state.filters;

		delete filters[item];
		this.setState({
			filters: filters
		});
		helper.sensorEmitter.emit("clearFilter", item);
	};

	SelectedFilters.prototype.parseValue = function parseValue(item) {
		var value = item.value;
		if (item.component === "DatePicker") {
			value = moment(item.value).format("YYYY-MM-DD");
		} else if (item.component === "DateRange") {
			value = {
				start: item.value.startDate ? moment(item.value.startDate).format("YYYY-MM-DD") : null,
				end: item.value.endDate ? moment(item.value.endDate).format("YYYY-MM-DD") : null
			};
			value = JSON.stringify(value);
		} else if (item.component === "MultiDropdownRange" || item.component === "MultiRange" || item.component === "ToggleButton" || item.component === "ToggleList") {
			value = item.value.map(function (range) {
				return range.label;
			});
			value = value.join(", ");
		} else if (item.component === "SingleRange" || item.component === "SingleDropdownRange" || item.component === "RatingsFilter") {
			value = item.value.label;
		} else if (item.component === "GeoDistanceSlider") {
			value = item.value.currentValue;
			if (value && item.value.currentDistance) {
				value += " (" + item.value.currentDistance + ")";
			}
		} else if (item.component === "GeoDistanceDropdown") {
			value = item.value.currentValue;
			if (value && item.value.unit && item.value.end) {
				value += " (" + item.value.start + item.value.unit + " - " + item.value.end + item.value.unit + ")";
			}
		} else if (item.component === "CategorySearch") {
			value = item && item.value && item.value.value ? item.value.value : null;
			if (item.value.category && value) {
				value += " in " + item.value.category;
			}
		} else if (item.component === "PlacesSearch") {
			value = item.value.currentValue;
		} else if (item.component === "NestedList" || item.component === "NestedMultiList") {
			value = item.value.join(" > ");
		} else if (item.component === "NumberBox") {
			// currently not showing NumberBox
			value = value.value;
		} else if (Array.isArray(item.value)) {
			value = item.value.join(", ");
		} else if (_isObject(item.value)) {
			value = JSON.stringify(item.value);
		}
		return value;
	};

	SelectedFilters.prototype.render = function render() {
		var _this3 = this;

		return Object.keys(this.state.filters).length ? React.createElement(
			"div",
			{ className: "rbc rbc-selectedfilters rbc-tag-container row card thumbnail", style: this.props.componentStyle },
			Object.keys(this.state.filters).map(function (item) {
				if (!_this3.props.blackList.includes(item)) {
					return React.createElement(
						"span",
						{ key: item, className: "rbc-tag-item col" },
						React.createElement(
							"button",
							{ className: "close", onClick: function onClick() {
									return _this3.clearFilter(item);
								} },
							"x"
						),
						React.createElement(
							"span",
							{ className: "rbc-tag-text" },
							React.createElement(
								"strong",
								null,
								_this3.state.filters[item].filterLabel
							),
							" : ",
							_this3.parseValue(_this3.state.filters[item])
						)
					);
				}
				return null;
			})
		) : null;
	};

	return SelectedFilters;
}(Component);

export default SelectedFilters;


SelectedFilters.propTypes = {
	componentStyle: React.PropTypes.object,
	componentId: React.PropTypes.string,
	blackList: React.PropTypes.arrayOf(React.PropTypes.string)
};

SelectedFilters.defaultProps = {
	componentStyle: {},
	blackList: []
};

// context type
SelectedFilters.contextTypes = {
	reactiveId: React.PropTypes.number
};