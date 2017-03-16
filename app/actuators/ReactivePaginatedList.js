import React, { Component } from 'react';
import ReactiveList from './ReactiveList';
import Pagination from '../addons/Pagination';
import * as TYPES from '../middleware/constants.js';

var helper = require('../middleware/helper.js');

export default class ReactivePaginatedList extends Component {
	constructor(props, context) {
		super(props);
	}

	componentWillMount() {
		this.paginationAtVal = this.props.paginationAt;
		this.setQueryInfo();
		this.setReact();
		this.executePaginationUpdate();
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (this.paginationAtVal !== this.props.paginationAt) {
				this.paginationAtVal = this.props.paginationAt;
				this.executePaginationUpdate();
			}
		}, 300);
	}

	customQuery() {
		return null;
	}
	// set the query type and input data
	setQueryInfo() {
		const valObj = {
			queryType: 'match',
			inputData: this.props.appbaseField,
			customQuery: this.customQuery
		};
		const obj = {
			key: 'paginationChanges',
			value: valObj
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	setReact() {
		this.react = this.props.react ? this.props.react : {};
		this.react.pagination = {};
		if (this.react && this.react.and && typeof this.react.and === "string") {
			this.react.and = [this.react.and];
		}
		this.react.and.push("paginationChanges");
	}

	executePaginationUpdate() {
		setTimeout(() => {
			const obj = {
				key: "paginationChanges",
				value: Math.random()
			};
			helper.selectedSensor.set(obj, true);
		}, 100);
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
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	paginationAt: React.PropTypes.string,
	sortBy: React.PropTypes.oneOf(['asc', 'desc', 'default']),
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
	stream: React.PropTypes.bool,
	initialLoader: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
		React.PropTypes.element
	]),
	noResults: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
		React.PropTypes.element
	]),
	showResultStats: React.PropTypes.bool,
	onResultStats: React.PropTypes.func,
	placeholder: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
		React.PropTypes.element
	])
};

// Default props value
ReactivePaginatedList.defaultProps = {
	from: 0,
	size: 20,
	paginationAt: 'bottom',
	showResultStats: true
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
	initialLoader: TYPES.STRING,
	noResults: TYPES.STRING,
	showResultStats: TYPES.BOOLEAN,
	onResultStats: TYPES.FUNCTION,
	placeholder: TYPES.STRING
};
