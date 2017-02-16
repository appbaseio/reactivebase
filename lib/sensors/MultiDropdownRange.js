'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MultiDropdownRange = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');
var _ = require('lodash');

var MultiDropdownRange = exports.MultiDropdownRange = function (_Component) {
	_inherits(MultiDropdownRange, _Component);

	function MultiDropdownRange(props, context) {
		_classCallCheck(this, MultiDropdownRange);

		var _this = _possibleConstructorReturn(this, (MultiDropdownRange.__proto__ || Object.getPrototypeOf(MultiDropdownRange)).call(this, props));

		_this.state = {
			selected: ""
		};
		_this.type = 'range';
		_this.state.data = _this.props.data.map(function (item) {
			item.value = item.label;
			return item;
		});
		_this.defaultSelected = _this.props.defaultSelected;
		_this.handleChange = _this.handleChange.bind(_this);
		_this.customQuery = _this.customQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(MultiDropdownRange, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.setQueryInfo();
			if (this.defaultSelected) {
				var records = this.state.data.filter(function (record) {
					return _this2.defaultSelected.indexOf(record.label) > -1 ? true : false;
				});
				if (records && records.length) {
					this.handleChange(records);
				}
			}
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			var _this3 = this;

			setTimeout(function () {
				if (!_.isEqual(_this3.defaultSelected, _this3.props.defaultSelected)) {
					_this3.defaultSelected = _this3.props.defaultSelected;
					var records = _this3.state.data.filter(function (record) {
						return _this3.defaultSelected.indexOf(record.label) > -1 ? true : false;
					});
					if (records && records.length) {
						_this3.handleChange(records);
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
				var query = {
					bool: {
						should: generateRangeQuery(this.props.appbaseField),
						"minimum_should_match": 1,
						"boost": 1.0
					}
				};
				return query;
			}
			function generateRangeQuery(appbaseField) {
				if (record.length > 0) {
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
			var selected = [];
			selected = record.map(function (item) {
				return item.label;
			});
			selected = selected.join();
			this.setState({
				'selected': selected
			});
			var obj = {
				key: this.props.componentId,
				value: record
			};
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			helper.selectedSensor.set(obj, isExecuteQuery);
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
				'rbc-placeholder-active': this.props.placeholder,
				'rbc-placeholder-inactive': !this.props.placeholder
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-multidropdownrange col s12 col-xs-12 card thumbnail ' + cx, style: this.props.defaultStyle },
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					title,
					_react2.default.createElement(
						'div',
						{ className: 'col s12 col-xs-12' },
						_react2.default.createElement(_reactSelect2.default, {
							options: this.state.data,
							value: this.state.selected,
							onChange: this.handleChange,
							clearable: false,
							multi: true,
							placeholder: this.props.placeholder,
							searchable: true })
					)
				)
			);
		}
	}]);

	return MultiDropdownRange;
}(_react.Component);

MultiDropdownRange.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string.isRequired,
	title: _react2.default.PropTypes.string,
	placeholder: _react2.default.PropTypes.string,
	data: _react2.default.PropTypes.any.isRequired,
	defaultSelected: _react2.default.PropTypes.array
};

// Default props value
MultiDropdownRange.defaultProps = {};

// context type
MultiDropdownRange.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};