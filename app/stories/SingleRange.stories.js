import React, { Component } from 'react';
import { ReactiveBase, SingleRange, ResultList } from '../app.js';
import { ResponsiveStory } from '../middleware/helper.js';
require('./list.css');

export default class SingleRangeDefault extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
	}

	componentDidMount() {
		ResponsiveStory();
	}

	onData(res) {
		let result, combineData = res.currentData;
		if(res.mode === 'historic') {
			combineData = res.currentData.concat(res.newData);
		}
		if (combineData) {
			result = combineData.map((markerData, index) => {
				let marker = markerData._source;
				return this.itemMarkup(marker, markerData);
			});
		}
		return result;
	}

	itemMarkup(marker, markerData) {
		return (
			<a className="full_row single-record single_record_for_clone"
				href="#"
				key={markerData._id}>
				<div className="text-container full_row" style={{'paddingLeft': '10px'}}>
					<div className="text-head text-overflow full_row">
						<span className="text-head-info text-overflow">
							{marker.name ? marker.name : ''} - {marker.brand ? marker.brand : ''}
						</span>
						<span className="text-head-city">{marker.brand ? marker.brand : ''}</span>
					</div>
					<div className="text-description text-overflow full_row">
						<ul className="highlight_tags">
							{marker.price ? `Priced at $${marker.price}` : 'Free Test Drive'}
						</ul>
					</div>
				</div>
			</a>
		);
	}

	render() {
		return (
			<ReactiveBase
				appname="car-store"
				username="cf7QByt5e"
				password="d2d60548-82a9-43cc-8b40-93cbbe75c34c"
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<SingleRange
							sensorId="PriceSensor"
							appbaseField={this.props.mapping.price}
							data={
								[{"start": 0, "end": 100, "label": "Cheap"},
								{"start": 101, "end": 200, "label": "Moderate"},
								{"start": 201, "end": 500, "label": "Pricey"},
								{"start": 501, "end": 1000, "label": "First Date"}]
							}
							{...this.props}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ResultList
							sensorId="SearchResult"
							appbaseField={this.props.mapping.name}
							title="Cars"
							sortOptions={[
								{
									label: 'Lowest Price First',
									appbaseField: 'price',
									sortBy: 'asc'
								},
								{
									label: 'Highest Price First',
									appbaseField: 'price',
									sortBy: 'desc'
								},
								{
									label: 'Most rated',
									appbaseField: 'rating',
									sortBy: 'desc'
								}
							]}
							from={0}
							size={20}
							onData={this.onData}
							depends={{
								PriceSensor: {"operation": "must"}
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

SingleRangeDefault.defaultProps = {
	title: 'Price',
	mapping: {
		price: 'price',
		name: 'name'
	}
};
