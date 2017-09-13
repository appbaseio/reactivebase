var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import NativeList from "./NativeList";
import * as TYPES from "../middleware/constants.js";

export default function MultiList(props) {
	return React.createElement(NativeList, _extends({}, props, {
		component: "MultiList",
		multipleSelect: true
	}));
}

MultiList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	defaultSelected: React.PropTypes.array,
	size: React.PropTypes.number,
	showCount: React.PropTypes.bool,
	sortBy: React.PropTypes.string,
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	initialLoader: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	react: React.PropTypes.object,
	style: React.PropTypes.object,
	showCheckbox: React.PropTypes.bool,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	onQueryChange: React.PropTypes.func,
	queryFormat: React.PropTypes.oneOf(["and", "or"]),
	className: React.PropTypes.string
};

// Default props value
MultiList.defaultProps = {
	showCount: true,
	sort: "count",
	size: 100,
	showSearch: false,
	title: null,
	placeholder: "Search",
	showCheckbox: true,
	URLParams: false
};

// context type
MultiList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

MultiList.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.KEYWORD,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	showCount: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showCheckbox: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	queryFormat: TYPES.STRING,
	className: TYPES.STRING
};