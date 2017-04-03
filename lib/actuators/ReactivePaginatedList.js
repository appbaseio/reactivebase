'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactiveList = require('./ReactiveList');

var _ReactiveList2 = _interopRequireDefault(_ReactiveList);

var _Pagination = require('../addons/Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _constants = require('../middleware/constants.js');

var TYPES = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');

var ReactivePaginatedList = function (_Component) {
	_inherits(ReactivePaginatedList, _Component);

	function ReactivePaginatedList(props, context) {
		_classCallCheck(this, ReactivePaginatedList);

		return _possibleConstructorReturn(this, (ReactivePaginatedList.__proto__ || Object.getPrototypeOf(ReactivePaginatedList)).call(this, props));
	}

	_createClass(ReactivePaginatedList, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.paginationAtVal = this.props.paginationAt;
			this.setQueryInfo();
			this.setReact();
			this.executePaginationUpdate();
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			var _this2 = this;

			setTimeout(function () {
				if (_this2.paginationAtVal !== _this2.props.paginationAt) {
					_this2.paginationAtVal = _this2.props.paginationAt;
					_this2.executePaginationUpdate();
				}
			}, 300);
		}
	}, {
		key: 'customQuery',
		value: function customQuery() {
			return null;
		}
		// set the query type and input data

	}, {
		key: 'setQueryInfo',
		value: function setQueryInfo() {
			var valObj = {
				queryType: 'match',
				inputData: this.props.appbaseField,
				customQuery: this.customQuery
			};
			var obj = {
				key: 'paginationChanges',
				value: valObj
			};
			helper.selectedSensor.setSensorInfo(obj);
		}
	}, {
		key: 'setReact',
		value: function setReact() {
			this.react = this.props.react ? this.props.react : {};
			this.react.pagination = {};
			if (this.react && this.react.and && typeof this.react.and === "string") {
				this.react.and = [this.react.and];
			}
			this.react.and.push("paginationChanges");
		}
	}, {
		key: 'executePaginationUpdate',
		value: function executePaginationUpdate() {
			setTimeout(function () {
				var obj = {
					key: "paginationChanges",
					value: Math.random()
				};
				helper.selectedSensor.set(obj, true);
			}, 100);
		}
	}, {
		key: 'paginationAt',
		value: function paginationAt(method) {
			var pageinationComp = void 0;

			if (this.props.paginationAt === method || this.props.paginationAt === 'both') {
				pageinationComp = _react2.default.createElement(
					'div',
					{ className: 'rbc-pagination-container col s12 col-xs-12' },
					_react2.default.createElement(_Pagination2.default, {
						className: 'rbc-pagination-' + method,
						componentId: 'pagination',
						onPageChange: this.props.onPageChange,
						title: this.props.paginationTitle })
				);
			}
			return pageinationComp;
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'row' },
				this.paginationAt('top'),
				_react2.default.createElement(
					'div',
					{ className: 'rbc-pagination-container col s12 col-xs-12' },
					_react2.default.createElement(_ReactiveList2.default, _extends({}, this.props, {
						requestOnScroll: false,
						react: this.react
					}))
				),
				this.paginationAt('bottom')
			);
		}
	}]);

	return ReactivePaginatedList;
}(_react.Component);

exports.default = ReactivePaginatedList;


ReactivePaginatedList.propTypes = {
	componentId: _react2.default.PropTypes.string,
	appbaseField: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	paginationAt: _react2.default.PropTypes.string,
	sortBy: _react2.default.PropTypes.oneOf(['asc', 'desc', 'default']),
	sortOptions: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
		label: _react2.default.PropTypes.string,
		field: _react2.default.PropTypes.string,
		order: _react2.default.PropTypes.string
	})),
	from: helper.validation.resultListFrom,
	onData: _react2.default.PropTypes.func,
	onPageChange: _react2.default.PropTypes.func,
	size: helper.sizeValidation,
	stream: _react2.default.PropTypes.bool,
	initialLoader: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number, _react2.default.PropTypes.element]),
	noResults: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number, _react2.default.PropTypes.element]),
	showResultStats: _react2.default.PropTypes.bool,
	onResultStats: _react2.default.PropTypes.func,
	placeholder: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number, _react2.default.PropTypes.element])
};

// Default props value
ReactivePaginatedList.defaultProps = {
	from: 0,
	size: 20,
	paginationAt: 'bottom',
	showResultStats: true
};

// context type
ReactivePaginatedList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

ReactivePaginatedList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	sortBy: TYPES.STRING,
	sortOptions: TYPES.OBJECT,
	from: TYPES.NUMBER,
	size: TYPES.NUMBER,
	paginationAt: TYPES.STRING,
	onData: TYPES.FUNCTION,
	onPageChange: TYPES.FUNCTION,
	requestOnScroll: TYPES.BOOLEAN,
	stream: TYPES.BOOLEAN,
	componentStyle: TYPES.OBJECT,
	initialLoader: TYPES.STRING,
	noResults: TYPES.STRING,
	showResultStats: TYPES.BOOLEAN,
	onResultStats: TYPES.FUNCTION,
	placeholder: TYPES.STRING
};