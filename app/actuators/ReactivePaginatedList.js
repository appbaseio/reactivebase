import React, { Component } from 'react';
import { ReactiveList } from './ReactiveList';
import Pagination from '../addons/Pagination';
var helper = require('../middleware/helper.js');
import * as TYPES from '../middleware/constants.js';

export default class ReactivePaginatedList extends Component {
	constructor(props, context) {
		super(props);
	}

	componentWillMount() {
		this.react = this.props.react ? this.props.react : {};
		this.react['pagination'] = {};
	}

	paginationAt(method) {
		let pageinationComp;

		if (this.props.paginationAt === method || this.props.paginationAt === 'both') {
			pageinationComp = (
				<div className="rbc-pagination-container col s12 col-xs-12">
					<Pagination
						className={`rbc-pagination-${method}`}
						componentId="pagination"
						onPageChange={this.props.onPageChange}
						title={this.props.paginationTitle} />
				</div>
			);
		}
		return pageinationComp;
	}

	render() {
		return (
			<div className="row">
				{this.paginationAt('top')}
				<div className="rbc-pagination-container col s12 col-xs-12">
					<ReactiveList
						{...this.props}
						requestOnScroll={false}
						react={this.react}
					/>
				</div>
				{this.paginationAt('bottom')}
			</div>
		);
	}
}

ReactivePaginatedList.propTypes = {
	componentId: React.PropTypes.string,
	appbaseField: React.PropTypes.string,
	title: React.PropTypes.string,
	paginationAt: React.PropTypes.string,
	sortBy: React.PropTypes.oneOf(['asc', 'desc']),
	sortOptions: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			label: React.PropTypes.string,
			field: React.PropTypes.string,
			order: React.PropTypes.string,
		})
	),
	from: helper.validation.resultListFrom,
	onData: React.PropTypes.func,
	onPageChange: React.PropTypes.func,
	size: helper.sizeValidation,
	stream: React.PropTypes.bool
};

// Default props value
ReactivePaginatedList.defaultProps = {
	from: 0,
	size: 20,
	paginationAt: 'bottom'
};

// context type
ReactivePaginatedList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};


ReactivePaginatedList.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	title: TYPES.STRING,
	react: TYPES.OBJECT,
	sortBy: TYPES.STRING,
	sortOptions: TYPES.OBJECT,
	from: TYPES.NUMBER,
	size: TYPES.NUMBER,
	paginationAt: TYPES.STRING,
	onData: TYPES.FUNCTION,
	onPageChange: TYPES.FUNCTION,
	requestOnScroll: TYPES.BOOLEAN,
	stream: TYPES.BOOLEAN,
	componentStyle: TYPES.OBJECT,
	initialLoader: TYPES.OBJECT,
	noResults: TYPES.OBJECT,
	resultStats: TYPES.OBJECT,
	placeholder: TYPES.STRING
};
