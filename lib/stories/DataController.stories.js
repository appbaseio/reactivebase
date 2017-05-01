var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { ReactiveBase, DataController, ReactiveList } from "../app.js";
import { ResponsiveStory } from "../middleware/helper.js";

var DataControllerDefault = function (_Component) {
	_inherits(DataControllerDefault, _Component);

	function DataControllerDefault(props) {
		_classCallCheck(this, DataControllerDefault);

		var _this = _possibleConstructorReturn(this, (DataControllerDefault.__proto__ || Object.getPrototypeOf(DataControllerDefault)).call(this, props));

		_this.CustomQuery = _this.CustomQuery.bind(_this);
		return _this;
	}

	_createClass(DataControllerDefault, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			ResponsiveStory();
		}
	}, {
		key: "CustomQuery",
		value: function CustomQuery(value) {
			return {
				query: {
					match_all: {}
				}
			};
		}
	}, {
		key: "onData",
		value: function onData(markerData) {
			var marker = markerData._source;
			return React.createElement(
				"a",
				{
					className: "full_row single-record single_record_for_clone",
					href: "#",
					key: markerData._id
				},
				React.createElement(
					"div",
					{ className: "text-container full_row", style: { paddingLeft: "10px" } },
					React.createElement(
						"div",
						{ className: "text-head text-overflow full_row" },
						React.createElement(
							"span",
							{ className: "text-head-info text-overflow" },
							marker.name ? marker.name : "",
							" - ",
							marker.brand ? marker.brand : ""
						),
						React.createElement(
							"span",
							{ className: "text-head-city" },
							marker.brand ? marker.brand : ""
						)
					),
					React.createElement(
						"div",
						{ className: "text-description text-overflow full_row" },
						React.createElement(
							"ul",
							{ className: "highlight_tags" },
							marker.price ? "Priced at $" + marker.price : "Free Test Drive"
						)
					)
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				ReactiveBase,
				{
					app: "car-store",
					credentials: "cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
				},
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						React.createElement(DataController, _extends({
							componentId: "CustomSensor",
							appbaseField: "name",
							customQuery: this.CustomQuery
						}, this.props))
					),
					React.createElement(
						"div",
						{ className: "col s6 col-xs-6" },
						React.createElement(ReactiveList, {
							componentId: "SearchResult",
							appbaseField: "name",
							title: "Cars",
							from: 0,
							size: 20,
							onData: this.onData,
							react: {
								and: "CustomSensor"
							}
						})
					)
				)
			);
		}
	}]);

	return DataControllerDefault;
}(Component);

export default DataControllerDefault;