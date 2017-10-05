var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import PropTypes from "prop-types";
import DataList from "./DataList";
import * as TYPES from "../middleware/constants.js";

export default function SingleDataList(props) {
	return React.createElement(DataList, _extends({}, props, {
		component: "SingleDataList",
		multipleSelect: false
	}));
}

SingleDataList.propTypes = {
	componentId: PropTypes.string.isRequired,
	dataField: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	showSearch: PropTypes.bool,
	placeholder: PropTypes.string,
	defaultSelected: PropTypes.string,
	customQuery: PropTypes.func,
	style: PropTypes.object,
	URLParams: PropTypes.bool,
	showFilter: PropTypes.bool,
	showRadio: PropTypes.bool,
	onQueryChange: PropTypes.func,
	selectAllLabel: PropTypes.string,
	className: PropTypes.string
};

// Default props value
SingleDataList.defaultProps = {
	title: null,
	style: {},
	URLParams: false,
	showSearch: false,
	placeholder: "Search",
	showRadio: true
};

// context type
SingleDataList.contextTypes = {
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired
};

SingleDataList.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	data: TYPES.ARRAY,
	dataFieldType: TYPES.STRING,
	title: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	placeholder: TYPES.STRING,
	showRadio: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	selectAllLabel: TYPES.STRING,
	className: TYPES.STRING
};