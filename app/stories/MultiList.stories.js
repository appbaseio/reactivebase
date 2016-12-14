import React, { Component } from 'react';
import { AppbaseReactiveMap, MultiList } from '../app.js';

export default class MultiListDefault extends Component {
	render() {
		return (
			<AppbaseReactiveMap config={this.props.config}>
				<div className="col-xs-6">
					<MultiList
						sensorId="CitySensor"
						appbaseField={this.props.mapping.city}
						showCount={true}
						size={1000}
						searchPlaceholder="Search City"
						{...this.props}
					/>
				</div>
			</AppbaseReactiveMap>
		);
	}
}

MultiListDefault.defaultProps = {
	title: 'Cities',
	mapping: {
		city: 'group.group_city.raw'
	},
	config: {
		"appbase": {
			"appname": "meetup_demo",
			"username": "LPpISlEBe",
			"password": "2a8935f5-0f63-4084-bc3e-2b2b4d1a8e02",
			"type": "meetupdata1"
		}
	}
};
