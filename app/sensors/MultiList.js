import React from "react";
import PropTypes from "prop-types";
import NativeList from "./NativeList";
import * as TYPES from "../middleware/constants.js";

export default function MultiList(props) {
	return (
		<NativeList
			{...props}
			component="MultiList"
			multipleSelect
		/>
	);
}

MultiList.propTypes = {
	componentId: PropTypes.string.isRequired,
	dataField: PropTypes.string.isRequired,
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	defaultSelected: PropTypes.array,
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
	showCheckbox: PropTypes.bool,
	URLParams: PropTypes.bool,
	showFilter: PropTypes.bool,
	onQueryChange: PropTypes.func,
	queryFormat: PropTypes.oneOf(["and", "or"]),
	className: PropTypes.string
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
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired
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
