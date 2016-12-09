import { default as React, Component } from 'react';
var ReactDOM = require('react-dom');
import { Img } from './reactive-lib/other/Img.js';
import {
	AppbaseReactiveMap,
	AppbaseSlider,
	AppbaseSearch,
	AppbaseButtonGroup,
	SingleList,
	MultiList,
	RangeSlider,
	TextField,
	DataSearch,
	SingleRange
} from './app/app.js';

import {
	AppbaseMap
} from './reactive-lib/map/app.js';

const mapsAPIKey = 'AIzaSyAXev-G9ReCOI4QOjPotLsJE-vQ1EX7i-A';

class Main extends Component {
	constructor(props) {
		super(props);
		this.topicDepends = this.topicDepends.bind(this);
		this.popoverContent = this.popoverContent.bind(this);
		this.guestQuery = this.guestQuery.bind(this);
		this.guestData = [{
			label: 'Less than 2',
			start: 0,
			end: 2
		}, {
			label: '2 to 4',
			start: 2,
			end: 4
		}, {
			label: '4 to 6',
			start: 4,
			end: 6
		}, {
			label: 'more than 6',
			start: 6,
			end: 100
		}];
	}
	guestQuery(record) {
		if (record) {
			return {
				range: {
					[this.props.mapping.guests]: {
						gte: record.value.min,
						lte: record.value.max,
						boost: 2.0
					}
				}
			};
		}
	}
	topicDepends(value) {
		if (this.props.mapping.city && value) {
			let match = JSON.parse(`{"${this.props.mapping.city}":` + JSON.stringify(value) + '}');
			return { Match: match };
		} else return null;
	}
	popoverContent(marker) {
		console.log(marker);
		return (<div className="popoverComponent row">
			<span className="imgContainer col s2 col-xs-2">
				<Img src={marker._source.member.photo} />
			</span>
			<div className="infoContainer col s10 col-xs-10">
				<div className="nameContainer">
					<strong>{marker._source.member.member_name}</strong>
				</div>
				<div className="description">
					<p>is going to&nbsp;
						<a href={marker._source.event.event_url} target="_blank">
							{marker._source.event.event_name}
						</a>
					</p>
				</div>
			</div>
		</div>);
	}
	markerOnIndex(res) {}
	render() {
		return (
			<div className="row m-0 h-100">
				<AppbaseReactiveMap config={this.props.config}>
					<div className="col s12 m6 col-xs-12 col-sm-6">
						<div className="row h-100">
							<div className="col s12 m6 col-xs-12 col-sm-6">
								<SingleList
									sensorId="CitySensor"
									appbaseField={this.props.mapping.city}
									defaultSelected="London"
									showCount={true}
									size={1000}
									showSearch={true}
									title="Cities"
									searchPlaceholder="Filter City"
								/>
							</div>
							<div className="col s12 m6 col-xs-12 col-sm-6">
								<MultiList
									sensorId="TopicSensor"
									appbaseField={this.props.mapping.topic}
									defaultSelected={["Social"]}
									showCount={true}
									size={100}
									title="Topics"
									depends={{
										CitySensor: {
											"operation": "must",
											"defaultQuery": this.topicDepends
										}
									}}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col s12 col-xs-12">
								<SingleRange
									appbaseField={this.props.mapping.guests}
									sensorId="GuestSensor"
									title="Guests"
									data={this.guestData}
									defaultSelected="Less than 2"
								/>
							</div>
						</div>
						<div className="row">
							<div className="col s12 col-xs-12">
								<RangeSlider
									sensorId="RangeSensor"
									appbaseField={this.props.mapping.guests}
									depends={{
										CitySensor: {
											"operation": "must",
											"defaultQuery": this.topicDepends
										}
									}}
									stepValue={2}
									title="guests"
									endThreshold={6} />
							</div>
						</div>
					</div>
					<div className="col s12 m6 h-100 col-xs-12 col-sm-6">
						<AppbaseMap
							inputData={this.props.mapping.location}
							historicalData={true}
							markerCluster={false}
							searchComponent="appbase"
							searchField={this.props.mapping.venue}
							mapStyle={this.props.mapStyle}
							autoCenter={true}
							searchAsMoveComponent={true}
							MapStylesComponent={true}
							title="Reactive Maps"
							showPopoverOn = "onClick"
							popoverContent = {this.popoverContent}
							markerOnIndex = {this.markerOnIndex}
							defaultZoom = {13}
							defaultCenter={{ lat: 37.74, lng: -122.45 }}
							depends={{
								CitySensor: {"operation": "must"},
								TopicSensor: {"operation": "must"},
								RangeSensor: {"operation": "must"},
								VenueSensor: {"operation": "must"},
								GuestSensor: {"operation": "must"}
							}}
						/>
						<div id="searchVenue">
							<DataSearch
								appbaseField={this.props.mapping.venue}
								sensorId="VenueSensor"
								searchInputId="CityVenue"
								placeholder="Search Venue"
							/>
						</div>
					</div>
				</AppbaseReactiveMap>
			</div>
		);
	}
}

Main.defaultProps = {
	mapStyle: "Light Monochrome",
	mapping: {
		city: 'group.group_city.raw',
		topic: 'group.group_topics.topic_name_raw.raw',
		venue: 'venue_name_ngrams',
		guests: 'guests',
		location: 'location'
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

ReactDOM.render(<Main />, document.getElementById('map'));
