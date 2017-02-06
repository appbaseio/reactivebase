'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.NumberBox = undefined;

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

var TitleComponent = function TitleComponent(props) {
	return _react2.default.createElement(
		'h4',
		{ className: 'rbc-title col s12 col-xs-12' },
		props.title
	);
};

var NumberBoxButtonComponent = function NumberBoxButtonComponent(props) {
	var cx = (0, _classnames2.default)({
		'rbc-btn-active': props.isActive,
		'rbc-btn-inactive': !props.isActive
	});
	var type = props.type;

	var increment = type == 'plus' ? 1 : -1;

	return _react2.default.createElement(
		'button',
		{ className: 'btn rbc-btn ' + cx, onClick: props.isActive && function () {
				return props.handleChange(increment);
			} },
		_react2.default.createElement('span', { className: 'fa fa-' + type + ' rbc-icon' })
	);
};

var NumberComponent = function NumberComponent(props) {
	var label = props.label,
	    max = props.max,
	    min = props.min,
	    handleChange = props.handleChange;

	var value = props.value != undefined ? props.value : min;
	var isPlusActive = max != undefined ? value < max : true;
	var isMinusActive = min != undefined ? value > min : true;

	return _react2.default.createElement(
		'div',
		{ className: 'rbc-numberbox-container col s12 col-xs-12' },
		_react2.default.createElement(
			'div',
			{ className: 'rbc-label' },
			label
		),
		_react2.default.createElement(
			'div',
			{ className: 'rbc-numberbox-btn-container' },
			_react2.default.createElement(NumberBoxButtonComponent, { isActive: isMinusActive, handleChange: handleChange, type: 'minus' }),
			_react2.default.createElement(
				'span',
				{ className: 'rbc-numberbox-number' },
				value
			),
			_react2.default.createElement(NumberBoxButtonComponent, { isActive: isPlusActive, handleChange: handleChange, type: 'plus' })
		)
	);
};

var NumberBox = function (_Component) {
	_inherits(NumberBox, _Component);

	function NumberBox(props, context) {
		_classCallCheck(this, NumberBox);

		var _this = _possibleConstructorReturn(this, (NumberBox.__proto__ || Object.getPrototypeOf(NumberBox)).call(this, props));

		var _this$props = _this.props,
		    defaultSelected = _this$props.defaultSelected,
		    focused = _this$props.focused;

		_this.state = {
			currentValue: defaultSelected,
			focused: focused
		};
		_this.type = 'term';
		_this.handleChange = _this.handleChange.bind(_this);
		_this.defaultQuery = _this.defaultQuery.bind(_this);
		return _this;
	}

	_createClass(NumberBox, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.setQueryInfo();
			this.handleChange();
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var _this2 = this;

			setTimeout(function () {
				if (nextProps.defaultSelected !== _this2.state.currentValue) {
					_this2.setState({
						currentValue: nextProps.defaultSelected
					});
				}
			}, 300);
		}

		// build query for this sensor only

	}, {
		key: 'defaultQuery',
		value: function defaultQuery(value) {
			return _defineProperty({}, this.type, _defineProperty({}, this.props.appbaseField, value));
		}
	}, {
		key: 'setQueryInfo',
		value: function setQueryInfo() {
			var _props = this.props,
			    componentId = _props.componentId,
			    appbaseField = _props.appbaseField;

			var obj = {
				key: componentId,
				value: {
					queryType: this.type,
					inputData: appbaseField,
					defaultQuery: this.defaultQuery
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}

		// use this only if want to create actuators
		// Create a channel which passes the actuate and receive results whenever actuate changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			var actuate = this.props.actuate ? this.props.actuate : {};
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, actuate);
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: 'handleChange',
		value: function handleChange() {
			var increment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var _props2 = this.props,
			    componentId = _props2.componentId,
			    data = _props2.data;
			var min = data.min,
			    max = data.max;

			var inputVal = this.state.currentValue;

			min = min != undefined ? min : inputVal - 1;
			max = max != undefined ? max : inputVal + 1;

			if (increment > 0 && inputVal < max) {
				inputVal += 1;
			} else if (increment < 0 && inputVal > min) {
				inputVal -= 1;
			}

			this.setState({
				currentValue: inputVal
			});

			var obj = {
				key: componentId,
				value: inputVal
			};
			helper.selectedSensor.set(obj, true);
		}
	}, {
		key: 'render',
		value: function render() {
			var _props3 = this.props,
			    title = _props3.title,
			    data = _props3.data,
			    labelPosition = _props3.labelPosition;
			var currentValue = this.state.currentValue;

			var ComponentTitle = title ? _react2.default.createElement(TitleComponent, { title: title }) : null;
			var cx = (0, _classnames2.default)({
				'rbc-title-active': title,
				'rbc-title-inactive': !title
			});
			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-numberbox col s12 col-xs-12 card thumbnail ' + cx + ' rbc-label-' + labelPosition },
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					ComponentTitle,
					_react2.default.createElement(NumberComponent, {
						handleChange: this.handleChange,
						value: currentValue,
						label: data.label,
						min: data.min,
						max: data.max
					})
				)
			);
		}
	}]);

	return NumberBox;
}(_react.Component);

;

NumberBox.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.string,
	data: _react2.default.PropTypes.shape({
		min: helper.validateThreshold,
		max: helper.validateThreshold,
		label: _react2.default.PropTypes.string
	}),
	defaultSelected: helper.valueValidation,
	labelPosition: _react2.default.PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

// context type
NumberBox.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

exports.NumberBox = NumberBox;