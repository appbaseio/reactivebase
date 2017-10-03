import React from "react";
import PropTypes from 'prop-types';
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
	componentId: PropTypes.string.isRequired,
	dataField: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	showSearch: PropTypes.bool,
	placeholder: PropTypes.string,
	defaultSelected: PropTypes.array,
	customQuery: PropTypes.func,
	style: PropTypes.object,
	URLParams: PropTypes.bool,
	showFilter: PropTypes.bool,
	showCheckbox: PropTypes.bool,
	selectAllLabel: PropTypes.string,
	onQueryChange: PropTypes.func,
	queryFormat: PropTypes.oneOf(["and", "or"]),
	className: PropTypes.string
};

// Default props value
MultiDataList.defaultProps = {
	title: null,
	style: {},
	URLParams: false,
	showSearch: false,
	placeholder: "Search",
	showCheckbox: true,
	queryFormat: "or"
};

// context type
MultiDataList.contextTypes = {
	appbaseRef: PropTypes.any.isRequired,
	type: PropTypes.any.isRequired
};

MultiDataList.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.STRING,
	title: TYPES.STRING,
	data: TYPES.ARRAY,
	defaultSelected: TYPES.ARRAY,
	customQuery: TYPES.FUNCTION,
	onQueryChange: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	placeholder: TYPES.STRING,
	showCheckbox: TYPES.BOOLEAN,
	selectAllLabel: TYPES.STRING,
	className: TYPES.STRING
};
