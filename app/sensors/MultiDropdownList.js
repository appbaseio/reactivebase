import { default as React, Component } from 'react';
import { DropdownList } from './DropdownList';

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
	sensorId: React.PropTypes.string.isRequired,
	appbaseField : React.PropTypes.string.isRequired,
	title : React.PropTypes.string,
	size: React.PropTypes.number,
	sortBy: React.PropTypes.string,
	placeholder: React.PropTypes.string
};

// Default props value
MultiDropdownList.defaultProps = {
	sort: 'count',
	size: 100,
	title: null
};

// context type
MultiDropdownList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
