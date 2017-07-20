import React from "react";
import DataList from "./DataList";
import * as TYPES from "../middleware/constants.js";

export default function MultiDataList(props) {
	return (
		<DataList
			{...props}
			component="MultiDataList"
			multipleSelect
		/>
	);
}

MultiDataList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
	data: React.PropTypes.array,
	defaultSelected: React.PropTypes.array,
	customQuery: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	showCheckbox: React.PropTypes.bool,
	selectAllLabel: React.PropTypes.string
};

// Default props value
MultiDataList.defaultProps = {
	title: null,
	componentStyle: {},
	URLParams: false,
	showSearch: false,
	placeholder: "Search",
	showCheckbox: true
};

// context type
MultiDataList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

MultiDataList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.STRING,
	title: TYPES.STRING,
	data: TYPES.ARRAY,
	defaultSelected: TYPES.ARRAY,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	placeholder: TYPES.STRING,
	showCheckbox: TYPES.BOOLEAN,
	selectAllLabel: TYPES.STRING
};
