import { default as React, Component } from 'react';
import { render } from 'react-dom';
import {NativeList} from './NativeList';

export class SingleList extends Component {
	constructor(props, context) {
		super(props);
	}
	render() {
		return (
			<NativeList 
				{...this.props}
				multipleSelect={false}
			/>
		);
	}

}
SingleList.propTypes = {
	sensorId: React.PropTypes.string.isRequired,
	appbaseField : React.PropTypes.string.isRequired,
	title : React.PropTypes.string,
	defaultSelected: React.PropTypes.string,
	size: React.PropTypes.number,
	showCount: React.PropTypes.bool,
	sortBy: React.PropTypes.string,
	showSearch: React.PropTypes.bool,
	searchPlaceholder: React.PropTypes.string
};
// Default props value
SingleList.defaultProps = {
	showCount: true,
	sort: 'count',
	size: 100,
	showSearch: false,
	title: null,
	searchPlaceholder: 'Search',
	defaultStyle: {
		height: '500px',
		overflow: 'auto'
	}
};

// context type
SingleList.contextTypes = {
	appbaseConfig: React.PropTypes.any.isRequired
};