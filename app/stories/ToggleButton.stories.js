import React, { Component } from 'react';
import { Sensor, ToggleButton } from '../app.js';

export default class ToggleButtonDefault extends Component {
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
				<div className="col-xs-12">
					<ToggleButton
						appbaseField={this.props.mapping.topic}
						sensorId="GuestSensor"
						title="Guests"
						data={this.toggleData}
						{...this.props}
					/>
				</div>
			</Sensor>
		);
	}
}

ToggleButtonDefault.defaultProps = {
	title: 'Price',
	mapping: {
		topic: 'group.group_topics.topic_name_raw.raw'
	}
};
