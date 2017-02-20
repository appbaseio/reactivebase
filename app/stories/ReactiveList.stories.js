import React, { Component } from 'react';
import { ReactiveBase, MultiList, ReactiveList } from '../app.js';
import { ResponsiveStory, combineStreamData } from '../middleware/helper.js';
import { Img } from './Img.js';

require('./list.css');

export default class ReactiveListDefault extends Component {
	constructor(props) {
		super(props);
		this.cityQuery = this.cityQuery.bind(this);
		this.onData = this.onData.bind(this);
		this.DEFAULT_IMAGE = 'http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg';
	}

	cityQuery(value) {
		if (value) {
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
			<a className={"full_row single-record single_record_for_clone "+(markerData.stream ? 'animate' : '')}
				href={marker.event ? marker.event.event_url : ''}
				target="_blank"
				key={markerData._id}>
				<div className="img-container">
					<Img key={markerData._id} src={marker.member ? marker.member.photo : this.DEFAULT_IMAGE} />
				</div>
				<div className="text-container full_row">
					<div className="text-head text-overflow full_row">
						<span className="text-head-info text-overflow">
							{marker.member ? marker.member.member_name : ''} is going to {marker.event ? marker.event.event_name : ''}
						</span>
						<span className="text-head-city">{marker.group ? marker.group.group_city : ''}</span>
					</div>
					<div className="text-description text-overflow full_row">
						<ul className="highlight_tags">
							{
								marker.group.group_topics.map(function(tag,i) {
									return (<li key={i}>{tag.topic_name}</li>)
								})
							}
						</ul>
					</div>
				</div>
			</a>
		);
	}

	render() {
		let placeholder = (<h6>Select city to see the results.</h6>);
		return (
			<ReactiveBase
				app="meetup2"
				username="qz4ZD8xq1"
				password="a0edfc7f-5611-46f6-8fe1-d4db234631f3"
				type="meetup"
			>
				<div className="row reverse-labels">
					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							appbaseField={this.props.mapping.topic}
							title="ReactiveList"
							sortBy="asc"
							from={0}
							size={20}
							onData={this.onData}
							{...this.props}
							placeholder={placeholder}
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

ReactiveListDefault.defaultProps = {
	mapping: {
		city: 'group.group_city.group_city_simple',
		topic: 'group.group_topics.topic_name.topic_name_simple'
	}
};
