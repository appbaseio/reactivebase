'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.NestedList = undefined;

var _NestedList$propTypes;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ItemCheckboxList = require('./component/ItemCheckboxList.js');

var _NestedItem = require('./component/NestedItem.js');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

var _StaticSearch = require('./component/StaticSearch.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');
var _ = require('lodash');

var NestedList = exports.NestedList = function (_Component) {
	_inherits(NestedList, _Component);

	function NestedList(props, context) {
		_classCallCheck(this, NestedList);

		var _this = _possibleConstructorReturn(this, (NestedList.__proto__ || Object.getPrototypeOf(NestedList)).call(this, props));

		_this.state = {
			items: [],
			storedItems: [],
			rawData: {
				hits: {
					hits: []
				}
			},
			subItems: [],
			selectedValues: []
		};
		_this.nested = ['nestedParentaggs', 'nestedChildaggs'];
		_this.sortObj = {
			aggSort: _this.props.sortBy
		};
		_this.channelId = null;
		_this.channelListener = null;
		_this.defaultSelected = _this.props.defaultSelected;
		_this.filterBySearch = _this.filterBySearch.bind(_this);
		_this.onItemSelect = _this.onItemSelect.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		_this.handleSelect = _this.handleSelect.bind(_this);
		_this.type = 'Term';
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(NestedList, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.setQueryInfo();
			this.createChannel();
			this.createSubChannel();
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			if (this.props.defaultSelected) {
				this.setValue('', false);
				setTimeout(function () {
					_this2.handleSelect();
				}, 2000);
			}
		}
	}, {
		key: 'handleSelect',
		value: function handleSelect() {
			var _this3 = this;

			if (this.props.defaultSelected) {
				this.props.defaultSelected.forEach(function (value, index) {
					_this3.onItemSelect(value, index);
				});
			}
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			var _this4 = this;

			setTimeout(function () {
				if (!_.isEqual(_this4.defaultSelected, _this4.props.defaultSelected)) {
					_this4.defaultSelected = _this4.props.defaultSelected;
					var items = _this4.state.items;
					items = items.map(function (item) {
						item.key = item.key.toString();
						item.status = _this4.defaultSelected.length && _this4.defaultSelected.indexOf(item.key) > -1 ? true : false;
						return item;
					});
					_this4.setState({
						items: items,
						storedItems: items
					});
					_this4.handleSelect(_this4.defaultSelected);
				}
				if (_this4.sortBy != _this4.props.sortBy) {
					_this4.sortBy = _this4.props.sortBy;
					_this4.handleSortSelect();
				}
			}, 300);
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.channelId) {
				_ChannelManager.manager.stopStream(this.channelId);
			}
			if (this.subChannelId) {
				_ChannelManager.manager.stopStream(this.subChannelId);
			}
			if (this.channelListener) {
				this.channelListener.remove();
			}
			if (this.subChannelListener) {
				this.subChannelListener.remove();
			}
		}

		// build query for this sensor only

	}, {
		key: 'customQuery',
		value: function customQuery(record) {
			if (record) {
				var query = {
					bool: {
						must: generateRangeQuery(this.props.appbaseField)
					}
				};
				return query;
			}
			function generateRangeQuery(appbaseField) {
				return record.map(function (singleRecord, index) {
					return {
						term: _defineProperty({}, appbaseField[index], singleRecord)
					};
				});
			}
		}

		// set the query type and input data

	}, {
		key: 'setQueryInfo',
		value: function setQueryInfo() {
			var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField[0],
					customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}
	}, {
		key: 'includeAggQuery',
		value: function includeAggQuery() {
			var _this5 = this;

			this.nested.forEach(function (name) {
				var obj = {
					key: name,
					value: _this5.sortObj
				};
				helper.selectedSensor.setSortInfo(obj);
			});
		}
	}, {
		key: 'handleSortSelect',
		value: function handleSortSelect() {
			var _this6 = this;

			this.sortObj = {
				aggSort: this.props.sortBy
			};
			this.nested.forEach(function (name) {
				var obj = {
					key: name,
					value: _this6.sortObj
				};
				helper.selectedSensor.set(obj, true, 'sortChange');
			});
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			// Set the react - add self aggs query as well with react
			var react = this.props.react ? this.props.react : {};
			react['aggs'] = {
				key: this.props.appbaseField[0],
				sort: this.props.sortBy,
				size: this.props.size,
				sortRef: this.nested[0]
			};
			if (react && react.and && typeof react.and === 'string') {
				react.and = [react.and];
			} else {
				react.and = react.and ? react.and : [];
			}
			react.and.push(this.nested[0]);
			this.includeAggQuery();

			// create a channel and listen the changes
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, react);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(this.channelId, function (res) {
				var data = res.data;
				var rawData = void 0;
				if (res.mode === 'streaming') {
					rawData = this.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === 'historic') {
					rawData = data;
				}
				this.setState({
					rawData: rawData
				});
				this.setData(rawData, 0);
			}.bind(this));
		}

		// Create a channel for sub category

	}, {
		key: 'createSubChannel',
		value: function createSubChannel() {
			this.setSubCategory();
			var react = {
				'aggs': {
					key: this.props.appbaseField[1],
					sort: this.props.sortBy,
					size: this.props.size,
					sortRef: this.nested[1]
				},
				'and': ['subCategory', this.nested[1]]
			};
			// create a channel and listen the changes
			var subChannelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, react);
			this.subChannelId = subChannelObj.channelId;
			this.subChannelListener = subChannelObj.emitter.addListener(this.subChannelId, function (res) {
				var data = res.data;
				var rawData = void 0;
				if (res.mode === 'streaming') {
					rawData = this.state.subRawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === 'historic') {
					rawData = data;
				}
				if (this.state.selectedValues.length) {
					this.setState({
						subRawData: rawData
					});
					this.setData(rawData, 1);
				}
			}.bind(this));
			var obj = {
				key: 'subCategory',
				value: ''
			};
			helper.selectedSensor.set(obj, true);
		}

		// set the query type and input data

	}, {
		key: 'setSubCategory',
		value: function setSubCategory() {
			var obj = {
				key: 'subCategory',
				value: {
					queryType: 'term',
					inputData: this.props.appbaseField[0]
				}
			};

			helper.selectedSensor.setSensorInfo(obj);
		}
	}, {
		key: 'setData',
		value: function setData(data, level) {
			if (data.aggregations && data.aggregations[this.props.appbaseField[level]] && data.aggregations[this.props.appbaseField[level]].buckets) {
				this.addItemsToList(data.aggregations[this.props.appbaseField[level]].buckets, level);
			}
		}
	}, {
		key: 'addItemsToList',
		value: function addItemsToList(newItems, level) {
			var _this7 = this,
			    _setState;

			newItems = newItems.map(function (item) {
				item.key = item.key.toString();
				item.status = _this7.defaultSelected && _this7.defaultSelected.indexOf(item.key) > -1 ? true : false;
				return item;
			});
			var itemVar = level === 0 ? 'items' : 'subItems';
			this.setState((_setState = {}, _defineProperty(_setState, itemVar, newItems), _defineProperty(_setState, 'storedItems', newItems), _setState));
		}

		// set value

	}, {
		key: 'setValue',
		value: function setValue(value) {
			var isExecuteQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var obj = {
				key: this.props.componentId,
				value: value
			};
			helper.selectedSensor.set(obj, isExecuteQuery);
		}

		// filter

	}, {
		key: 'filterBySearch',
		value: function filterBySearch(value) {
			if (value) {
				var items = this.state.storedItems.filter(function (item) {
					return item.key && item.key.toLowerCase().indexOf(value.toLowerCase()) > -1;
				});
				this.setState({
					items: items
				});
			} else {
				this.setState({
					items: this.state.storedItems
				});
			}
		}
	}, {
		key: 'onItemSelect',
		value: function onItemSelect(key, level) {
			var selectedValues = this.state.selectedValues;
			var stateItems = {};
			if (selectedValues[level] == key || this.defaultSelected && this.defaultSelected.length == 1) {
				delete selectedValues[level];
				stateItems = {
					selectedValues: selectedValues
				};
			} else {
				selectedValues[level] = key;
				stateItems = {
					selectedValues: selectedValues
				};
				if (level === 0) {
					selectedValues.splice(1, 1);
					if (key !== selectedValues[0]) {
						stateItems.subItems = [];
					}
					var obj = {
						key: 'subCategory',
						value: key
					};
					helper.selectedSensor.set(obj, true);
				}
			}
			this.setValue(selectedValues, true);
			this.setState(stateItems);
		}
	}, {
		key: 'renderChevron',
		value: function renderChevron(level) {
			return level === 0 ? _react2.default.createElement('i', { className: 'fa fa-chevron-right' }) : '';
		}
	}, {
		key: 'countRender',
		value: function countRender(doc_count) {
			var count;
			if (this.props.showCount) {
				count = _react2.default.createElement(
					'span',
					{ className: 'rbc-count' },
					' ',
					doc_count
				);
			}
			return count;
		}
	}, {
		key: 'renderItems',
		value: function renderItems(items, level) {
			var _this8 = this;

			return items.map(function (item, index) {
				var cx = (0, _classnames2.default)({
					'rbc-item-active': item.key === _this8.state.selectedValues[level],
					'rbc-item-inactive': !(item.key === _this8.state.selectedValues[level])
				});
				return _react2.default.createElement(
					'li',
					{
						key: index,
						className: 'rbc-list-container col s12 col-xs-12' },
					_react2.default.createElement(
						'a',
						{ href: 'javascript:void(0);', className: 'rbc-list-item ' + cx, onClick: function onClick() {
								return _this8.onItemSelect(item.key, level);
							} },
						_react2.default.createElement(
							'span',
							{ className: 'rbc-label' },
							item.key,
							' ',
							_this8.countRender(item.doc_count)
						),
						_this8.renderChevron(level)
					),
					_this8.renderList(item.key, level)
				);
			});
		}
	}, {
		key: 'renderList',
		value: function renderList(key, level) {
			var list = void 0;
			if (key === this.state.selectedValues[level] && level === 0) {
				list = _react2.default.createElement(
					'ul',
					{ className: 'rbc-sublist-container rbc-indent col s12 col-xs-12' },
					this.renderItems(this.state.subItems, 1)
				);
			}
			return list;
		}
	}, {
		key: 'render',
		value: function render() {
			var listComponent = void 0,
			    searchComponent = null,
			    title = null;

			listComponent = _react2.default.createElement(
				'ul',
				{ className: 'row rbc-list-container' },
				this.renderItems(this.state.items, 0)
			);

			// set static search
			if (this.props.showSearch) {
				searchComponent = _react2.default.createElement(_StaticSearch.StaticSearch, {
					placeholder: this.props.placeholder,
					changeCallback: this.filterBySearch
				});
			}

			if (this.props.title) {
				title = _react2.default.createElement(
					'h4',
					{ className: 'rbc-title col s12 col-xs-12' },
					this.props.title
				);
			}

			var cx = (0, _classnames2.default)({
				'rbc-search-active': this.props.showSearch,
				'rbc-search-inactive': !this.props.showSearch,
				'rbc-title-active': this.props.title,
				'rbc-title-inactive': !this.props.title,
				'rbc-placeholder-active': this.props.placeholder,
				'rbc-placeholder-inactive': !this.props.placeholder,
				'rbc-count-active': this.props.showCount,
				'rbc-count-inactive': !this.props.showCount
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-nestedlist col s12 col-xs-12 card thumbnail ' + cx },
				title,
				searchComponent,
				listComponent
			);
		}
	}]);

	return NestedList;
}(_react.Component);

NestedList.propTypes = (_NestedList$propTypes = {
	appbaseField: _react2.default.PropTypes.array.isRequired,
	size: _react2.default.PropTypes.number,
	showCount: _react2.default.PropTypes.bool,
	sortBy: _react2.default.PropTypes.oneOf(['count', 'asc', 'desc'])
}, _defineProperty(_NestedList$propTypes, 'size', helper.sizeValidation), _defineProperty(_NestedList$propTypes, 'defaultSelected', _react2.default.PropTypes.array), _NestedList$propTypes);

// Default props value
NestedList.defaultProps = {
	showCount: true,
	sortBy: 'count',
	size: 100,
	showSearch: false,
	title: null,
	placeholder: 'Search'
};

// context type
NestedList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};