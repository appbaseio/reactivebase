import React from "react";
import PropTypes from "prop-types";
import NativeList from "./NativeList";
import * as TYPES from "../middleware/constants.js";

export default function SingleList(props) {
	return (
		<NativeList
			{...props}
			component="SingleList"
			multipleSelect={false}
		/>
	);
}

SingleList.propTypes = {
	componentId: PropTypes.string.isRequired,
	dataField: PropTypes.string.isRequired,
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	defaultSelected: PropTypes.string,
	size: PropTypes.number,
	showCount: PropTypes.bool,
	sortBy: PropTypes.string,
	showSearch: PropTypes.bool,
	placeholder: PropTypes.string,
	customQuery: PropTypes.func,
	initialLoader: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	react: PropTypes.object,
	style: PropTypes.object,
	showRadio: PropTypes.bool,
	onQueryChange: PropTypes.func,
	URLParams: PropTypes.bool,
	showFilter: PropTypes.bool,
	className: PropTypes.string
};

// Default props value
SingleList.defaultProps = {
	showCount: true,
	sort: "count",
	size: 100,
	showSearch: false,
	title: null,
	placeholder: "Search",
	style: {},
	showRadio: true,
	URLParams: false
};

// context type
SingleList.contextTypes = {
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired
};

SingleList.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.KEYWORD,
	react: TYPES.OBJECT,
	title: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	showCount: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showRadio: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	showFilter: TYPES.BOOLEAN,
	className: TYPES.STRING
};
