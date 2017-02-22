import React, { Component } from 'react';
import { ReactiveBase, DataController, ReactiveList } from '../app.js';
import { ResponsiveStory, combineStreamData } from '../middleware/helper.js';
require('./list.css');

export default class DataControllerDefault extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
		this.CustomQuery = this.CustomQuery.bind(this);
	}

	componentDidMount() {
		ResponsiveStory();
	}

	CustomQuery(value) {
		return {
			query: {
				match_all: {}
			}
		};
	}

	onData(err, res) {
		let result = null;
		if (res) {
			let combineData = res.currentData;
			if (res.mode === 'historic') {
				combineData = res.currentData.concat(res.newData);
			} else if (res.mode === 'streaming') {
				combineData = combineStreamData(res.currentData, res.newData);
			}
			if (combineData) {
				result = combineData.map((markerData, index) => {
					let marker = markerData._source;
					return this.itemMarkup(marker, markerData);
				});
			}
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
				app="car-store"
				username="cf7QByt5e"
				password="d2d60548-82a9-43cc-8b40-93cbbe75c34c"
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<DataController
							componentId="CustomSensor"
							appbaseField={this.props.mapping.name}
							customQuery= {this.CustomQuery}
							{...this.props}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							appbaseField={this.props.mapping.name}
							title="Cars"
							from={0}
							size={20}
							onData={this.onData}
							react={{
								"and": "CustomSensor"
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

DataControllerDefault.defaultProps = {
	mapping: {
		name: 'name'
	}
};
