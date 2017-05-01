var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { ReactiveBase, DataSearch, ReactiveList, SingleDropdownList } from "../app.js";
import { ResponsiveStory } from "../middleware/helper.js";
import moment from "moment";

var DataSearchHighlight = function (_Component) {
	_inherits(DataSearchHighlight, _Component);

	function DataSearchHighlight(props) {
		_classCallCheck(this, DataSearchHighlight);

		return _possibleConstructorReturn(this, (DataSearchHighlight.__proto__ || Object.getPrototypeOf(DataSearchHighlight)).call(this, props));
	}

	_createClass(DataSearchHighlight, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			ResponsiveStory();
		}
	}, {
		key: "onData",
		value: function onData(item) {
			var res = item._source;
			return React.createElement(
				"table",
				{ className: "rbc-highlight-table" },
				React.createElement(
					"tr",
					null,
					React.createElement(
						"th",
						null,
						"title"
					),
					React.createElement("td", { dangerouslySetInnerHTML: { __html: res.title } })
				),
				React.createElement(
					"tr",
					null,
					React.createElement(
						"th",
						null,
						"text"
					),
					React.createElement("td", { dangerouslySetInnerHTML: { __html: res.text } })
				),
				React.createElement(
					"tr",
					null,
					React.createElement(
						"th",
						null,
						"by"
					),
					React.createElement("td", { dangerouslySetInnerHTML: { __html: res.by } })
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				ReactiveBase,
				{
					app: "hn",
					credentials: "Uzq9SU9vM:7298de2f-1884-4d38-8dfd-f7fa14060198",
					type: "post"
				},
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						React.createElement(DataSearch, {
							componentId: "InputSensor",
							appbaseField: ["title", "text", "by"],
							placeholder: "Search posts by title, text or author...",
							autocomplete: false,
							highlight: true
						})
					),
					React.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						React.createElement(ReactiveList, {
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
}(Component);

export default DataSearchHighlight;


DataSearchHighlight.defaultProps = {
	mapping: {
		topic: "group.group_topics.topic_name_raw",
		venue: "venue_name_ngrams"
	}
};