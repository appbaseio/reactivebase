"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require("../middleware/constants");

var TYPES = _interopRequireWildcard(_constants);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require("../middleware/helper");

var MultiRange = function (_Component) {
	_inherits(MultiRange, _Component);

	function MultiRange(props) {
		_classCallCheck(this, MultiRange);

		var _this = _possibleConstructorReturn(this, (MultiRange.__proto__ || Object.getPrototypeOf(MultiRange)).call(this, props));

		_this.state = {
			selected: []
		};
		_this.type = "range";
		_this.urlParams = helper.URLParams.get(_this.props.componentId, true);
		_this.defaultSelected = _this.urlParams !== null ? _this.urlParams : _this.props.defaultSelected;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.resetState = _this.resetState.bind(_this);
		_this.handleTagClick = _this.handleTagClick.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(MultiRange, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var _this2 = this;

			this.setQueryInfo();
			if (this.defaultSelected) {
				var records = this.props.data.filter(function (record) {
					return _this2.defaultSelected.indexOf(record.label) > -1;
				});
				if (records && records.length) {
					if (this.urlParams !== null) {
						this.handleChange(records);
					} else {
						setTimeout(this.handleChange.bind(this, records), 1000);
					}
				}
			}
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			var _this3 = this;

			setTimeout(function () {
				var defaultValue = _this3.urlParams !== null ? _this3.urlParams : _this3.props.defaultSelected;
				if (!_lodash2.default.isEqual(_this3.defaultSelected, defaultValue)) {
					_this3.defaultSelected = defaultValue;
					_this3.resetState();
					var records = _this3.props.data.filter(function (record) {
						return defaultValue.indexOf(record.label) > -1;
					});
					if (records && records.length) {
						setTimeout(_this3.handleChange.bind(_this3, records), 1000);
					}
				}
			}, 300);
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
			function generateRangeQuery(appbaseField) {
				if (record.length > 0) {
					return record.map(function (singleRecord) {
						return {
							range: _defineProperty({}, appbaseField, {
								gte: singleRecord.start,
								lte: singleRecord.end,
								boost: 2.0
							})
						};
					});
				}
				return null;
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
			return null;
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: "handleChange",
		value: function handleChange(record) {
			var selected = this.state.selected;
			var selectedIndex = null;
			var records = record;

			if (!_lodash2.default.isArray(record)) {
				records = [record];
			}

			function setRecord(selectedRecord, index, item) {
				if (item.label === selectedRecord.label) {
					selectedIndex = index;
					selected.splice(index, 1);
				}
			}

			records.forEach(function (item) {
				selected.forEach(function (selectedRecord, index) {
					setRecord(selectedRecord, index, item);
				});
			});

			if (selectedIndex === null) {
				records.forEach(function (item) {
					selected.push(item);
				});
			}

			this.setState({
				selected: selected
			});

			var obj = {
				key: this.props.componentId,
				value: selected
			};

			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			helper.URLParams.update(this.props.componentId, this.getSelectedLabels(selected), this.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: "getSelectedLabels",
		value: function getSelectedLabels(selected) {
			return selected.map(function (item) {
				return item.label;
			});
		}
	}, {
		key: "resetState",
		value: function resetState() {
			this.setState({
				selected: []
			});
			var obj = {
				key: this.props.componentId,
				value: []
			};
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			helper.URLParams.update(this.props.componentId, null, this.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: "handleTagClick",
		value: function handleTagClick(label) {
			var target = this.state.selected.filter(function (record) {
				return record.label === label;
			});
			this.handleChange(target[0]);
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
				buttons = this.props.data.map(function (record) {
					return _react2.default.createElement(
						"div",
						{ className: "rbc-list-item row", key: record.label, onClick: function onClick() {
								return _this4.handleChange(record);
							} },
						_react2.default.createElement("input", {
							type: "checkbox",
							className: "rbc-checkbox-item",
							checked: selectedText.indexOf(record.label) > -1,
							value: record.label
						}),
						_react2.default.createElement(
							"label",
							{ className: "rbc-label" },
							record.label
						)
					);
				});
			}
			return buttons;
		}

		// render

	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			var title = null;
			var TagItemsArray = [];

			if (this.props.title) {
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}

			if (this.state.selected) {
				this.state.selected.forEach(function (item) {
					TagItemsArray.push(_react2.default.createElement(Tag, {
						key: item.label,
						value: item.label,
						onClick: _this5.handleTagClick
					}));
				});
			}

			var cx = (0, _classnames2.default)({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title
			});

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-multirange col s12 col-xs-12 card thumbnail " + cx, style: this.props.componentStyle },
				_react2.default.createElement(
					"div",
					{ className: "row" },
					title,
					_react2.default.createElement(
						"div",
						{ className: "col s12 col-xs-12 rbc-list-container" },
						TagItemsArray.length ? _react2.default.createElement(
							"div",
							{ className: "row", style: { marginTop: "0" } },
							TagItemsArray
						) : null,
						this.renderButtons()
					)
				)
			);
		}
	}]);

	return MultiRange;
}(_react.Component);

exports.default = MultiRange;


var Tag = function Tag(props) {
	return _react2.default.createElement(
		"span",
		{ onClick: function onClick() {
				return props.onClick(props.value);
			}, className: "rbc-tag-item col" },
		_react2.default.createElement(
			"a",
			{ className: "close" },
			"\xD7"
		),
		_react2.default.createElement(
			"span",
			null,
			props.value
		)
	);
};

Tag.propTypes = {
	onClick: _react2.default.PropTypes.func.isRequired,
	value: _react2.default.PropTypes.string.isRequired
};

MultiRange.propTypes = {
	appbaseField: _react2.default.PropTypes.string.isRequired,
	componentId: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	data: _react2.default.PropTypes.any.isRequired,
	defaultSelected: _react2.default.PropTypes.array,
	customQuery: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object,
	URLParams: _react2.default.PropTypes.bool
};

// Default props value
MultiRange.defaultProps = {
	URLParams: false
};

// context type
MultiRange.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

MultiRange.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN
};