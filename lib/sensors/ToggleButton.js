'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ToggleButton = undefined;

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

var ToggleButton = exports.ToggleButton = function (_Component) {
	_inherits(ToggleButton, _Component);

	function ToggleButton(props, context) {
		_classCallCheck(this, ToggleButton);

		var _this = _possibleConstructorReturn(this, (ToggleButton.__proto__ || Object.getPrototypeOf(ToggleButton)).call(this, props));

		_this.state = {
			selected: []
		};
		_this.type = 'term';
		_this.defaultSelected = _this.props.defaultSelected;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(ToggleButton, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.setQueryInfo();
			if (this.defaultSelected) {
				var records = this.props.data.filter(function (record) {
					return _this2.defaultSelected.indexOf(record.label) > -1 ? true : false;
				});
				if (records && records.length) {
					records.forEach(function (singleRecord) {
						_this2.handleChange(singleRecord);
					});
				}
			}
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			var _this3 = this;

			if (this.defaultSelected != this.props.defaultSelected) {
				this.defaultSelected = this.props.defaultSelected;
				var records = this.props.data.filter(function (record) {
					return _this3.defaultSelected.indexOf(record.label) > -1 ? true : false;
				});
				if (records && records.length) {
					records.forEach(function (singleRecord) {
						_this3.handleChange(singleRecord);
					});
				}
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
			var query = null;
			if (record && record.length) {
				query = {
					bool: {
						should: generateRangeQuery(this.props.appbaseField),
						"minimum_should_match": 1,
						"boost": 1.0
					}
				};
				return query;
			} else {
				return query;
			}
			function generateRangeQuery(appbaseField) {
				return record.map(function (singleRecord, index) {
					return {
						term: _defineProperty({}, appbaseField, singleRecord.value)
					};
				});
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
			var selected = this.state.selected;
			var newSelection = [];
			var selectedIndex = null;
			selected.forEach(function (selectedRecord, index) {
				if (record.label === selectedRecord.label) {
					selectedIndex = index;
					selected.splice(index, 1);
				}
			});
			if (selectedIndex === null) {
				if (this.props.multiSelect) {
					selected.push(record);
					newSelection = selected;
				} else {
					newSelection.push(record);
				}
			} else {
				newSelection = selected;
			}
			this.setState({
				'selected': newSelection
			});
			var obj = {
				key: this.props.componentId,
				value: newSelection
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
			var selectedText = this.state.selected.map(function (record) {
				return record.label;
			});
			if (this.props.data) {
				buttons = this.props.data.map(function (record, i) {
					return _react2.default.createElement(
						'button',
						{ key: i, className: "btn rbc-btn " + (selectedText.indexOf(record.label) > -1 ? 'rbc-btn-active' : 'rbc-btn-inactive'),
							onClick: function onClick() {
								return _this4.handleChange(record);
							}, title: record.title ? record.title : record.label },
						record.label
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
				'rbc-title-inactive': !this.props.title,
				'rbc-multiselect-active': this.props.multiSelect,
				'rbc-multiselect-inactive': !this.props.multiSelect
			});
			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-togglebutton col s12 col-xs-12 card thumbnail ' + cx, style: this.props.defaultStyle },
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					title,
					_react2.default.createElement(
						'div',
						{ className: 'rbc-buttongroup col s12 col-xs-12' },
						this.renderButtons()
					)
				)
			);
		}
	}]);

	return ToggleButton;
}(_react.Component);

ToggleButton.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.string,
	data: _react2.default.PropTypes.any.isRequired,
	defaultSelected: _react2.default.PropTypes.array,
	multiSelect: _react2.default.PropTypes.bool
};

// Default props value
ToggleButton.defaultProps = {
	multiSelect: true
};

// context type
ToggleButton.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};