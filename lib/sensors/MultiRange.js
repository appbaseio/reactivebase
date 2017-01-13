'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MultiRange = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');

var MultiRange = exports.MultiRange = function (_Component) {
	_inherits(MultiRange, _Component);

	function MultiRange(props, context) {
		_classCallCheck(this, MultiRange);

		var _this = _possibleConstructorReturn(this, (MultiRange.__proto__ || Object.getPrototypeOf(MultiRange)).call(this, props));

		_this.state = {
			selected: []
		};
		_this.type = 'range';
		_this.handleChange = _this.handleChange.bind(_this);
		_this.handleTagClick = _this.handleTagClick.bind(_this);
		_this.defaultQuery = _this.defaultQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(MultiRange, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.setQueryInfo();
			if (this.props.defaultSelected) {
				var records = this.props.data.filter(function (record) {
					return _this2.props.defaultSelected.indexOf(record.label) > -1 ? true : false;
				});
				if (records && records.length) {
					records.forEach(function (singleRecord) {
						_this2.handleChange(singleRecord);
					});
				}
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
					inputData: this.props.appbaseField,
					defaultQuery: this.defaultQuery
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}

		// build query for this sensor only

	}, {
		key: 'defaultQuery',
		value: function defaultQuery(record) {
			if (record) {
				var query = {
					bool: {
						should: generateRangeQuery(this.props.appbaseField),
						"minimum_should_match": 1,
						"boost": 1.0
					}
				};
				console.log(query);
				return query;
			}
			function generateRangeQuery(appbaseField) {
				return record.map(function (singleRecord, index) {
					return {
						range: _defineProperty({}, appbaseField, {
							gte: singleRecord.start,
							lte: singleRecord.end,
							boost: 2.0
						})
					};
				});
			}
		}

		// use this only if want to create actuators
		// Create a channel which passes the depends and receive results whenever depends changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			var depends = this.props.depends ? this.props.depends : {};
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, depends);
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: 'handleChange',
		value: function handleChange(record) {
			var selected = this.state.selected;
			var selectedIndex = null;
			var isAlreadySelected = selected.forEach(function (selectedRecord, index) {
				if (record.label === selectedRecord.label) {
					selectedIndex = index;
					selected.splice(index, 1);
				}
			});
			if (selectedIndex === null) {
				selected.push(record);
			}
			this.setState({
				'selected': selected
			});
			var obj = {
				key: this.props.sensorId,
				value: selected
			};
			// pass the selected sensor value with sensorId as key,
			var isExecuteQuery = true;
			helper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: 'handleTagClick',
		value: function handleTagClick(label) {
			var target = this.state.selected.filter(function (record) {
				return record.label == label;
			});
			this.handleChange(target[0]);
		}
	}, {
		key: 'renderButtons',
		value: function renderButtons() {
			var _this3 = this;

			var buttons = void 0;
			var selectedText = this.state.selected.map(function (record) {
				return record.label;
			});
			if (this.props.data) {
				buttons = this.props.data.map(function (record, i) {
					return _react2.default.createElement(
						'div',
						{ className: 'rbc-list-item row', key: i, onClick: function onClick() {
								return _this3.handleChange(record);
							} },
						_react2.default.createElement('input', { type: 'checkbox',
							checked: selectedText.indexOf(record.label) > -1 ? true : false,
							value: record.label }),
						_react2.default.createElement(
							'label',
							{ className: 'rbc-label' },
							record.label
						)
					);
				});
			}
			return buttons;
		}

		// render

	}, {
		key: 'render',
		value: function render() {
			var title = null,
			    TagItemsArray = [];

			if (this.props.title) {
				title = _react2.default.createElement(
					'h4',
					{ className: 'rbc-title col s12 col-xs-12' },
					this.props.title
				);
			}

			if (this.props.showTags && this.state.selected) {
				this.state.selected.forEach(function (item) {
					TagItemsArray.push(_react2.default.createElement(Tag, {
						key: item.label,
						value: item.label,
						onClick: this.handleTagClick }));
				}.bind(this));
			}

			var cx = (0, _classnames2.default)({
				'rbc-title-active': this.props.title,
				'rbc-title-inactive': !this.props.title
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-multirange col s12 col-xs-12 card thumbnail ' + cx, style: this.props.defaultStyle },
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					title,
					_react2.default.createElement(
						'div',
						{ className: 'col s12 col-xs-12 rbc-list-container' },
						TagItemsArray.length ? _react2.default.createElement(
							'div',
							{ className: 'row', style: { 'marginTop': '0' } },
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

var Tag = function (_Component2) {
	_inherits(Tag, _Component2);

	function Tag(props) {
		_classCallCheck(this, Tag);

		return _possibleConstructorReturn(this, (Tag.__proto__ || Object.getPrototypeOf(Tag)).call(this, props));
	}

	_createClass(Tag, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'span',
				{ onClick: this.props.onClick.bind(null, this.props.value), className: 'rbc-tag-item col' },
				_react2.default.createElement(
					'a',
					{ href: 'javascript:void(0)', className: 'close' },
					' x '
				),
				_react2.default.createElement(
					'span',
					null,
					this.props.value
				)
			);
		}
	}]);

	return Tag;
}(_react.Component);

MultiRange.propTypes = {
	sensorId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	data: _react2.default.PropTypes.any.isRequired,
	defaultSelected: _react2.default.PropTypes.array,
	showTags: _react2.default.PropTypes.bool
};

// Default props value
MultiRange.defaultProps = {
	size: 10,
	showTags: true
};

// context type
MultiRange.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};