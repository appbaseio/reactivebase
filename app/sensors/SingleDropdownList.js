import React from "react";
import DropdownList from "./DropdownList";
import * as TYPES from "../middleware/constants";

export default function SingleDropdownList(props) {
	return (
		<DropdownList
			{...props}
			multipleSelect={false}
		/>
	);
}

SingleDropdownList.propTypes = {
	defaultSelected: React.PropTypes.string
};

SingleDropdownList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	showCount: TYPES.STRING,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	placeholder: TYPES.STRING,
	selectAllLabel: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT
};
