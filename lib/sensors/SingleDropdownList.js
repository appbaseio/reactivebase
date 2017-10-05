var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import PropTypes from "prop-types";
import DropdownList from "./DropdownList";
import * as TYPES from "../middleware/constants";

export default function SingleDropdownList(props) {
	return React.createElement(DropdownList, _extends({}, props, {
		component: "SingleDropdownList",
		multipleSelect: false
	}));
}

SingleDropdownList.propTypes = {
	defaultSelected: PropTypes.string,
	style: PropTypes.object,
	onQueryChange: PropTypes.func,
	showFilter: PropTypes.bool,
	className: PropTypes.string
};

SingleDropdownList.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.KEYWORD,
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
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	showFilter: TYPES.BOOLEAN,
	className: TYPES.STRING
};