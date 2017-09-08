import React from "react";
import DropdownList from "./DropdownList";
import * as TYPES from "../middleware/constants";

export default function SingleDropdownList(props) {
	return (
		<DropdownList
			{...props}
			component="SingleDropdownList"
			multipleSelect={false}
		/>
	);
}

SingleDropdownList.propTypes = {
	defaultSelected: React.PropTypes.string,
	style: React.PropTypes.object,
	onQueryChange: React.PropTypes.func,
	showFilter: React.PropTypes.bool
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
	showFilter: TYPES.BOOLEAN
};
