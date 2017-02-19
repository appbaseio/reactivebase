import { default as React, Component } from 'react';
import { DropdownList } from './DropdownList';
import * as TYPE from '../middleware/constants.js';

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
	componentId: TYPE.STRING,
	appbaseField: TYPE.STRING,
	defaultSelected: TYPE.ARRAY,
	title: TYPE.STRING,
	size: TYPE.NUMBER,
	showCount: TYPE.BOOLEAN,
	sortBy: TYPE.STRING,
	placeholder: TYPE.STRING,
	selectAllLabel: TYPE.STRING
};
