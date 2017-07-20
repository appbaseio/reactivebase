function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import ListItem from "./ListItem";

var ItemCheckboxList = function (_Component) {
	_inherits(ItemCheckboxList, _Component);

	function ItemCheckboxList(props) {
		_classCallCheck(this, ItemCheckboxList);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
			selectedItems: [],
			selectAll: false
		};
		_this.refStore = {};
		_this.handleListClick = _this.handleListClick.bind(_this);
		_this.removeItem = _this.removeItem.bind(_this);
		_this.handleListClickAll = _this.handleListClickAll.bind(_this);
		return _this;
	}

	ItemCheckboxList.prototype.componentDidMount = function componentDidMount() {
		var _this2 = this;

		if (Array.isArray(this.props.defaultSelected)) {
			if (this.props.defaultSelected.indexOf(this.props.selectAllLabel) >= 0) {
				this.handleListClickAll(this.props.selectAllLabel, true);
			} else {
				var items = [];
				this.props.items.forEach(function (item) {
					if (_this2.props.defaultSelected.indexOf(item.key) >= 0) {
						items.push(item.key);
					}
				});
				this.setState({
					selectedItems: items.length ? items : []
				}, function () {
					_this2.props.onSelect(_this2.state.selectedItems);
				});
			}
		}
	};

	ItemCheckboxList.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (nextProps.defaultSelected === null && !nextProps.selectAll) {
			this.setState({
				selectedItems: []
			});
		}
	};

	// Handler function when a checkbox is clicked


	ItemCheckboxList.prototype.handleListClick = function handleListClick(value, selectedStatus) {
		var _this3 = this;

		var updated = void 0;
		// If the checkbox selectedStatus is true, then update selectedItems array
		if (selectedStatus) {
			updated = this.state.selectedItems;
			updated.push(value);
			this.setState({
				selectedItems: updated
			}, function () {
				_this3.props.onSelect(updated);
			});
		} else {
			// If the checkbox selectedStatus is false
			// Call removeItem to remove it from the selected Items
			this.removeItem(value);
		}
	};

	// Handler function when a cancel button on tag is clicked to remove it


	ItemCheckboxList.prototype.removeItem = function removeItem(value) {
		var _this4 = this;

		// Pass the older value props to parent components to remove older list in terms query
		var keyRef = value.toString().replace(/ /g, "_");
		var ref = "ref" + keyRef;
		var checkboxElement = this.refStore[ref];
		checkboxElement.state.status = false;

		var updated = this.state.selectedItems;
		var index = updated.indexOf(value);
		updated.splice(index, 1);

		if (this.state.selectAll) {
			index = updated.indexOf(this.props.selectAllLabel);
			updated.splice(index, 1);
		}

		this.setState({
			selectedItems: updated,
			selectAll: false
		}, function () {
			_this4.props.onRemove(_this4.state.selectedItems);
		});
	};

	ItemCheckboxList.prototype.getSelectedItems = function getSelectedItems() {
		// let selectedItems = this.state.selectedItems ? this.state.selectedItems : [];
		var selectedItems = [];
		this.props.items.forEach(function (item) {
			if (item.status && selectedItems.indexOf(item.key) < 0) {
				selectedItems.push(item.key);
			}
		});

		return selectedItems;
	};

	// handler function for select all


	ItemCheckboxList.prototype.handleListClickAll = function handleListClickAll(value, selectedStatus) {
		var _this5 = this;

		if (selectedStatus) {
			var selectedItems = this.props.items.map(function (item) {
				return item.key;
			});
			selectedItems = selectedStatus ? selectedItems : [];
			this.setState({
				selectedItems: [this.props.selectAllLabel].concat(selectedItems),
				selectAll: true
			}, function () {
				_this5.props.onSelectAll(value);
			});
		} else {
			this.setState({
				selectedItems: []
			}, function () {
				_this5.props.onSelect(null);
			});
		}
	};

	ItemCheckboxList.prototype.render = function render() {
		var _this6 = this;

		var items = this.props.items;
		var ListItemsArray = [];
		// Build the array for the checkboxList items
		items.forEach(function (item, index) {
			try {
				item.keyRef = item.key.replace(/ /g, "_");
			} catch (e) {
				item.keyRef = index;
			}
			var visibleFlag = !("visible" in item) ? true : !!item.visible;
			ListItemsArray.push(React.createElement(ListItem, {
				key: item.keyRef,
				value: item.key,
				doc_count: item.doc_count,
				countField: _this6.props.showCount,
				handleClick: _this6.handleListClick,
				visible: visibleFlag,
				showCheckbox: _this6.props.showCheckbox,
				status: _this6.state.selectedItems.indexOf(item.key) >= 0,
				ref: function ref(listitem) {
					var currentItemRef = "ref" + item.keyRef;
					_this6.refStore[currentItemRef] = listitem;
				}
			}));
		});
		// include select all if set from parent
		if (this.props.selectAllLabel && items && items.length) {
			ListItemsArray.unshift(React.createElement(ListItem, {
				key: "selectall",
				value: this.props.selectAllLabel,
				countField: false,
				visible: true,
				showCheckbox: this.props.showCheckbox,
				handleClick: this.handleListClickAll,
				status: this.props.selectAll,
				ref: function ref(listitem) {
					_this6.refStore.refselectall = listitem;
				}
			}));
		}

		return React.createElement(
			"div",
			{ className: "rbc-list-container col s12 col-xs-12" },
			React.createElement(
				"div",
				{ className: "row" },
				ListItemsArray
			)
		);
	};

	return ItemCheckboxList;
}(Component);

export default ItemCheckboxList;


ItemCheckboxList.propTypes = {
	defaultSelected: React.PropTypes.array,
	items: React.PropTypes.array,
	onRemove: React.PropTypes.func,
	onSelect: React.PropTypes.func,
	onSelectAll: React.PropTypes.func,
	selectAllLabel: React.PropTypes.string,
	selectAll: React.PropTypes.bool,
	showCount: React.PropTypes.bool,
	defaultSelectall: React.PropTypes.bool
};