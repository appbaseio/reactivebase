import {
	default as React, Component } from 'react';
var ReactDOM = require('react-dom');

import {
	ReactiveBase,
	SingleList,
	MultiList,
	ReactiveList,
	SelectedFilters
} from '../../app/app.js';

import { Img } from "../../app/stories/Img.js";

class Main extends Component {
	constructor(props) {
		super(props);
		this.DEFAULT_IMAGE = "http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg";
	}

	onData(markerData) {
		const marker = markerData._source;
		return (
			<a
				className="full_row single-record single_record_for_clone"
				href={marker.event ? marker.event.event_url : ""}
				target="_blank"
				key={markerData._id}
			>
				<div className="img-container">
					<Img key={markerData._id} src={marker.member ? marker.member.photo : this.DEFAULT_IMAGE} />
				</div>
				<div className="text-container full_row">
					<div className="text-head text-overflow full_row">
						<span className="text-head-info text-overflow">
							{marker.member ? marker.member.member_name : ""} is going to {marker.event ? marker.event.event_name : ""}
						</span>
						<span className="text-head-city">{marker.group ? marker.group.group_city : ""}</span>
					</div>
					<div className="text-description text-overflow full_row">
						<ul className="highlight_tags">
							{
								marker.group.group_topics.map((tag, i) => (<li key={i}>{tag.topic_name}</li>))
							}
						</ul>
					</div>
				</div>
			</a>
		);
	}

	render() {
		return (
			<div className="row m-0 h-100">
				<ReactiveBase
					app="meetup_demo"
					credentials="LPpISlEBe:2a8935f5-0f63-4084-bc3e-2b2b4d1a8e02"
					type="meetupdata1"
				>
					<div className="row">
						<div className="col s12 col-xs-12">
							<SelectedFilters />
						</div>
						<div className="col s6 col-xs-6">
							<MultiList
								componentId="TopicSensor"
								dataField="group.group_topics.topic_name_raw.raw"
								title="MultiList"
								size={100}
								selectAllLabel="Select All"
								defaultSelected={["Social"]}
								URLParams={true}
								showCount={true}
								showCheckbox={true}
								showSearch={true}
								queryFormat="or"
								filterLabel="Topic Label"
								beforeValueChange={() => new Promise((resolve, reject) => resolve())}
								react={{
									and: "CitySensor"
								}}
								onQueryChange={(prev, next) => {
									console.log("multi prev query", prev);
									console.log("multi next query", next);
								}}
								onValueChange={value => console.log("multi onValueChange:", value)}
							/>
							<SingleList
								componentId="CitySensor"
								dataField="group.group_city.raw"
								title="SingleList"
								size={100}
								URLParams={true}
								selectAllLabel="Select All"
								defaultSelected="London"
								filterLabel="City Label"
								beforeValueChange={() => new Promise((resolve, reject) => resolve())}
								react={{
									and: "TopicSensor"
								}}
								onQueryChange={(prev, next) => {
									console.log("single prev query", prev);
									console.log("single next query", next);
								}}
								onValueChange={value => console.log("single onValueChange:", value)}
							/>
						</div>
						<div className="col s6 col-xs-6">
							<ReactiveList
								componentId="SearchResult"
								dataField="group.group_topics.topic_name_raw"
								title="Results"
								sortBy="asc"
								from={0}
								size={20}
								size={2}
								onData={this.onData}
								pagination={true}
								pageURLParams
								react={{
									and: ["CitySensor", "TopicSensor"]
								}}
							/>
						</div>
					</div>
				</ReactiveBase>
			</div>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('map'));
