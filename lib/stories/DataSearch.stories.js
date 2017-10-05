var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { ReactiveBase, DataSearch, ReactiveList, SelectedFilters } from "../app.js";
import ResponsiveStory from "./ReactiveElement/ResponsiveStory";

var DataSearchDefault = function (_Component) {
	_inherits(DataSearchDefault, _Component);

	function DataSearchDefault(props) {
		_classCallCheck(this, DataSearchDefault);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.onData = _this.onData.bind(_this);
		return _this;
	}

	DataSearchDefault.prototype.componentDidMount = function componentDidMount() {
		ResponsiveStory();
	};

	DataSearchDefault.prototype.onData = function onData(data) {
		var res = data._source;
		return React.createElement(
			"div",
			{ className: "row", key: data._id },
			React.createElement(
				"div",
				{ className: "col s6 col-xs-6" },
				React.createElement("img", { className: "responsive-img img-responsive", src: "https://www.enterprise.com/content/dam/global-vehicle-images/cars/FORD_FOCU_2012-1.png" })
			),
			React.createElement(
				"div",
				{ className: "col s6 col-xs-6" },
				React.createElement("div", { dangerouslySetInnerHTML: { __html: res.name } }),
				React.createElement("div", { dangerouslySetInnerHTML: { __html: res.brand } }),
				React.createElement(
					"div",
					{ className: "highlight_tags" },
					res.rating,
					" stars"
				)
			)
		);
	};

	DataSearchDefault.prototype.render = function render() {
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
					React.createElement(SelectedFilters, { componentId: "CarSensor" }),
					React.createElement(DataSearch, _extends({
						dataField: ["name", "brand"],
						componentId: "CarSensor",
						placeholder: "Search Cars"
					}, this.props))
				),
				React.createElement(
					"div",
					{ className: "col s6 col-xs-6" },
					React.createElement(ReactiveList, {
						componentId: "SearchResult",
						dataField: "name",
						title: "Results",
						sortBy: "asc",
						from: 0,
						size: 20,
						stream: true,
						onData: this.onData,
						react: {
							and: "CarSensor"
						}
					})
				)
			)
		);
	};

	return DataSearchDefault;
}(Component);

export default DataSearchDefault;