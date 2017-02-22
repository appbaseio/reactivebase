import React from "react";
import DropdownList from "./DropdownList";
import * as TYPES from "../middleware/constants.js";

export default function MultiDropdownList(props) {
	return (
		<DropdownList
			{...props}
			multipleSelect
		/>
	);
}

MultiDropdownList.propTypes = {
	defaultSelected: React.PropTypes.array
};

MultiDropdownList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	defaultSelected: TYPES.ARRAY,
	react: TYPES.OBJECT,
	title: TYPES.STRING,
	size: TYPES.NUMBER,
	showCount: TYPES.BOOLEAN,
	sortBy: TYPES.STRING,
	placeholder: TYPES.STRING,
	selectAllLabel: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT
};
