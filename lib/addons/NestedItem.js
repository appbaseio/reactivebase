"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _NestedList = require("../sensors/NestedList");

var _NestedList2 = _interopRequireDefault(_NestedList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NestedItem = function (_Component) {
	_inherits(NestedItem, _Component);

	function NestedItem(props) {
		_classCallCheck(this, NestedItem);

		var _this = _possibleConstructorReturn(this, (NestedItem.__proto__ || Object.getPrototypeOf(NestedItem)).call(this, props));

		_this.state = {
			selectedItem: []
		};
		_this.defaultSelected = _this.props.defaultSelected;
		_this.defaultAllowed = true;
		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	_createClass(NestedItem, [{
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			if (this.defaultSelected != this.props.defaultSelected) {
				this.defaultSelected = this.props.defaultSelected;
				this.defaultSelection();
			}
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			if (this.props.items.length && this.defaultAllowed) {
				this.defaultAllowed = false;
				this.defaultSelection();
			}
		}
	}, {
		key: "defaultSelection",
		value: function defaultSelection() {
			if (this.props.defaultSelected) {
				this.handleClick(this.props.defaultSelected);
			}
		}

		// Handler function is called when the list item is clicked

	}, {
		key: "handleClick",
		value: function handleClick(value) {
			// Pass the previously selected value to be removed from the query
			this.props.onRemove(this.state.selectedItem);
			// Pass the new selected value to be added to the query
			this.props.onSelect(value);
			this.setState({
				selectedItem: value
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var items = this.props.items;
			var itemsComponent = [];
			// Build the array of components for each item
			items.forEach(function (item) {
				itemsComponent.push(_react2.default.createElement(ItemRow, _extends({}, _this2.props, {
					key: item.key,
					value: item.key,
					doc_count: item.doc_count,
					countField: _this2.props.showCount,
					handleClick: _this2.handleClick,
					selectedItem: _this2.state.selectedItem
				})));
			});
			return _react2.default.createElement(
				"div",
				{ className: "rbc-list-container col s12 col-xs-12" },
				itemsComponent
			);
		}
	}]);

	return NestedItem;
}(_react.Component);

exports.default = NestedItem;

var ItemRow = function (_Component2) {
	_inherits(ItemRow, _Component2);

	function ItemRow(props) {
		_classCallCheck(this, ItemRow);

		return _possibleConstructorReturn(this, (ItemRow.__proto__ || Object.getPrototypeOf(ItemRow)).call(this, props));
	}

	_createClass(ItemRow, [{
		key: "renderItem",
		value: function renderItem() {
			var count = void 0;
			// Check if user wants to show count field
			if (this.props.countField) {
				count = _react2.default.createElement(
					"span",
					null,
					" (",
					this.props.doc_count,
					") "
				);
			}
			var item = _react2.default.createElement(
				"a",
				{ href: "javascript:void(0)", className: "col s12 col-xs-12" },
				_react2.default.createElement(
					"span",
					null,
					" ",
					this.props.value,
					" "
				),
				count
			);
			if (this.props.value === this.props.selectedItem) {
				item = _react2.default.createElement(
					"a",
					{ href: "javascript:void(0)", className: "col s12 col-xs-12" },
					_react2.default.createElement(
						"strong",
						null,
						_react2.default.createElement(
							"span",
							null,
							" ",
							this.props.value,
							" "
						),
						count
					)
				);
			}
			return item;
		}
	}, {
		key: "renderCount",
		value: function renderCount() {
			var count = void 0;
			// Check if user wants to show count field
			if (this.props.countField) {
				count = _react2.default.createElement(
					"span",
					null,
					" (",
					this.props.doc_count,
					") "
				);
			}
			return count;
		}
	}, {
		key: "renderList",
		value: function renderList() {
			var list = void 0;
			if (this.props.value === this.props.selectedItem && this.props.appbaseField[1]) {
				list = _react2.default.createElement(_NestedList2.default, {
					componentId: "nested-" + this.props.value,
					appbaseField: [this.props.appbaseField[1]],
					react: this.props.react
				});
			}
			return list;
		}
	}, {
		key: "render",
		value: function render() {
			var _this4 = this;

			// let activeClass = this.props.value === this.props.selectedItem ? 'active' : '';
			return _react2.default.createElement(
				"div",
				{ className: "rbc-item row", onClick: function onClick() {
						return _this4.props.handleClick(_this4.props.value);
					} },
				_react2.default.createElement(
					"div",
					{ className: "rbc-item col s12 col-xs-12" },
					_react2.default.createElement(
						"span",
						null,
						" ",
						this.props.value,
						" "
					),
					this.renderCount(),
					this.renderList()
				)
			);
		}
	}]);

	return ItemRow;
}(_react.Component);