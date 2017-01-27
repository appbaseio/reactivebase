import { default as React, Component } from 'react';
import { DropdownList } from './DropdownList';

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
	sensorId: React.PropTypes.string.isRequired,
	appbaseField : React.PropTypes.string.isRequired,
	title : React.PropTypes.string,
	size: React.PropTypes.number,
	sortBy: React.PropTypes.string
};

// Default props value
SingleDropdownList.defaultProps = {
	sortBy: 'count',
	size: 100,
	title: null
};

// context type
SingleDropdownList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
