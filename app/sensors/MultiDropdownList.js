import React from "react";
import DropdownList from "./DropdownList";
import * as TYPES from "../middleware/constants";

export default function MultiDropdownList(props) {
	return (
		<DropdownList
			{...props}
			multipleSelect
		/>
	);
}

MultiDropdownList.propTypes = {
	defaultSelected: React.PropTypes.array,
	componentStyle: React.PropTypes.object,
	URLParam: React.PropTypes.bool
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
	componentStyle: TYPES.OBJECT,
	URLParam: TYPES.BOOLEAN
};
