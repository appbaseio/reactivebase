import React, { Component } from 'react';
import { AppbaseReactiveMap, MultiRange } from '../app.js';

export default class MultiRangeDefault extends Component {
	render() {
		return (
			<AppbaseReactiveMap config={this.props.config}>
				<div className="col-xs-6">
					<MultiRange
						sensorId="PriceSensor"
						appbaseField={this.props.mapping.price}
						data={
							[{"start": 0, "end": 10, "label": "Cheap"},
							{"start": 11, "end": 20, "label": "Moderate"},
							{"start": 21, "end": 50, "label": "Pricey"},
							{"start": 51, "end": 1000, "label": "First Date"}]
						}
						{...this.props}
					/>
				</div>
			</AppbaseReactiveMap>
		);
	}
}

MultiRangeDefault.defaultProps = {
	title: 'Price',
	mapping: {
		price: 'price'
	},
	config: {
		"appbase": {
			"appname": "car-store",
			"username": "cf7QByt5e",
			"password": "d2d60548-82a9-43cc-8b40-93cbbe75c34c",
			"type": "cars"
		}
	}
};
