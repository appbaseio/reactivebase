'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DropdownList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');
var _ = require('lodash');

var DropdownList = exports.DropdownList = function (_Component) {
	_inherits(DropdownList, _Component);

	function DropdownList(props, context) {
		_classCallCheck(this, DropdownList);

		var _this = _possibleConstructorReturn(this, (DropdownList.__proto__ || Object.getPrototypeOf(DropdownList)).call(this, props));

		_this.state = {
			items: [],
			value: '',
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		_this.channelId = null;
		_this.channelListener = null;
		_this.previousSelectedSensor = {};
		_this.defaultSelected = _this.props.defaultSelected;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.type = _this.props.multipleSelect ? 'Terms' : 'Term';
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(DropdownList, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.setQueryInfo();
			this.createChannel();
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			var _this2 = this;

			setTimeout(function () {
				if (_this2.props.multipleSelect) {
					if (!_.isEqual(_this2.defaultSelected, _this2.props.defaultSelected)) {
						_this2.defaultSelected = _this2.props.defaultSelected;
						var records = _this2.state.items.filter(function (record) {
							return _this2.defaultSelected.indexOf(record.label) > -1 ? true : false;
						});
						if (records.length) {
							_this2.handleChange(records);
						}
					}
				} else {
					if (_this2.defaultSelected != _this2.props.defaultSelected) {
						_this2.defaultSelected = _this2.props.defaultSelected;
						var _records = _this2.state.items.filter(function (record) {
							return record.label === _this2.defaultSelected;
						});
						if (_records.length) {
							_this2.handleChange(_records[0]);
						}
					}
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
			if (this.channelListener) {
				this.channelListener.remove();
			}
		}

		// set the query type and input data

	}, {
		key: 'setQueryInfo',
		value: function setQueryInfo() {
			var obj = {
				key: this.props.sensorId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}

		// Create a channel which passes the depends and receive results whenever depends changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			// Set the depends - add self aggs query as well with depends
			var depends = this.props.depends ? this.props.depends : {};
			depends['aggs'] = {
				key: this.props.appbaseField,
				sort: this.props.sortBy,
				size: this.props.size
			};
			// create a channel and listen the changes
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, depends);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
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
				this.setData(rawData);
			}.bind(this));
		}
	}, {
		key: 'setData',
		value: function setData(data) {
			if (data.aggregations && data.aggregations[this.props.appbaseField] && data.aggregations[this.props.appbaseField].buckets) {
				this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
			}
		}
	}, {
		key: 'addItemsToList',
		value: function addItemsToList(newItems) {
			var _this3 = this;

			newItems = newItems.map(function (item) {
				item.label = item.key.toString();
				item.value = item.key.toString();
				return item;
			});
			if (this.props.selectAllLabel) {
				newItems.unshift({ label: this.props.selectAllLabel, value: this.props.selectAllLabel });
			}
			this.setState({
				items: newItems,
				value: newItems[0].label
			});
			this.setValue(newItems[0].label, true);
			if (this.defaultSelected) {
				if (this.props.multipleSelect) {
					var records = this.state.items.filter(function (record) {
						return _this3.defaultSelected.indexOf(record.label) > -1 ? true : false;
					});
					if (records.length) {
						this.handleChange(records);
					}
				} else {
					var _records2 = this.state.items.filter(function (record) {
						return record.label === _this3.defaultSelected;
					});
					if (_records2.length) {
						this.handleChange(_records2[0]);
					}
				}
			}
		}

		// Handler function when a value is selected

	}, {
		key: 'handleChange',
		value: function handleChange(value) {
			var result = void 0;
			if (this.props.multipleSelect) {
				result = [];
				value.map(function (item) {
					result.push(item.label);
				});
				result = result.join();
			} else {
				result = value.label;
			}
			this.setState({
				value: result
			});
			this.setValue(result, true);
		}

		// set value

	}, {
		key: 'setValue',
		value: function setValue(value) {
			var isExecuteQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (this.props.multipleSelect) {
				value = value.split(',');
			}
			var obj = {
				key: this.props.sensorId,
				value: value
			};
			if (value == this.props.selectAllLabel) {
				obj = {
					key: this.props.sensorId,
					value: {
						queryType: "match_all"
					}
				};
				helper.selectedSensor.setSensorInfo(obj);
			} else {
				this.setQueryInfo();
			}
			helper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: 'render',
		value: function render() {
			// Checking if component is single select or multiple select
			var title = null;
			if (this.props.title) {
				title = _react2.default.createElement(
					'h4',
					{ className: 'rbc-title col s12 col-xs-12' },
					this.props.title
				);
			}

			var cx = (0, _classnames2.default)({
				'rbc-title-active': this.props.title,
				'rbc-title-inactive': !this.props.title,
				'rbc-placeholder-active': this.props.placeholder,
				'rbc-placeholder-inactive': !this.props.placeholder,
				'rbc-multidropdownlist': this.props.multipleSelect,
				'rbc-singledropdownlist': !this.props.multipleSelect
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc col s12 col-xs-12 card thumbnail ' + cx },
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					title,
					_react2.default.createElement(
						'div',
						{ className: 'col s12 col-xs-12' },
						this.state.items.length ? _react2.default.createElement(_reactSelect2.default, {
							options: this.state.items,
							clearable: false,
							value: this.state.value,
							onChange: this.handleChange,
							multi: this.props.multipleSelect,
							placeholder: this.props.placeholder,
							searchable: true }) : null
					)
				)
			);
		}
	}]);

	return DropdownList;
}(_react.Component);

DropdownList.propTypes = {
	appbaseField: _react2.default.PropTypes.string.isRequired,
	size: _react2.default.PropTypes.number,
	multipleSelect: _react2.default.PropTypes.bool,
	sortBy: _react2.default.PropTypes.string,
	placeholder: _react2.default.PropTypes.string
};

// Default props value
DropdownList.defaultProps = {
	sortBy: 'count',
	size: 100,
	title: null,
	placeholder: 'Select...'
};

// context type
DropdownList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};