import React, { Component } from 'react';
import { AppbaseReactiveMap, DataSearch } from '../app.js';

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
			<AppbaseReactiveMap config={this.props.config}>
				<div className="col-xs-6">
					<DataSearch
						appbaseField={this.props.mapping.venue}
						sensorId="VenueSensor"
						searchInputId="CityVenue"
						placeholder="Search Venue"
					/>
				</div>
			</AppbaseReactiveMap>
		);
	}
}

DataSearchDefault.defaultProps = {
	title: 'Price',
	mapping: {
		venue: 'venue_name_ngrams'
	},
	config: {
		"appbase": {
			"appname": "reactivemap_demo",
			"username": "y4pVxY2Ok",
			"password": "c92481e2-c07f-4473-8326-082919282c18",
			"type": "meetupdata1"
		}
	}
};
