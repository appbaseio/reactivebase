'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AppbaseButtonGroup = undefined;

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

var AppbaseButtonGroup = exports.AppbaseButtonGroup = function (_Component) {
	_inherits(AppbaseButtonGroup, _Component);

	function AppbaseButtonGroup(props, context) {
		_classCallCheck(this, AppbaseButtonGroup);

		var _this = _possibleConstructorReturn(this, (AppbaseButtonGroup.__proto__ || Object.getPrototypeOf(AppbaseButtonGroup)).call(this, props));

		_this.state = {
			selected: null
		};
		_this.type = 'match';
		_this.handleChange = _this.handleChange.bind(_this);
		_this.defaultQuery = _this.defaultQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(AppbaseButtonGroup, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.setQueryInfo();
			if (this.props.defaultSelected) {
				this.handleChange(this.props.defaultSelected);
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
					inputData: this.props.inputData,
					defaultQuery: this.defaultQuery
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}

		// build query for this sensor only

	}, {
		key: 'defaultQuery',
		value: function defaultQuery(value) {
			return {
				'term': _defineProperty({}, this.props.inputData, value)
			};
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
			var _this2 = this;

			var buttons = void 0;
			var selectedText = this.state.selected && this.state.selected.text ? this.state.selected.text : '';
			if (this.props.data) {
				buttons = this.props.data.map(function (record, i) {
					return _react2.default.createElement(
						'button',
						{ key: i, className: "ab-button btn " + (selectedText === record.text ? 'red' : ''),
							onClick: function onClick() {
								return _this2.handleChange(record);
							}, title: record.title ? record.title : record.text },
						record.text
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

	return AppbaseButtonGroup;
}(_react.Component);

AppbaseButtonGroup.propTypes = {
	inputData: _react2.default.PropTypes.string,
	placeholder: _react2.default.PropTypes.string,
	data: _react2.default.PropTypes.any.isRequired
};
// Default props value
AppbaseButtonGroup.defaultProps = {
	placeholder: "Search...",
	size: 10
};

// context type
AppbaseButtonGroup.contextTypes = {
	appbaseConfig: _react2.default.PropTypes.any.isRequired
};