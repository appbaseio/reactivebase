import React from "react";
import DataList from "./DataList";
import * as TYPES from "../middleware/constants.js";

export default function SingleDataList(props) {
	return (
		<DataList
			{...props}
			component="SingleDataList"
			multipleSelect={false}
		/>
	);
}

SingleDataList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.string.isRequired,
	data: React.PropTypes.array.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	style: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	showRadio: React.PropTypes.bool,
	onQueryChange: React.PropTypes.func,
	selectAllLabel: React.PropTypes.string,
	className: React.PropTypes.string
};

// Default props value
SingleDataList.defaultProps = {
	title: null,
	style: {},
	URLParams: false,
	showSearch: false,
	placeholder: "Search",
	showRadio: true
};

// context type
SingleDataList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

SingleDataList.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	data: TYPES.ARRAY,
	dataFieldType: TYPES.STRING,
	title: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	placeholder: TYPES.STRING,
	showRadio: TYPES.BOOLEAN,
	onQueryChange: TYPES.FUNCTION,
	selectAllLabel: TYPES.STRING,
	className: TYPES.STRING
};
