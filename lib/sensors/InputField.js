'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.InputField = undefined;

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

var InputField = exports.InputField = function (_Component) {
	_inherits(InputField, _Component);

	function InputField(props, context) {
		_classCallCheck(this, InputField);

		var _this = _possibleConstructorReturn(this, (InputField.__proto__ || Object.getPrototypeOf(InputField)).call(this, props));

		_this.state = {
			currentValue: ''
		};
		_this.type = 'match';
		_this.handleChange = _this.handleChange.bind(_this);
		_this.defaultQuery = _this.defaultQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(InputField, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.setQueryInfo();
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
		value: function handleChange(event) {
			var inputVal = event.target.value;
			this.setState({
				'currentValue': inputVal
			});
			var obj = {
				key: this.props.sensorId,
				value: inputVal
			};

			// pass the selected sensor value with sensorId as key,
			var isExecuteQuery = true;
			helper.selectedSensor.set(obj, isExecuteQuery);
		}

		// render

	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'ab-component ab-InputFieldComponent' },
				_react2.default.createElement('input', { className: 'ab-input', type: 'text', onChange: this.handleChange, placeholder: this.props.placeholder, value: this.state.currentValue })
			);
		}
	}]);

	return InputField;
}(_react.Component);

InputField.propTypes = {
	inputData: _react2.default.PropTypes.string,
	placeholder: _react2.default.PropTypes.string
};
// Default props value
InputField.defaultProps = {
	placeholder: "Search...",
	size: 10
};

// context type
InputField.contextTypes = {
	appbaseConfig: _react2.default.PropTypes.any.isRequired
};