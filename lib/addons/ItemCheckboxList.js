"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _ListItem = require("./ListItem");

var _ListItem2 = _interopRequireDefault(_ListItem);

var _Tag = require("./Tag");

var _Tag2 = _interopRequireDefault(_Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemCheckboxList = function (_Component) {
	_inherits(ItemCheckboxList, _Component);

	function ItemCheckboxList(props) {
		_classCallCheck(this, ItemCheckboxList);

		var _this = _possibleConstructorReturn(this, (ItemCheckboxList.__proto__ || Object.getPrototypeOf(ItemCheckboxList)).call(this, props));

		_this.state = {
			selectedItems: []
		};
		_this.refStore = {};
		_this.handleListClick = _this.handleListClick.bind(_this);
		_this.handleTagClick = _this.handleTagClick.bind(_this);
		_this.handleListClickAll = _this.handleListClickAll.bind(_this);
		_this.clearAll = _this.clearAll.bind(_this);
		return _this;
	}

	_createClass(ItemCheckboxList, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.props.defaultSelected) {
				this.defaultUpdate();
			}
		}
	}, {
		key: "defaultUpdate",
		value: function defaultUpdate() {
			var _this2 = this;

			var defaultSelectAll = this.props.defaultSelected.indexOf(this.props.selectAllLabel) > -1;
			if (defaultSelectAll) {
				this.setDefaultSelectAll();
			} else {
				this.setState({
					selectedItems: this.props.defaultSelected,
					defaultSelectall: this.props.defaultSelectall
				}, function () {
					_this2.updateAction.bind(_this2);
					_this2.props.onSelect(_this2.state.selectedItems);
				});
			}
		}
	}, {
		key: "setDefaultSelectAll",
		value: function setDefaultSelectAll() {
			if (this.props.items && this.props.items.length) {
				setTimeout(this.handleListClickAll.bind(this, this.props.selectAllLabel, true), 1000);
			} else {
				setTimeout(this.setDefaultSelectAll.bind(this), 1000);
			}
		}

		// remove selected types if not in the list

	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			var _this3 = this;

			var updated = null;
			var isExecutable = true;
			if (this.state.selectedItems) {
				updated = JSON.parse(JSON.stringify(this.state.selectedItems));
			}
			if (updated && updated.length && this.props.items && this.props.items.length) {
				updated = updated.filter(function (item) {
					var updatedFound = _this3.props.items.filter(function (propItem) {
						return propItem.key === item;
					});
					return !!updatedFound.length;
				});
				if (updated.length !== this.state.selectedItems.length) {
					isExecutable = !updated.length;
					this.props.onRemove(this.state.selectedItems, isExecutable);
					this.updateSelectedItems(updated);
					if (updated.length) {
						this.props.onSelect(updated);
					}
				}
			}
		}

		// Handler function when a checkbox is clicked

	}, {
		key: "handleListClick",
		value: function handleListClick(value, selectedStatus) {
			var updated = void 0;
			// If the checkbox selectedStatus is true, then update selectedItems array
			if (selectedStatus) {
				this.props.onRemove(this.state.selectedItems, false);
				updated = this.state.selectedItems;
				updated.push(value);
				this.setState({
					selectedItems: updated
				}, this.updateAction.bind(this));
				// Pass the props to parent components to add to the Query
				if (this.state.selectedItems.length) {
					this.props.onSelect(this.state.selectedItems);
				}
			} else {
				// If the checkbox selectedStatus is false
				// Call handleTagClick to remove it from the selected Items
				this.handleTagClick(value);
			}
		}

		// Handler function when a cancel button on tag is clicked to remove it

	}, {
		key: "handleTagClick",
		value: function handleTagClick(value) {
			// Pass the older value props to parent components to remove older list in terms query
			var isExecutable = this.state.selectedItems.length === 1;
			this.props.onRemove(this.state.selectedItems, isExecutable);
			var keyRef = value.toString().replace(/ /g, "_");
			var ref = "ref" + keyRef;
			var checkboxElement = this.refStore[ref];
			checkboxElement.state.status = false;
			var updated = this.state.selectedItems;
			var index = updated.indexOf(value);
			updated.splice(index, 1);
			this.setState({
				selectedItems: updated
			}, this.updateAction.bind(this));
			// Pass the removed value props to parent components to add updated list in terms query
			// if(updated.length) {
			this.props.onSelect(updated);
			// }
		}
	}, {
		key: "clearAll",
		value: function clearAll() {
			this.handleListClickAll(this.props.selectAllLabel, false);
		}
	}, {
		key: "getSelectedItems",
		value: function getSelectedItems() {
			// let selectedItems = this.state.selectedItems ? this.state.selectedItems : [];
			var selectedItems = [];
			this.props.items.forEach(function (item) {
				if (item.status && selectedItems.indexOf(item.key) < 0) {
					selectedItems.push(item.key);
				}
			});

			return selectedItems;
		}

		// handler function for select all

	}, {
		key: "handleListClickAll",
		value: function handleListClickAll(value, selectedStatus) {
			var _this4 = this;

			this.props.selectAll(selectedStatus);
			var selectedItems = this.props.items.map(function (item) {
				return item.key;
			});
			selectedItems = selectedStatus ? selectedItems : [];
			this.setState({
				defaultSelectall: selectedStatus,
				selectedItems: selectedItems
			}, function () {
				_this4.updateAction.bind(_this4);
				_this4.props.onSelect(_this4.state.selectedItems, selectedItems);
			});
		}
	}, {
		key: "updateSelectedItems",
		value: function updateSelectedItems(updated) {
			this.setState({
				selectedItems: updated
			});
		}
	}, {
		key: "updateAction",
		value: function updateAction() {
			if (!this.state.selectedItems.length) {
				this.props.onSelect(null);
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			var items = this.props.items;
			var selectedItems = this.getSelectedItems();
			var ListItemsArray = [];
			var TagItemsArray = [];
			// Build the array for the checkboxList items
			items.forEach(function (item, index) {
				try {
					item.keyRef = item.key.replace(/ /g, "_");
				} catch (e) {
					item.keyRef = index;
				}
				var visibleFlag = !("visible" in item) ? true : !!item.visible;
				ListItemsArray.push(_react2.default.createElement(_ListItem2.default, {
					key: item.keyRef,
					value: item.key,
					doc_count: item.doc_count,
					countField: _this5.props.showCount,
					handleClick: _this5.handleListClick,
					visible: visibleFlag,
					showCheckbox: _this5.props.showCheckbox,
					status: item.status || false,
					ref: function ref(listitem) {
						var currentItemRef = "ref" + item.keyRef;
						_this5.refStore[currentItemRef] = listitem;
					}
				}));
			});
			// include select all if set from parent
			if (this.props.selectAllLabel && items && items.length) {
				ListItemsArray.unshift(_react2.default.createElement(_ListItem2.default, {
					key: "selectall",
					value: this.props.selectAllLabel,
					countField: false,
					visible: true,
					showCheckbox: this.props.showCheckbox,
					handleClick: this.handleListClickAll,
					status: this.props.selectAllValue,
					ref: function ref(listitem) {
						_this5.refStore.refselectall = listitem;
					}
				}));
			}
			// Build the array of Tags for selected items
			if (this.props.showTags && selectedItems) {
				if (selectedItems.length <= 5) {
					selectedItems.forEach(function (item) {
						TagItemsArray.push(_react2.default.createElement(_Tag2.default, {
							key: item,
							value: item,
							onClick: _this5.handleTagClick
						}));
					});
				} else {
					TagItemsArray.unshift(_react2.default.createElement(_Tag2.default, {
						key: "Clear All",
						value: "Clear All",
						onClick: this.clearAll
					}));
				}
			}
			return _react2.default.createElement(
				"div",
				{ className: "rbc-list-container col s12 col-xs-12" },
				TagItemsArray.length ? _react2.default.createElement(
					"div",
					{ className: "row rbc-tag-container" },
					TagItemsArray
				) : null,
				_react2.default.createElement(
					"div",
					{ className: "row" },
					ListItemsArray
				)
			);
		}
	}]);

	return ItemCheckboxList;
}(_react.Component);

exports.default = ItemCheckboxList;


ItemCheckboxList.propTypes = {
	defaultSelected: _react2.default.PropTypes.array,
	items: _react2.default.PropTypes.array,
	onRemove: _react2.default.PropTypes.func,
	onSelect: _react2.default.PropTypes.func,
	selectAll: _react2.default.PropTypes.func,
	selectAllLabel: _react2.default.PropTypes.string,
	selectAllValue: _react2.default.PropTypes.bool,
	showCount: _react2.default.PropTypes.bool,
	showTags: _react2.default.PropTypes.bool,
	defaultSelectall: _react2.default.PropTypes.bool
};

ItemCheckboxList.defaultProps = {
	showTags: true
};