var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { ReactiveBase, DataSearch, ReactiveList } from "../app.js";
import { ResponsiveStory } from "../middleware/helper.js";
import { Img } from "./Img.js";

var DataSearchDefault = function (_Component) {
	_inherits(DataSearchDefault, _Component);

	function DataSearchDefault(props) {
		_classCallCheck(this, DataSearchDefault);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.DEFAULT_IMAGE = "http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg";
		return _this;
	}

	DataSearchDefault.prototype.componentDidMount = function componentDidMount() {
		ResponsiveStory();
	};

	DataSearchDefault.prototype.onData = function onData(markerData) {
		var marker = markerData._source;
		return React.createElement(
			"a",
			{
				className: "full_row single-record single_record_for_clone",
				href: marker.event ? marker.event.event_url : "",
				target: "_blank",
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
						marker.group.group_topics.map(function (tag, i) {
							return React.createElement(
								"li",
								{ key: i },
								tag.topic_name
							);
						})
					)
				)
			)
		);
	};

	DataSearchDefault.prototype.render = function render() {
		return React.createElement(
			ReactiveBase,
			{
				app: "reactivemap_demo",
				credentials: "kvHgC64RP:e96d86fb-a1bc-465e-8756-02661ffebc05",
				type: "meetupdata1"
			},
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col s6 col-xs-6" },
					React.createElement(DataSearch, _extends({
						appbaseField: [this.props.mapping.venue, this.props.mapping.topic],
						componentId: "VenueSensor",
						title: "DataSearch",
						searchInputId: "CityVenue"
					}, this.props))
				),
				React.createElement(
					"div",
					{ className: "col s6 col-xs-6" },
					React.createElement(ReactiveList, {
						componentId: "SearchResult",
						appbaseField: this.props.mapping.topic,
						title: "Results",
						sortBy: "asc",
						from: 0,
						size: 20,
						stream: true,
						onData: this.onData,
						react: {
							and: "VenueSensor"
						}
					})
				)
			)
		);
	};

	return DataSearchDefault;
}(Component);

export default DataSearchDefault;


DataSearchDefault.defaultProps = {
	mapping: {
		topic: "group.group_topics.topic_name_raw",
		venue: "venue_name_ngrams"
	}
};