'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SingleRange = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

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
		_this.handleChange = _this.handleChange.bind(_this);
		_this.defaultQuery = _this.defaultQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(SingleRange, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.setQueryInfo();
			if (this.props.defaultSelected) {
				var records = this.props.data.filter(function (record) {
					return record.label === _this2.props.defaultSelected;
				});
				if (records && records.length) {
					this.handleChange(records[0]);
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
		// Create a channel which passes the depends and receive results whenever depends changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			var depends = this.props.depends ? this.props.depends : {};
			var channelObj = _ChannelManager.manager.create(this.context.appbaseConfig, depends);
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: 'handleChange',
		value: function handleChange(record) {
			this.setState({
				'selected': record
			});
			var obj = {
				key: this.props.sensorId,
				value: record
			};
			// pass the selected sensor value with sensorId as key,
			var isExecuteQuery = true;
			helper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: 'renderButtons',
		value: function renderButtons() {
			var _this3 = this;

			var buttons = void 0;
			var selectedText = this.state.selected && this.state.selected.label ? this.state.selected.label : '';
			if (this.props.data) {
				buttons = this.props.data.map(function (record, i) {
					return _react2.default.createElement(
						'div',
						{ className: 'ab-ListComponent-listitem row', key: i, onClick: function onClick() {
								return _this3.handleChange(record);
							} },
						_react2.default.createElement(
							'div',
							{ className: 'col s12 col-xs-12 ab-radio-container' },
							_react2.default.createElement('input', { type: 'radio',
								className: 'ab-radio',
								checked: selectedText === record.label,
								name: 'SingleRange', id: 'SingleRange',
								value: record.label }),
							_react2.default.createElement(
								'label',
								null,
								' ',
								record.label,
								' '
							)
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
			var title = void 0,
			    titleExists = void 0;
			if (this.props.title) {
				titleExists = true;
				title = _react2.default.createElement(
					'h4',
					{ className: 'ab-componentTitle col s12 col-xs-12' },
					this.props.title
				);
			}
			return _react2.default.createElement(
				'div',
				{ className: "ab-component ab-ButtonGroupComponent col s12 col-xs-12 card thumbnail", style: this.props.defaultStyle },
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					title,
					_react2.default.createElement(
						'div',
						{ className: 'col s12 col-xs-12' },
						this.renderButtons()
					)
				)
			);
		}
	}]);

	return SingleRange;
}(_react.Component);

SingleRange.propTypes = {
	sensorId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	placeholder: _react2.default.PropTypes.string,
	data: _react2.default.PropTypes.any.isRequired
};
// Default props value
SingleRange.defaultProps = {
	placeholder: "Search...",
	size: 10
};

// context type
SingleRange.contextTypes = {
	appbaseConfig: _react2.default.PropTypes.any.isRequired
};