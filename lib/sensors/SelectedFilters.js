"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require("../middleware/helper.js");

var SelectedFilters = function (_Component) {
	_inherits(SelectedFilters, _Component);

	function SelectedFilters(props, context) {
		_classCallCheck(this, SelectedFilters);

		var _this = _possibleConstructorReturn(this, (SelectedFilters.__proto__ || Object.getPrototypeOf(SelectedFilters)).call(this, props));

		_this.state = {
			filters: {}
		};
		_this.blacklist = ["NumberBox", "RangeSlider"];
		return _this;
	}

	_createClass(SelectedFilters, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.listenChanges();
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			if (this.sensorListener) {
				this.sensorListener.remove();
			}
		}
	}, {
		key: "listenChanges",
		value: function listenChanges() {
			this.sensorListener = helper.sensorEmitter.addListener("sensorChange", this.updateSensors.bind(this));
		}
	}, {
		key: "updateSensors",
		value: function updateSensors(data) {
			var _this2 = this;

			var isanyChange = false;
			var filters = this.state.filters;
			Object.keys(data).forEach(function (item) {
				var selectedFilter = _this2.isSibling(item);
				if (selectedFilter) {
					if (data[item] !== null) {
						filters[item] = {
							value: data[item],
							component: selectedFilter.component
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
		}
	}, {
		key: "isSibling",
		value: function isSibling(siblingComponentId) {
			var _this3 = this;

			var filter = null;
			helper.RecactivebaseComponents.forEach(function (item) {
				filter = _this3.getItem(item, siblingComponentId);
			});
			return filter;
		}
	}, {
		key: "getItem",
		value: function getItem(items, siblingComponentId) {
			var _this4 = this;

			var selectedItem = null;
			items.forEach(function (item) {
				if (_this4.blacklist.indexOf(item.component) < 0 && item.componentId === siblingComponentId) {
					var isSameReactivebase = !items.every(function (subitem) {
						return subitem.componentId !== _this4.props.componentId;
					});
					if (isSameReactivebase) {
						selectedItem = item;
					}
				}
			});
			return selectedItem;
		}
	}, {
		key: "clearFilter",
		value: function clearFilter(item) {
			var filters = this.state.filters;
			delete filters[item];
			this.setState({
				filters: filters
			});
			helper.sensorEmitter.emit("clearFilter", item);
		}
	}, {
		key: "parseValue",
		value: function parseValue(item) {
			var value = item.value;
			if (item.component === "DatePicker") {
				value = (0, _moment2.default)(item.value).format("YYYY-MM-DD");
			} else if (item.component === "DateRange") {
				value = {
					start: item.value.startDate ? (0, _moment2.default)(item.value.startDate).format("YYYY-MM-DD") : null,
					end: item.value.endDate ? (0, _moment2.default)(item.value.endDate).format("YYYY-MM-DD") : null
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
				if (item.value.category) {
					value += " in " + item.value.category;
				}
			} else if (item.component === "PlacesSearch") {
				value = item.value.currentValue;
			} else if (item.component === "NestedList") {
				value = item.value.join(" > ");
			} else if (_lodash2.default.isArray(item.value)) {
				value = item.value.join(", ");
			} else if (_lodash2.default.isObject(item.value)) {
				value = JSON.stringify(item.value);
			}
			return value;
		}
	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			return Object.keys(this.state.filters).length ? _react2.default.createElement(
				"div",
				{ className: "rbc rbc-selectedfilters rbc-tag-container row card thumbnail", style: this.props.componentStyle },
				Object.keys(this.state.filters).map(function (item) {
					return _react2.default.createElement(
						"span",
						{ key: item, className: "rbc-tag-item col" },
						_react2.default.createElement(
							"button",
							{ className: "close", onClick: function onClick() {
									return _this5.clearFilter(item);
								} },
							"x"
						),
						_react2.default.createElement(
							"span",
							{ className: "rb-tag-text" },
							_react2.default.createElement(
								"strong",
								null,
								item
							),
							" : ",
							_this5.parseValue(_this5.state.filters[item])
						)
					);
				})
			) : null;
		}
	}]);

	return SelectedFilters;
}(_react.Component);

exports.default = SelectedFilters;


SelectedFilters.propTypes = {
	componentStyle: _react2.default.PropTypes.object,
	componentId: _react2.default.PropTypes.string.isRequired
};

SelectedFilters.defaultProps = {
	componentStyle: {}
};