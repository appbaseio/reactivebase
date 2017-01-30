import { default as React, Component } from 'react';
import { NativeList } from './NativeList';

export class MultiList extends Component {
	constructor(props, context) {
		super(props);
	}

	render() {
		return (
			<NativeList
				{...this.props}
				multipleSelect={true}
			/>
		);
	}
}

MultiList.propTypes = {
	sensorId: React.PropTypes.string.isRequired,
	appbaseField : React.PropTypes.string.isRequired,
	title : React.PropTypes.string,
	defaultSelected: React.PropTypes.array,
	size: React.PropTypes.number,
	showCount: React.PropTypes.bool,
	sortBy: React.PropTypes.string,
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string
};

// Default props value
MultiList.defaultProps = {
	showCount: true,
	sort: 'count',
	size: 100,
	showSearch: false,
	title: null,
	placeholder: 'Search'
};

// context type
MultiList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
