import { default as React, Component } from 'react';
import { DropdownList } from './DropdownList';
import * as TYPES from '../middleware/constants.js';

export class MultiDropdownList extends Component {
	constructor(props, context) {
		super(props);
	}

	render() {
		return (
			<DropdownList
				{...this.props}
				multipleSelect={true}
			/>
		);
	}
}

MultiDropdownList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField : React.PropTypes.string.isRequired,
	title : React.PropTypes.string,
	defaultSelected: React.PropTypes.array,
	showCount: React.PropTypes.bool,
	size: React.PropTypes.number,
	sortBy: React.PropTypes.oneOf(['asc', 'desc', 'count']),
	placeholder: React.PropTypes.string,
	selectAllLabel: React.PropTypes.string
};

// Default props value
MultiDropdownList.defaultProps = {
	showCount: true,
	sortBy: 'count',
	size: 100,
	title: null
};

// context type
MultiDropdownList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

MultiDropdownList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	defaultSelected: TYPES.ARRAY,
	title: TYPES.STRING,
	size: TYPES.NUMBER,
	showCount: TYPES.BOOLEAN,
	sortBy: TYPES.STRING,
	placeholder: TYPES.STRING,
	selectAllLabel: TYPES.STRING
};
