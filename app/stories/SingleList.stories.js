import React, { Component } from "react";
import { ReactiveBase, SingleList, ReactiveList, SelectedFilters } from "../app.js";
import { ResponsiveStory } from "../middleware/helper.js";
import { Img } from "./Img.js";

export default class SingleListDefault extends Component {
	constructor(props) {
		super(props);
		this.DEFAULT_IMAGE = "http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg";
	}

	componentDidMount() {
		ResponsiveStory();
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
			<ReactiveBase
				app="meetup_demo"
				credentials="LPpISlEBe:2a8935f5-0f63-4084-bc3e-2b2b4d1a8e02"
				type="meetupdata1"
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<SelectedFilters componentId="SelectedFilters" />
						<SingleList
							componentId="CitySensor"
							appbaseField={this.props.mapping.city}
							title="SingleList"
							size={100}
							customQuery={this.customQuery}
							{...this.props}
						/>
					</div>
					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							appbaseField={this.props.mapping.topic}
							title="Results"
							sortBy="asc"
							from={0}
							size={20}
							size={2}
							onData={this.onData}
							react={{
								and: ["CitySensor"]
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

SingleListDefault.defaultProps = {
	mapping: {
		city: "group.group_city.raw",
		topic: "group.group_topics.topic_name_raw"
	}
};
