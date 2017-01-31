import { default as React, Component } from 'react';
import { ResultList } from './ResultList';
import { Pagination } from './component/Pagination';
var helper = require('../middleware/helper.js');

export class PaginatedResultList extends Component {
	constructor(props, context) {
		super(props);
		this.colStyle = {
			padding: 0
		};
	}

	componentWillMount() {
		this.depends = this.props.depends ? this.props.depends : {};
		this.depends['pagination'] = {};
	}

	paginationAt(method) {
		let pageinationComp;

		if(this.props.paginationAt === method || this.props.paginationAt === 'both') {
			pageinationComp = (
				<div className="col s12 col-xs-12" style={this.colStyle}>
					<Pagination
						className={`rbc-pagination-${method}`}
						sensorId="pagination"
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
				<div className="col s12 col-xs-12" style={this.colStyle}>
					<ResultList
						{...this.props}
						requestOnScroll={false}
						depends={this.depends}
					/>
				</div>
				{this.paginationAt('bottom')}
			</div>
		);
	}
}

PaginatedResultList.propTypes = {
	sensorId: React.PropTypes.string,
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
	size: helper.sizeValidation,
	stream: React.PropTypes.bool
};

// Default props value
PaginatedResultList.defaultProps = {
	from: 0,
	size: 20,
	paginationAt: 'bottom'
};

// context type
PaginatedResultList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
