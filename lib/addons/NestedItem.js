var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import NestedList from "../sensors/NestedList";

var NestedItem = function (_Component) {
	_inherits(NestedItem, _Component);

	function NestedItem(props) {
		_classCallCheck(this, NestedItem);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			selectedItem: []
		};
		_this.defaultSelected = _this.props.defaultSelected;
		_this.defaultAllowed = true;
		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	NestedItem.prototype.componentWillUpdate = function componentWillUpdate() {
		if (this.defaultSelected != this.props.defaultSelected) {
			this.defaultSelected = this.props.defaultSelected;
			this.defaultSelection();
		}
	};

	NestedItem.prototype.componentDidUpdate = function componentDidUpdate() {
		if (this.props.items.length && this.defaultAllowed) {
			this.defaultAllowed = false;
			this.defaultSelection();
		}
	};

	NestedItem.prototype.defaultSelection = function defaultSelection() {
		if (this.props.defaultSelected) {
			this.handleClick(this.props.defaultSelected);
		}
	};

	// Handler function is called when the list item is clicked


	NestedItem.prototype.handleClick = function handleClick(value) {
		// Pass the previously selected value to be removed from the query
		this.props.onRemove(this.state.selectedItem);
		// Pass the new selected value to be added to the query
		this.props.onSelect(value);
		this.setState({
			selectedItem: value
		});
	};

	NestedItem.prototype.render = function render() {
		var _this2 = this;

		var items = this.props.items;
		var itemsComponent = [];
		// Build the array of components for each item
		items.forEach(function (item) {
			itemsComponent.push(React.createElement(ItemRow, _extends({}, _this2.props, {
				key: item.key,
				value: item.key,
				doc_count: item.doc_count,
				countField: _this2.props.showCount,
				handleClick: _this2.handleClick,
				selectedItem: _this2.state.selectedItem
			})));
		});
		return React.createElement(
			"div",
			{ className: "rbc-list-container col s12 col-xs-12" },
			itemsComponent
		);
	};

	return NestedItem;
}(Component);

export default NestedItem;

var ItemRow = function (_Component2) {
	_inherits(ItemRow, _Component2);

	function ItemRow(props) {
		_classCallCheck(this, ItemRow);

		return _possibleConstructorReturn(this, _Component2.call(this, props));
	}

	ItemRow.prototype.renderItem = function renderItem() {
		var count = void 0;
		// Check if user wants to show count field
		if (this.props.countField) {
			count = React.createElement(
				"span",
				null,
				" (",
				this.props.doc_count,
				") "
			);
		}
		var item = React.createElement(
			"a",
			{ href: "javascript:void(0)", className: "col s12 col-xs-12" },
			React.createElement(
				"span",
				null,
				" ",
				this.props.value,
				" "
			),
			count
		);
		if (this.props.value === this.props.selectedItem) {
			item = React.createElement(
				"a",
				{ href: "javascript:void(0)", className: "col s12 col-xs-12" },
				React.createElement(
					"strong",
					null,
					React.createElement(
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
	};

	ItemRow.prototype.renderCount = function renderCount() {
		var count = void 0;
		// Check if user wants to show count field
		if (this.props.countField) {
			count = React.createElement(
				"span",
				null,
				" (",
				this.props.doc_count,
				") "
			);
		}
		return count;
	};

	ItemRow.prototype.renderList = function renderList() {
		var list = void 0;
		if (this.props.value === this.props.selectedItem && this.props.dataField[1]) {
			list = React.createElement(NestedList, {
				componentId: "nested-" + this.props.value,
				dataField: [this.props.dataField[1]],
				react: this.props.react
			});
		}
		return list;
	};

	ItemRow.prototype.render = function render() {
		var _this4 = this;

		// let activeClass = this.props.value === this.props.selectedItem ? 'active' : '';
		return React.createElement(
			"div",
			{ className: "rbc-item row", onClick: function onClick() {
					return _this4.props.handleClick(_this4.props.value);
				} },
			React.createElement(
				"div",
				{ className: "rbc-item col s12 col-xs-12" },
				React.createElement(
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
	};

	return ItemRow;
}(Component);