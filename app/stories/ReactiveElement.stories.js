import React, { Component } from 'react';
import { ReactiveBase, MultiList, ReactiveElement } from '../app.js';
import { ResponsiveStory, combineStreamData } from '../middleware/helper.js';
import { Img } from './Img.js';

require('./list.css');

export default class ReactiveElementDefault extends Component {
	constructor(props) {
		super(props);
		this.cityQuery = this.cityQuery.bind(this);
		this.onData = this.onData.bind(this);
		this.DEFAULT_IMAGE = 'http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg';
	}

	cityQuery(value) {
		if(value) {
			let field = 'group.group_city.group_city_simple';
			let query = JSON.parse(`{"${field}":` + JSON.stringify(value) + '}');
			return { terms: query };
		} else return null;
	}

	componentDidMount() {
		ResponsiveStory();
	}

	onData(response) {
		let res = response.res;
		let result = null;
		if(res) {
			let combineData = res.currentData;
			if(res.mode === 'historic') {
				combineData = res.currentData.concat(res.newData);
			}
			else if(res.mode === 'streaming') {
				combineData = combineStreamData(res.currentData, res.newData);
			}
			if (combineData) {
				result = (
					<div>
						<pre className="col-xs-12 pull-left">
							{JSON.stringify(res, null, 4)}
						</pre>
					</div>
				)
			}
		}
		return result;
	}

	render() {
		return (
			<ReactiveBase
				app="meetup2"
				username="qz4ZD8xq1"
				password="a0edfc7f-5611-46f6-8fe1-d4db234631f3"
				type="meetup"
			>
				<div className="row reverse-labels">
					<div className="col s6 col-xs-6">
						<ReactiveElement
							componentId="SearchResult"
							from={0}
							size={20}
							onData={this.onData}
							{...this.props}
							react={{
								"and": "CitySensor"
							}}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<MultiList
							componentId="CitySensor"
							appbaseField={this.props.mapping.city}
							showCount={true}
							size={10}
							title="Input Filter"
							customQuery={this.cityQuery}
							searchPlaceholder="Search City"
							includeSelectAll={true}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

ReactiveElementDefault.defaultProps = {
	mapping: {
		city: 'group.group_city.group_city_simple',
		topic: 'group.group_topics.topic_name.topic_name_simple'
	}
};