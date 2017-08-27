var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { ReactiveBase, MultiList, ReactiveList } from "../app";
import ResponsiveStory from "./ReactiveElement/ResponsiveStory";
import { Img } from "./Img";

require("./list.css");

var ReactiveListDefault = function (_Component) {
	_inherits(ReactiveListDefault, _Component);

	function ReactiveListDefault(props) {
		_classCallCheck(this, ReactiveListDefault);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.cityQuery = _this.cityQuery.bind(_this);
		_this.DEFAULT_IMAGE = "http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg";
		return _this;
	}

	ReactiveListDefault.prototype.componentDidMount = function componentDidMount() {
		ResponsiveStory();
	};

	ReactiveListDefault.prototype.onData = function onData(markerData) {
		var marker = markerData._source;
		return React.createElement(
			"a",
			{
				className: "full_row single-record single_record_for_clone " + (markerData.stream ? "animate" : ""),
				href: marker.event ? marker.event.event_url : "",
				target: "_blank",
				rel: "noreferrer noopener",
				key: markerData._id
			},
			React.createElement(
				"div",
				{ className: "img-container" },
				React.createElement(Img, { key: markerData._id, src: marker.member ? marker.member.photo : this.DEFAULT_IMAGE })
			),
			React.createElement(
				"div",
				{ className: "text-container full_row" },
				React.createElement(
					"div",
					{ className: "text-head text-overflow full_row" },
					React.createElement(
						"span",
						{ className: "text-head-info text-overflow" },
						marker.member ? marker.member.member_name : "",
						" is going to ",
						marker.event ? marker.event.event_name : ""
					),
					React.createElement(
						"span",
						{ className: "text-head-city" },
						marker.group ? marker.group.group_city : ""
					)
				),
				React.createElement(
					"div",
					{ className: "text-description text-overflow full_row" },
					React.createElement(
						"ul",
						{ className: "highlight_tags" },
						marker.group.group_topics.map(function (tag) {
							return React.createElement(
								"li",
								{ key: tag.topic_name },
								tag.topic_name
							);
						})
					)
				)
			)
		);
	};

	ReactiveListDefault.prototype.cityQuery = function cityQuery(value) {
		if (value) {
			var field = "group.group_city.group_city_simple";
			var query = JSON.parse("{\"" + field + "\":" + JSON.stringify(value) + "}");
			return { terms: query };
		}
		return null;
	};

	ReactiveListDefault.prototype.render = function render() {
		var placeholder = React.createElement(
			"h6",
			null,
			"Select a city to see the results."
		);
		return React.createElement(
			ReactiveBase,
			{
				app: "meetup2",
				credentials: "qz4ZD8xq1:a0edfc7f-5611-46f6-8fe1-d4db234631f3",
				type: "meetup"
			},
			React.createElement(
				"div",
				{ className: "row reverse-labels" },
				React.createElement(
					"div",
					{ className: "col s6 col-xs-6" },
					React.createElement(ReactiveList, _extends({
						componentId: "SearchResult",
						appbaseField: "group.group_topics.topic_name.topic_name_simple",
						title: "ReactiveList",
						sortBy: "asc",
						from: 0,
						size: 20,
						onData: this.onData,
						placeholder: placeholder,
						react: {
							and: "CitySensor"
						}
					}, this.props))
				),
				React.createElement(
					"div",
					{ className: "col s6 col-xs-6" },
					React.createElement(MultiList, {
						componentId: "CitySensor",
						appbaseField: "group.group_city.group_city_simple",
						showCount: true,
						size: 10,
						selectAllLabel: "All Cities",
						title: "Input Filter",
						customQuery: this.cityQuery,
						searchPlaceholder: "Search City",
						initialLoader: React.createElement(
							"p",
							null,
							"Loading cities..."
						)
					})
				)
			)
		);
	};

	return ReactiveListDefault;
}(Component);

export default ReactiveListDefault;