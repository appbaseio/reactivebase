import { default as React, Component } from 'react';
import { DropdownList } from './DropdownList';
import * as TYPE from '../middleware/constants.js';

export class SingleDropdownList extends Component {
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
	selectAllLabel: React.PropTypes.string
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
	componentId: TYPE.STRING,
	appbaseField: TYPE.STRING,
	title: TYPE.STRING,
	defaultSelected: TYPE.ARRAY,
	showCount: TYPE.STRING,
	size: TYPE.NUMBER,
	sortBy: TYPE.STRING,
	placeholder: TYPE.STRING,
	selectAllLabel: TYPE.STRING
};
