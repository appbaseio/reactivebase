'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SingleRange = undefined;

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

var SingleRange = exports.SingleRange = function (_Component) {
	_inherits(SingleRange, _Component);

	function SingleRange(props, context) {
		_classCallCheck(this, SingleRange);

		var _this = _possibleConstructorReturn(this, (SingleRange.__proto__ || Object.getPrototypeOf(SingleRange)).call(this, props));

		_this.state = {
			selected: null
		};
		_this.type = 'range';
		_this.defaultSelected = _this.props.defaultSelected;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(SingleRange, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.setQueryInfo();
			if (this.defaultSelected) {
				var records = this.props.data.filter(function (record) {
					return record.label === _this2.defaultSelected;
				});
				if (records && records.length) {
					this.handleChange(records[0]);
				}
			}
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			var _this3 = this;

			setTimeout(function () {
				if (_this3.defaultSelected != _this3.props.defaultSelected) {
					_this3.defaultSelected = _this3.props.defaultSelected;
					var records = _this3.props.data.filter(function (record) {
						return record.label === _this3.defaultSelected;
					});
					if (records && records.length) {
						_this3.handleChange(records[0]);
					}
				}
			}, 300);
		}

		// set the query type and input data

	}, {
		key: 'setQueryInfo',
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
		key: 'customQuery',
		value: function customQuery(record) {
			if (record) {
				return {
					range: _defineProperty({}, this.props.appbaseField, {
						gte: record.start,
						lte: record.end,
						boost: 2.0
					})
				};
			}
		}

		// use this only if want to create actuators
		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			var react = this.props.react ? this.props.react : {};
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, react);
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: 'handleChange',
		value: function handleChange(record) {
			this.setState({
				'selected': record
			});
			var obj = {
				key: this.props.componentId,
				value: record
			};
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			helper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: 'renderButtons',
		value: function renderButtons() {
			var _this4 = this;

			var buttons = void 0;
			var selectedText = this.state.selected && this.state.selected.label ? this.state.selected.label : '';
			if (this.props.data) {
				buttons = this.props.data.map(function (record, i) {
					return _react2.default.createElement(
						'div',
						{ className: 'rbc-list-item row', key: i, onClick: function onClick() {
								return _this4.handleChange(record);
							} },
						_react2.default.createElement('input', { type: 'radio',
							className: 'rbc-radio-item',
							checked: selectedText === record.label,
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
				'rbc-title-inactive': !this.props.title
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-singlerange col s12 col-xs-12 card thumbnail ' + cx, style: this.props.defaultStyle },
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					title,
					_react2.default.createElement(
						'div',
						{ className: 'col s12 col-xs-12 rbc-list-container' },
						this.renderButtons()
					)
				)
			);
		}
	}]);

	return SingleRange;
}(_react.Component);

SingleRange.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.string,
	data: _react2.default.PropTypes.any.isRequired,
	defaultSelected: _react2.default.PropTypes.string
};

// Default props value
SingleRange.defaultProps = {
	title: null
};

// context type
SingleRange.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};