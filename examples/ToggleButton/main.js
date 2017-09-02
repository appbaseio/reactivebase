import {
	default as React, Component } from 'react';
var ReactDOM = require('react-dom');

import {
	ReactiveBase,
	ToggleButton,
	SingleRange,
	ReactiveList,
	SelectedFilters
} from '../../app/app.js';

import { Img } from "../../app/stories/Img.js";

class Main extends Component {
	constructor(props) {
		super(props);

		this.toggleData = [{
			label: "Social",
			value: "Social"
		}
		, {
			label: "Travel",
			value: "Travel"
		}, {
			label: "Outdoors",
			value: "Outdoors"
		}
		];

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
			<ReactiveBase
				app="meetup_demo"
				credentials="LPpISlEBe:2a8935f5-0f63-4084-bc3e-2b2b4d1a8e02"
			>
				<SelectedFilters componentId="SelectedFilters" />
				<div className="row">
					<div className="col s6 col-xs-6">
						<ToggleButton
							dataField={this.props.mapping.topic}
							componentId="MeetupTops"
							title="ToggleButton"
							data={this.toggleData}
							defaultSelected={"Social"}
							URLParams={true}
							multiSelect={false}
							filterLabel="Toggle Label"
						/>
						<SingleRange
							componentId="PriceSensor"
							dataField="price"
							title="SingleRange"
							showFilter={true}
							data={
							[{ start: 0, end: 100, label: "Cheap" },
								{ start: 101, end: 200, label: "Moderate" },
								{ start: 201, end: 500, label: "Pricey" },
								{ start: 501, end: 1000, label: "First Date" }]
							}
							URLParams={true}
							filterLabel="Price Label"
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
							onData={this.onData}
							react={{
								and: ["PriceSensor", "MeetupTops"]
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

Main.defaultProps = {
	mapping: {
		topic: "group.group_topics.topic_name_raw.raw"
	}
};


ReactDOM.render(<Main />, document.getElementById('map'));
