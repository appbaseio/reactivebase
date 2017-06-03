import React from "react";
import NativeList from "./NativeList";
import * as TYPES from "../middleware/constants.js";

export default function MultiList(props) {
	return (
		<NativeList
			{...props}
			multipleSelect
		/>
	);
}

MultiList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	defaultSelected: React.PropTypes.array,
	size: React.PropTypes.number,
	showCount: React.PropTypes.bool,
	sortBy: React.PropTypes.string,
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	react: React.PropTypes.object,
	componentStyle: React.PropTypes.object,
	showCheckbox: React.PropTypes.bool,
	URLParams: React.PropTypes.bool,
	allowFilter: React.PropTypes.bool,
	showTags: React.PropTypes.bool
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
	URLParams: false,
	showTags: true
};

// context type
MultiList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

MultiList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.KEYWORD,
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
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showCheckbox: TYPES.BOOLEAN,
	allowFilter: TYPES.BOOLEAN,
	showTags: TYPES.BOOLEAN
};
