"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _ListItem = require("./ListItem");

var _ListItem2 = _interopRequireDefault(_ListItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemCheckboxList = function (_Component) {
	_inherits(ItemCheckboxList, _Component);

	function ItemCheckboxList(props) {
		_classCallCheck(this, ItemCheckboxList);

		var _this = _possibleConstructorReturn(this, (ItemCheckboxList.__proto__ || Object.getPrototypeOf(ItemCheckboxList)).call(this, props));

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

	_createClass(ItemCheckboxList, [{
		key: "componentDidMount",
		value: function componentDidMount() {
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
						selectedItems: items.length ? items : null
					}, function () {
						_this2.props.onSelect(_this2.state.selectedItems);
					});
				}
			}
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			if (nextProps.defaultSelected === null && !nextProps.selectAll) {
				this.setState({
					selectedItems: []
				});
			}
		}

		// Handler function when a checkbox is clicked

	}, {
		key: "handleListClick",
		value: function handleListClick(value, selectedStatus) {
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
		}

		// Handler function when a cancel button on tag is clicked to remove it

	}, {
		key: "removeItem",
		value: function removeItem(value) {
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
			var _this5 = this;

			if (selectedStatus) {
				var selectedItems = this.props.items.map(function (item) {
					return item.key;
				});
				selectedItems = selectedStatus ? selectedItems : [];
				this.setState({
					selectedItems: [this.props.selectAllLabel].concat(_toConsumableArray(selectedItems)),
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
		}
	}, {
		key: "render",
		value: function render() {
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
				ListItemsArray.push(_react2.default.createElement(_ListItem2.default, {
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
				ListItemsArray.unshift(_react2.default.createElement(_ListItem2.default, {
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

			return _react2.default.createElement(
				"div",
				{ className: "rbc-list-container col s12 col-xs-12" },
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
	onSelectAll: _react2.default.PropTypes.func,
	selectAllLabel: _react2.default.PropTypes.string,
	selectAll: _react2.default.PropTypes.bool,
	showCount: _react2.default.PropTypes.bool,
	defaultSelectall: _react2.default.PropTypes.bool
};