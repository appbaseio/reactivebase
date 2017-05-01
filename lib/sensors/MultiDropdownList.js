var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import DropdownList from "./DropdownList";
import * as TYPES from "../middleware/constants";

export default function MultiDropdownList(props) {
	return React.createElement(DropdownList, _extends({}, props, {
		multipleSelect: true
	}));
}

MultiDropdownList.propTypes = {
	defaultSelected: React.PropTypes.array,
	componentStyle: React.PropTypes.object
};

MultiDropdownList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.KEYWORD,
	defaultSelected: TYPES.ARRAY,
	react: TYPES.OBJECT,
	title: TYPES.STRING,
	size: TYPES.NUMBER,
	showCount: TYPES.BOOLEAN,
	sortBy: TYPES.STRING,
	placeholder: TYPES.STRING,
	selectAllLabel: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT,
	componentStyle: TYPES.OBJECT
};