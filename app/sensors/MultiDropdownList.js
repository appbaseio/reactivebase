import React from "react";
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
	defaultSelected: React.PropTypes.array,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	queryFormat: React.PropTypes.oneOf(["and", "or"])
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
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	queryFormat: TYPES.STRING
};
