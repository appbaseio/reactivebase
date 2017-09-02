var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { ReactiveBase, TextField, ReactiveList, SelectedFilters } from "../app.js";
import ResponsiveStory from "./ReactiveElement/ResponsiveStory";

var TextFieldDefault = function (_Component) {
	_inherits(TextFieldDefault, _Component);

	function TextFieldDefault(props) {
		_classCallCheck(this, TextFieldDefault);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.nameQuery = _this.nameQuery.bind(_this);
		return _this;
	}

	TextFieldDefault.prototype.componentDidMount = function componentDidMount() {
		ResponsiveStory();
	};

	TextFieldDefault.prototype.nameQuery = function nameQuery(value) {
		if (value) {
			return {
				match: {
					"cars.name": value
				}
			};
		}return null;
	};

	TextFieldDefault.prototype.onData = function onData(markerData) {
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
	};

	TextFieldDefault.prototype.render = function render() {
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
					React.createElement(SelectedFilters, { componentId: "SelectedFilters" }),
					React.createElement(TextField, _extends({
						componentId: "NameTextSensor",
						dataField: this.props.mapping.name,
						title: "TextField",
						customQuery: this.NameQuery
					}, this.props))
				),
				React.createElement(
					"div",
					{ className: "col s6 col-xs-6" },
					React.createElement(ReactiveList, {
						componentId: "SearchResult",
						dataField: this.props.mapping.name,
						title: "Cars",
						from: 0,
						size: 20,
						onData: this.onData,
						react: {
							and: "NameTextSensor"
						}
					})
				)
			)
		);
	};

	return TextFieldDefault;
}(Component);

export default TextFieldDefault;


TextFieldDefault.defaultProps = {
	mapping: {
		name: "name"
	}
};