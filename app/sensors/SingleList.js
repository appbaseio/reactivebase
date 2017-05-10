import React from "react";
import NativeList from "./NativeList";
import * as TYPES from "../middleware/constants.js";

export default function SingleList(props) {
	return (
		<NativeList
			{...props}
			multipleSelect={false}
		/>
	);
}

SingleList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	defaultSelected: React.PropTypes.string,
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
	showRadio: React.PropTypes.bool,
	URLParams: React.PropTypes.bool
};

// Default props value
SingleList.defaultProps = {
	showCount: true,
	sort: "count",
	size: 100,
	showSearch: false,
	title: null,
	placeholder: "Search",
	componentStyle: {},
	showRadio: true,
	URLParams: false
};

// context type
SingleList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

SingleList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.KEYWORD,
	react: TYPES.OBJECT,
	title: TYPES.STRING,
	defaultSelected: TYPES.STRING,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	showCount: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	placeholder: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	initialLoader: TYPES.OBJECT,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showRadio: TYPES.BOOLEAN
};
