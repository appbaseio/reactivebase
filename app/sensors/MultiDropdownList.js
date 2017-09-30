import React from "react";
import PropTypes from 'prop-types';
import DropdownList from "./DropdownList";
import * as TYPES from "../middleware/constants";

export default function MultiDropdownList(props) {
	return (
		<DropdownList
			{...props}
			component="MultiDropdownList"
			multipleSelect
		/>
	);
}

MultiDropdownList.propTypes = {
	defaultSelected: PropTypes.array,
	style: PropTypes.object,
	URLParams: PropTypes.bool,
	showFilter: PropTypes.bool,
	onQueryChange: PropTypes.func,
	queryFormat: PropTypes.oneOf(["and", "or"]),
	className: PropTypes.string
};

MultiDropdownList.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.KEYWORD,
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
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	queryFormat: TYPES.STRING,
	className: TYPES.STRING
};
