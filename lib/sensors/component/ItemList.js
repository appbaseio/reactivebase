'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ItemList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDom = require('react-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemList = exports.ItemList = function (_Component) {
	_inherits(ItemList, _Component);

	function ItemList(props) {
		_classCallCheck(this, ItemList);

		var _this = _possibleConstructorReturn(this, (ItemList.__proto__ || Object.getPrototypeOf(ItemList)).call(this, props));

		_this.state = {
			selectedItem: []
		};
		_this.defaultSelected = _this.props.defaultSelected;
		_this.defaultAllowed = true;
		_this.handleClick = _this.handleClick.bind(_this);
		_this.handleListClickAll = _this.handleListClickAll.bind(_this);
		return _this;
	}

	_createClass(ItemList, [{
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			if (this.defaultSelected != this.props.defaultSelected) {
				this.defaultSelected = this.props.defaultSelected;
				this.defaultSelection();
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			if (this.props.items.length && this.defaultAllowed) {
				this.defaultAllowed = false;
				this.defaultSelection();
			}
		}
	}, {
		key: 'defaultSelection',
		value: function defaultSelection() {
			if (this.props.defaultSelected) {
				this.handleClick(this.props.defaultSelected);
			}
		}
	}, {
		key: 'handleListClickAll',
		value: function handleListClickAll(value) {
			var selectedItems = this.props.items.map(function (item) {
				return item.key;
			});
			this.props.selectAll(value, selectedItems);
			this.setState({
				selectedItem: value
			}, function () {
				this.props.onSelect(selectedItems, value);
			}.bind(this));
		}

		// Handler function is called when the list item is clicked

	}, {
		key: 'handleClick',
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
		key: 'renderItemsComponent',
		value: function renderItemsComponent() {
			var items = this.props.items;
			var itemsComponent = [];
			// Build the array of components for each item
			items.forEach(function (item) {
				var visibleFlag = !item.hasOwnProperty('visible') ? true : item.visible ? true : false;
				itemsComponent.push(_react2.default.createElement(ItemRow, {
					key: item.key,
					value: item.key,
					doc_count: item.doc_count,
					countField: this.props.showCount,
					handleClick: this.handleClick,
					visible: visibleFlag,
					selectedItem: this.state.selectedItem }));
			}.bind(this));

			// include select all if set from parent
			if (this.props.selectAllLabel && items && items.length) {
				itemsComponent.unshift(_react2.default.createElement(ItemRow, {
					key: 'selectall',
					visible: true,
					value: this.props.selectAllLabel,
					countField: false,
					handleClick: this.handleListClickAll,
					selectedItem: this.state.selectedItem,
					ref: "refselectall" }));
			}

			return itemsComponent;
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'rbc-list-container col s12 col-xs-12' },
				this.renderItemsComponent()
			);
		}
	}]);

	return ItemList;
}(_react.Component);

var ItemRow = function (_Component2) {
	_inherits(ItemRow, _Component2);

	function ItemRow(props) {
		_classCallCheck(this, ItemRow);

		return _possibleConstructorReturn(this, (ItemRow.__proto__ || Object.getPrototypeOf(ItemRow)).call(this, props));
	}

	_createClass(ItemRow, [{
		key: 'renderItem',
		value: function renderItem() {
			var count = void 0;
			// Check if user wants to show count field
			if (this.props.countField) {
				count = _react2.default.createElement(
					'span',
					{ className: 'rbc-count' },
					' (',
					this.props.doc_count,
					') '
				);
			}
			var item = _react2.default.createElement(
				'a',
				{ href: 'javascript:void(0)', className: "col s12 col-xs-12" },
				_react2.default.createElement(
					'span',
					null,
					' ',
					this.props.value,
					' '
				),
				count
			);
			if (this.props.value === this.props.selectedItem) {
				item = _react2.default.createElement(
					'a',
					{ href: 'javascript:void(0)', className: "col s12 col-xs-12" },
					_react2.default.createElement(
						'strong',
						null,
						_react2.default.createElement(
							'span',
							null,
							' ',
							this.props.value,
							' '
						),
						count
					)
				);
			}
			return item;
		}
	}, {
		key: 'renderCount',
		value: function renderCount() {
			var count = void 0;
			// Check if user wants to show count field
			if (this.props.countField) {
				count = _react2.default.createElement(
					'span',
					{ className: 'rbc-count' },
					' ',
					this.props.doc_count,
					' '
				);
			}
			return count;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var cx = (0, _classnames2.default)({
				'rbc-count-active': this.props.countField,
				'rbc-count-inactive': !this.props.countField,
				'rbc-item-show': this.props.visible,
				'rbc-item-hide': !this.props.visible
			});
			// let activeClass = this.props.value === this.props.selectedItem ? 'active' : '';
			return _react2.default.createElement(
				'div',
				{ className: 'rbc-list-item row ' + cx, onClick: function onClick() {
						return _this3.props.handleClick(_this3.props.value);
					} },
				_react2.default.createElement('input', { type: 'radio',
					className: 'rbc-radio-item',
					checked: this.props.value === this.props.selectedItem,
					value: this.props.value }),
				_react2.default.createElement(
					'label',
					{ className: 'rbc-label' },
					this.props.value,
					' ',
					this.renderCount()
				)
			);
		}
	}]);

	return ItemRow;
}(_react.Component);