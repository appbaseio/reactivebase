"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _app = require("../app.js");

var _helper = require("../middleware/helper.js");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataSearchHighlight = function (_Component) {
	_inherits(DataSearchHighlight, _Component);

	function DataSearchHighlight(props) {
		_classCallCheck(this, DataSearchHighlight);

		return _possibleConstructorReturn(this, (DataSearchHighlight.__proto__ || Object.getPrototypeOf(DataSearchHighlight)).call(this, props));
	}

	_createClass(DataSearchHighlight, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			(0, _helper.ResponsiveStory)();
		}
	}, {
		key: "onData",
		value: function onData(item) {
			var res = item._source;
			return _react2.default.createElement(
				"table",
				{ className: "rbc-highlight-table" },
				_react2.default.createElement(
					"tr",
					null,
					_react2.default.createElement(
						"th",
						null,
						"title"
					),
					_react2.default.createElement("td", { dangerouslySetInnerHTML: { __html: res.title } })
				),
				_react2.default.createElement(
					"tr",
					null,
					_react2.default.createElement(
						"th",
						null,
						"text"
					),
					_react2.default.createElement("td", { dangerouslySetInnerHTML: { __html: res.text } })
				),
				_react2.default.createElement(
					"tr",
					null,
					_react2.default.createElement(
						"th",
						null,
						"by"
					),
					_react2.default.createElement("td", { dangerouslySetInnerHTML: { __html: res.by } })
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(
				_app.ReactiveBase,
				{
					app: "hn",
					credentials: "Uzq9SU9vM:7298de2f-1884-4d38-8dfd-f7fa14060198",
					type: "post"
				},
				_react2.default.createElement(
					"div",
					{ className: "row" },
					_react2.default.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						_react2.default.createElement(_app.DataSearch, {
							componentId: "InputSensor",
							appbaseField: ["title", "text", "by"],
							placeholder: "Search posts by title, text or author...",
							autocomplete: false,
							highlight: true
						})
					),
					_react2.default.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						_react2.default.createElement(_app.ReactiveList, {
							appbaseField: "title",
							from: 0,
							size: 50,
							showPagination: true,
							onData: this.onData,
							react: {
								and: ["InputSensor"]
							}
						})
					)
				)
			);
		}
	}]);

	return DataSearchHighlight;
}(_react.Component);

exports.default = DataSearchHighlight;


DataSearchHighlight.defaultProps = {
	mapping: {
		topic: "group.group_topics.topic_name_raw",
		venue: "venue_name_ngrams"
	}
};