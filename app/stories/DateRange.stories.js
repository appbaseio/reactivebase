import React, { Component } from 'react';
var moment = require('moment');
import { ReactiveBase, DateRange, ResultList } from '../app.js';
import { Img } from './Img.js';

require('./list.css');

export default class DateRangeDefault extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
		this.DEFAULT_IMAGE = 'http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg';
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
						<span className="text-head-city">
							{marker.group ? marker.group.group_city : ''} ({moment(marker.mtime).format('MM-DD')})
						</span>
					</div>
					<div className="text-description text-overflow full_row">
						<ul className="highlight_tags">
							{
								marker.group.group_topics.map(function(tag,i){
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
		return (
			<ReactiveBase
				appname="meetup_demo1"
				username="yafYCRWns"
				password="c9c9b34e-185c-42e5-bdfe-b7c32d543f2e"
				type="meetupdata1"
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<DateRange
							sensorId="DateRangeSensor"
							appbaseField={this.props.mapping.date}
							{...this.props}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ResultList
							sensorId="SearchResult"
							appbaseField={this.props.mapping.topic}
							title="Meetups"
							from={0}
							size={20}
							onData={this.onData}
							requestOnScroll={true}
							depends={{
								DateRangeSensor: {"operation": "must"}
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

DateRangeDefault.defaultProps = {
	title: 'DateRange',
	mapping: {
		date: 'mtime'
	}
};