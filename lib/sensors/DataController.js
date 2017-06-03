"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require("../middleware/constants");

var TYPES = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require("../middleware/helper");

var DataController = function (_Component) {
	_inherits(DataController, _Component);

	function DataController(props) {
		_classCallCheck(this, DataController);

		var _this = _possibleConstructorReturn(this, (DataController.__proto__ || Object.getPrototypeOf(DataController)).call(this, props));

		_this.type = "match";
		_this.value = "customValue";
		_this.urlParams = helper.URLParams.get(_this.props.componentId);
		return _this;
	}

	// Set query information


	_createClass(DataController, [{
		key: "componentWillMount",
		value: function componentWillMount() {
			this.setQueryInfo();
			this.checkDefault();
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			this.checkDefault();
		}
	}, {
		key: "checkDefault",
		value: function checkDefault() {
			this.defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
			if (this.defaultValue && this.defaultSelected != this.defaultValue) {
				this.defaultSelected = this.defaultValue;
				setTimeout(this.setValue.bind(this, this.defaultSelected), 100);
			}
		}

		// set the query type and input data

	}, {
		key: "setQueryInfo",
		value: function setQueryInfo() {
			var valObj = {
				queryType: this.type,
				inputData: this.props.appbaseField
			};
			if (this.props.customQuery) {
				valObj.customQuery = this.props.customQuery;
			}
			var obj = {
				key: this.props.componentId,
				value: valObj
			};
			helper.selectedSensor.setSensorInfo(obj);
		}
	}, {
		key: "setValue",
		value: function setValue(value) {
			var obj = {
				key: this.props.componentId,
				value: value
			};
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			helper.URLParams.update(this.props.componentId, value, this.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		}

		// render

	}, {
		key: "render",
		value: function render() {
			var title = null,
			    dataLabel = null;
			if (this.props.title) {
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}
			if (this.props.dataLabel) {
				dataLabel = _react2.default.createElement(
					"span",
					{ className: "rbc-datalabel col s12 col-xs-12" },
					this.props.dataLabel
				);
			}

			var cx = (0, _classnames2.default)({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title,
				"rbc-datalabel-active": this.props.dataLabel,
				"rbc-datalabel-inactive": !this.props.dataLabel,
				"rbc-visible-active": this.props.visible,
				"rbc-visible-inactive": !this.props.visible
			});

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-datacontroller card thumbnail " + cx, style: this.props.componentStyle },
				this.props.visible ? _react2.default.createElement(
					"div",
					null,
					title,
					dataLabel
				) : null
			);
		}
	}]);

	return DataController;
}(_react.Component);

exports.default = DataController;


DataController.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	visible: _react2.default.PropTypes.bool,
	dataLabel: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	customQuery: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	componentStyle: _react2.default.PropTypes.object,
	defaultSelected: _react2.default.PropTypes.any,
	URLParams: _react2.default.PropTypes.bool,
	allowFilter: _react2.default.PropTypes.bool
};

_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]);

// Default props value
DataController.defaultProps = {
	visible: false,
	defaultSelected: "default",
	componentStyle: {},
	URLParams: false,
	allowFilter: true
};

// context type
DataController.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};

DataController.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.STRING,
	title: TYPES.STRING,
	visible: TYPES.BOOLEAN,
	dataLabel: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	allowFilter: TYPES.BOOLEAN
};