var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import DataList from "./DataList";
import * as TYPES from "../middleware/constants.js";

export default function SingleDataList(props) {
	return React.createElement(DataList, _extends({}, props, {
		component: "SingleDataList",
		multipleSelect: false
	}));
}

SingleDataList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
	data: React.PropTypes.array,
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	showRadio: React.PropTypes.bool,
	selectAllLabel: React.PropTypes.string
};

// Default props value
SingleDataList.defaultProps = {
	title: null,
	componentStyle: {},
	URLParams: false,
	showSearch: false,
	placeholder: "Search",
	showRadio: true
};

// context type
SingleDataList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

SingleDataList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.STRING,
	title: TYPES.STRING,
	data: TYPES.ARRAY,
	defaultSelected: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	placeholder: TYPES.STRING,
	showRadio: TYPES.BOOLEAN,
	selectAllLabel: TYPES.STRING
};