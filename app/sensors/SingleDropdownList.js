import React, { Component } from 'react';
import DropdownList from './DropdownList';
import * as TYPES from '../middleware/constants.js';

export default class SingleDropdownList extends Component {
	constructor(props, context) {
		super(props);
	}

	render() {
		return (
			<DropdownList
				{...this.props}
				multipleSelect={false}
			/>
		);
	}
}

SingleDropdownList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.string,
	defaultSelected: React.PropTypes.string,
	showCount: React.PropTypes.bool,
	size: React.PropTypes.number,
	sortBy: React.PropTypes.oneOf(['asc', 'desc', 'count']),
	placeholder: React.PropTypes.string,
	selectAllLabel: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
		React.PropTypes.element
	]),
	customQuery: React.PropTypes.func,
	react: React.PropTypes.object
};

// Default props value
SingleDropdownList.defaultProps = {
	showCount: true,
	sortBy: 'count',
	size: 100,
	title: null
};

// context type
SingleDropdownList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
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
