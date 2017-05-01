var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { ReactiveBase, MultiList, ReactiveElement } from "../../app.js";
import { ResponsiveStory, combineStreamData } from "../../middleware/helper.js";
import { GetTopTopics } from "./helper";
import { Img } from "../Img.js";

require("../list.css");

var WithTheme = function (_Component) {
	_inherits(WithTheme, _Component);

	function WithTheme(props) {
		_classCallCheck(this, WithTheme);

		var _this = _possibleConstructorReturn(this, (WithTheme.__proto__ || Object.getPrototypeOf(WithTheme)).call(this, props));

		_this.cityQuery = _this.cityQuery.bind(_this);
		_this.onAllData = _this.onAllData.bind(_this);
		_this.DEFAULT_IMAGE = "http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg";
		return _this;
	}

	_createClass(WithTheme, [{
		key: "cityQuery",
		value: function cityQuery(value) {
			if (value) {
				var field = "group.group_city.group_city_simple";
				var query = JSON.parse("{\"" + field + "\":" + JSON.stringify(value) + "}");
				return { terms: query };
			}return null;
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			ResponsiveStory();
		}
	}, {
		key: "onAllData",
		value: function onAllData(res, err) {
			var _this2 = this;

			var result = null;
			if (res && res.appliedQuery) {
				var combineData = res.currentData;
				if (res.mode === "historic") {
					combineData = res.currentData.concat(res.newData);
				} else if (res.mode === "streaming") {
					combineData = combineStreamData(res.currentData, res.newData);
				}
				if (combineData) {
					combineData = GetTopTopics(combineData);
					var resultMarkup = combineData.map(function (data, index) {
						if (index < 5) {
							return _this2.itemMarkup(data, index);
						}
					});
					result = React.createElement(
						"div",
						{ className: "trendingTopics col s12 col-xs-12", style: { padding: "10px", paddingBottom: "60px", color: "#eee" } },
						React.createElement(
							"table",
							{ className: "table" },
							React.createElement(
								"tbody",
								null,
								resultMarkup
							)
						)
					);
				}
			}
			return result;
		}
	}, {
		key: "itemMarkup",
		value: function itemMarkup(data, index) {
			return React.createElement(
				"tr",
				{ key: index },
				React.createElement(
					"th",
					null,
					data.name
				),
				React.createElement(
					"td",
					null,
					data.value
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				ReactiveBase,
				{
					app: "meetup2",
					credentials: "qz4ZD8xq1:a0edfc7f-5611-46f6-8fe1-d4db234631f3",
					type: "meetup",
					theme: "rbc-dark"
				},
				React.createElement(
					"div",
					{ className: "row reverse-labels" },
					React.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						React.createElement(ReactiveElement, _extends({
							componentId: "SearchResult",
							from: 0,
							size: 1000,
							onAllData: this.onAllData,
							placeholder: "Select a city from the input filter...",
							title: "Reactive Element: Dark Theme"
						}, this.props, {
							react: {
								and: "CitySensor"
							}
						}))
					),
					React.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						React.createElement(MultiList, {
							componentId: "CitySensor",
							appbaseField: "group.group_city.group_city_simple",
							showCount: true,
							size: 10,
							title: "Input Filter",
							initialLoader: "Loading city list..",
							selectAllLabel: "All cities",
							customQuery: this.cityQuery,
							searchPlaceholder: "Search City",
							includeSelectAll: true
						})
					)
				)
			);
		}
	}]);

	return WithTheme;
}(Component);

export default WithTheme;