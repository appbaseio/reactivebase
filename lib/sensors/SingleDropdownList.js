var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import DropdownList from "./DropdownList";
import * as TYPES from "../middleware/constants";

export default function SingleDropdownList(props) {
	return React.createElement(DropdownList, _extends({}, props, {
		multipleSelect: false
	}));
}

SingleDropdownList.propTypes = {
	defaultSelected: React.PropTypes.string,
	componentStyle: React.PropTypes.object
};

SingleDropdownList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.KEYWORD,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	showCount: TYPES.STRING,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	placeholder: TYPES.STRING,
	selectAllLabel: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT,
	componentStyle: TYPES.OBJECT
};