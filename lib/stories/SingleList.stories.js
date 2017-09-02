var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { ReactiveBase, SingleList, ReactiveList, SelectedFilters } from "../app.js";
import ResponsiveStory from "./ReactiveElement/ResponsiveStory";
import { Img } from "./Img.js";

var SingleListDefault = function (_Component) {
	_inherits(SingleListDefault, _Component);

	function SingleListDefault(props) {
		_classCallCheck(this, SingleListDefault);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.DEFAULT_IMAGE = "http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg";
		return _this;
	}

	SingleListDefault.prototype.componentDidMount = function componentDidMount() {
		ResponsiveStory();
	};

	SingleListDefault.prototype.onData = function onData(markerData) {
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

	SingleListDefault.prototype.render = function render() {
		var _React$createElement;

		return React.createElement(
			ReactiveBase,
			{
				app: "meetup_demo",
				credentials: "LPpISlEBe:2a8935f5-0f63-4084-bc3e-2b2b4d1a8e02",
				type: "meetupdata1"
			},
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col s6 col-xs-6" },
					React.createElement(SelectedFilters, { componentId: "SelectedFilters" }),
					React.createElement(SingleList, _extends({
						componentId: "CitySensor",
						dataField: this.props.mapping.city,
						title: "SingleList",
						size: 100,
						customQuery: this.customQuery
					}, this.props))
				),
				React.createElement(
					"div",
					{ className: "col s6 col-xs-6" },
					React.createElement(ReactiveList, (_React$createElement = {
						componentId: "SearchResult",
						dataField: this.props.mapping.topic,
						title: "Results",
						sortBy: "asc",
						from: 0,
						size: 20
					}, _React$createElement["size"] = 2, _React$createElement.onData = this.onData, _React$createElement.react = {
						and: ["CitySensor"]
					}, _React$createElement))
				)
			)
		);
	};

	return SingleListDefault;
}(Component);

export default SingleListDefault;


SingleListDefault.defaultProps = {
	mapping: {
		city: "group.group_city.raw",
		topic: "group.group_topics.topic_name_raw"
	}
};