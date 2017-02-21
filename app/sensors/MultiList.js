import { default as React, Component } from 'react';
import { NativeList } from './NativeList';
import * as TYPES from '../middleware/constants.js';

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
	componentId: React.PropTypes.string.isRequired,
	appbaseField : React.PropTypes.string.isRequired,
	title : React.PropTypes.string,
	defaultSelected: React.PropTypes.array,
	size: React.PropTypes.number,
	showCount: React.PropTypes.bool,
	sortBy: React.PropTypes.string,
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
	initialLoader: React.PropTypes.shape({
		show: React.PropTypes.bool,
		text: React.PropTypes.string
	})
};

// Default props value
MultiList.defaultProps = {
	showCount: true,
	sort: 'count',
	size: 100,
	showSearch: false,
	title: null,
	placeholder: 'Search',
	initialLoader: {
		show: true
	}
};

// context type
MultiList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

MultiList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	defaultSelected: TYPES.ARRAY,
	size: TYPES.NUMBER,
	sortBy: TYPES.STRING,
	showCount: TYPES.BOOLEAN,
	showSearch: TYPES.BOOLEAN,
	placeholder: TYPES.STRING,
	initialLoader: TYPES.OBJECT
};
