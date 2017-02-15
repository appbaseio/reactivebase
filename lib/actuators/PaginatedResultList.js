'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PaginatedResultList = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ResultList = require('./ResultList');

var _Pagination = require('./component/Pagination');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');

var PaginatedResultList = exports.PaginatedResultList = function (_Component) {
	_inherits(PaginatedResultList, _Component);

	function PaginatedResultList(props, context) {
		_classCallCheck(this, PaginatedResultList);

		return _possibleConstructorReturn(this, (PaginatedResultList.__proto__ || Object.getPrototypeOf(PaginatedResultList)).call(this, props));
	}

	_createClass(PaginatedResultList, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.actuate = this.props.actuate ? this.props.actuate : {};
			this.actuate['pagination'] = {};
		}
	}, {
		key: 'paginationAt',
		value: function paginationAt(method) {
			var pageinationComp = void 0;

			if (this.props.paginationAt === method || this.props.paginationAt === 'both') {
				pageinationComp = _react2.default.createElement(
					'div',
					{ className: 'rbc-pagination-container col s12 col-xs-12' },
					_react2.default.createElement(_Pagination.Pagination, {
						className: 'rbc-pagination-' + method,
						componentId: 'pagination',
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
					_react2.default.createElement(_ResultList.ResultList, _extends({}, this.props, {
						requestOnScroll: false,
						actuate: this.actuate
					}))
				),
				this.paginationAt('bottom')
			);
		}
	}]);

	return PaginatedResultList;
}(_react.Component);

PaginatedResultList.propTypes = {
	componentId: _react2.default.PropTypes.string,
	appbaseField: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.string,
	paginationAt: _react2.default.PropTypes.string,
	sortBy: _react2.default.PropTypes.oneOf(['asc', 'desc']),
	sortOptions: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
		label: _react2.default.PropTypes.string,
		field: _react2.default.PropTypes.string,
		order: _react2.default.PropTypes.string
	})),
	from: helper.validation.resultListFrom,
	onData: _react2.default.PropTypes.func,
	size: helper.sizeValidation,
	stream: _react2.default.PropTypes.bool
};

// Default props value
PaginatedResultList.defaultProps = {
	from: 0,
	size: 20,
	paginationAt: 'bottom'
};

// context type
PaginatedResultList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};