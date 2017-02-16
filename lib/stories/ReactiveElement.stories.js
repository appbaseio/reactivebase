'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _app = require('../app.js');

var _helper = require('../middleware/helper.js');

var _Img = require('./Img.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./list.css');

var ReactiveElementDefault = function (_Component) {
	_inherits(ReactiveElementDefault, _Component);

	function ReactiveElementDefault(props) {
		_classCallCheck(this, ReactiveElementDefault);

		var _this = _possibleConstructorReturn(this, (ReactiveElementDefault.__proto__ || Object.getPrototypeOf(ReactiveElementDefault)).call(this, props));

		_this.cityQuery = _this.cityQuery.bind(_this);
		_this.onData = _this.onData.bind(_this);
		_this.DEFAULT_IMAGE = 'http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg';
		return _this;
	}

	_createClass(ReactiveElementDefault, [{
		key: 'cityQuery',
		value: function cityQuery(value) {
			if (value) {
				var field = 'group.group_city.group_city_simple';
				var query = JSON.parse('{"' + field + '":' + JSON.stringify(value) + '}');
				return { terms: query };
			} else return null;
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			(0, _helper.ResponsiveStory)();
		}
	}, {
		key: 'onData',
		value: function onData(response) {
			var res = response.res;
			var result = null;
			if (res) {
				var combineData = res.currentData;
				if (res.mode === 'historic') {
					combineData = res.currentData.concat(res.newData);
				} else if (res.mode === 'streaming') {
					combineData = (0, _helper.combineStreamData)(res.currentData, res.newData);
				}
				if (combineData) {
					result = _react2.default.createElement(
						'div',
						null,
						_react2.default.createElement(
							'pre',
							{ className: 'col-xs-12 pull-left' },
							JSON.stringify(res, null, 4)
						)
					);
				}
			}
			return result;
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				_app.ReactiveBase,
				{
					app: 'meetup2',
					username: 'qz4ZD8xq1',
					password: 'a0edfc7f-5611-46f6-8fe1-d4db234631f3',
					type: 'meetup'
				},
				_react2.default.createElement(
					'div',
					{ className: 'row reverse-labels' },
					_react2.default.createElement(
						'div',
						{ className: 'col s6 col-xs-6' },
						_react2.default.createElement(_app.ReactiveElement, _extends({
							componentId: 'SearchResult',
							from: 0,
							size: 20,
							onData: this.onData
						}, this.props, {
							react: {
								"and": "CitySensor"
							}
						}))
					),
					_react2.default.createElement(
						'div',
						{ className: 'col s6 col-xs-6' },
						_react2.default.createElement(_app.MultiList, {
							componentId: 'CitySensor',
							appbaseField: this.props.mapping.city,
							showCount: true,
							size: 10,
							title: 'Input Filter',
							customQuery: this.cityQuery,
							searchPlaceholder: 'Search City',
							includeSelectAll: true
						})
					)
				)
			);
		}
	}]);

	return ReactiveElementDefault;
}(_react.Component);

exports.default = ReactiveElementDefault;


ReactiveElementDefault.defaultProps = {
	mapping: {
		city: 'group.group_city.group_city_simple',
		topic: 'group.group_topics.topic_name.topic_name_simple'
	}
};