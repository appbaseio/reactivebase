import React, {Component} from 'react';
import {ReactiveBase, NumberBox, ResultList} from '../app.js';
import {ResponsiveStory} from '../middleware/helper.js';
require('./list.css');

export default class NumberBoxDefault extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
		this.nameQuery = this.nameQuery.bind(this);
	}

	componentDidMount() {
		ResponsiveStory();
	}

	nameQuery(value) {
		if (value) {
			return {
				match: {
					'cars.name': value
				}
			};
		} else
			return null;
		}

	onData(res) {
		let result,
			combineData = res.currentData;
		if (res.mode === 'historic') {
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
			<a className="full_row single-record single_record_for_clone" href="#" key={markerData._id}>
				<div className="text-container full_row" style={{
					'paddingLeft': '10px'
				}}>
					<div className="text-head text-overflow full_row">
						<span className="text-head-info text-overflow">
							{marker.name
								? marker.name
								: ''}
							- {marker.brand
								? marker.brand
								: ''}
						</span>
						<span className="text-head-city">{marker.brand
								? marker.brand
								: ''}</span>
					</div>
					<div className="text-description text-overflow full_row">
						<ul className="highlight_tags">
							{marker.price
								? `Priced at $${marker.price}`
								: 'Free Test Drive'}
						</ul>
					</div>
				</div>
			</a>
		);
	}

	render() {
		return (
			<ReactiveBase appname="car-store" username="cf7QByt5e" password="d2d60548-82a9-43cc-8b40-93cbbe75c34c">
				<div className="row">
					<div className="col s6 col-xs-6">
						<NumberBox sensorId="CarModelSensor" appbaseField={this.props.mapping.name} title="NumberBox" {...this.props}/>
					</div>

					<div className="col-xs-6">
						<ResultList sensorId="SearchResult" appbaseField={this.props.mapping.name} title="Cars" from={0} size={20} onData={this.onData} depends={{
							CarModelSensor: {
								"operation": "must",
								defaultQuery: this.NameQuery
							}
						}}/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

NumberBoxDefault.defaultProps = {
	mapping: {
		name: 'name'
	}
};
