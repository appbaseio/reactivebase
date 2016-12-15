import React, { Component } from 'react';
import { Sensor, DataSearch } from '../app.js';

export default class DataSearchDefault extends Component {
	constructor(props) {
		super(props);

		this.toggleData = [{
			"label": "Social",
			"value": "Social"
		}, {
			"label": "New In Town",
			"value": "New In Town"
		}, {
			"label": "Travel",
			"value": "Travel"
		}, {
			"label": "Outdoors",
			"value": "Outdoors"
		}];
	}
	render() {
		return (
			<Sensor
				appname="meetup_demo"
				username="LPpISlEBe"
				password="2a8935f5-0f63-4084-bc3e-2b2b4d1a8e02"
			>
				<div className="col-xs-6">
					<DataSearch
						appbaseField={this.props.mapping.venue}
						sensorId="VenueSensor"
						searchInputId="CityVenue"
						placeholder="Search Venue"
					/>
				</div>
			</Sensor>
		);
	}
}

DataSearchDefault.defaultProps = {
	title: 'Price',
	mapping: {
		venue: 'venue_name_ngrams'
	}
};
