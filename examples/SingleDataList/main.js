import {
	default as React, Component } from 'react';
var ReactDOM = require('react-dom');

import {
	ReactiveBase,
	SingleDataList,
	ReactiveList,
	SelectedFilters
} from '../../app/app.js';

import { Img } from "../../app/stories/Img.js";

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			defaultSelected: "Social"
		};

		this.data = [{
			label: "Social",
			value: "Social"
		}, {
			label: "Travel",
			value: "Travel"
		}, {
			label: "Outdoors",
			value: "Outdoors"
		}];

		this.DEFAULT_IMAGE = "http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg";
		this.handleInputChange = this.handleInputChange.bind(this);
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

	handleInputChange(e) {
		const defaultSelected = e.target.value;
		this.setState({
			defaultSelected
		});
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
						<SingleDataList
							dataField={this.props.mapping.topic}
							componentId="MeetupTops"
							title="SingleDataList"
							data={this.data}
							URLParams={true}
							defaultSelected={this.state.defaultSelected}
							filterLabel="Meetup Label"
							onQueryChange={(prev, next) => {
								console.log("prevQuery", prev);
								console.log("nextQuery", next);
							}}
							onValueChange={value => console.log("onValueChange:", value)}
						/>
						<input value={this.state.defaultSelected} onChange={this.handleInputChange} placeholder="defaultSelected" />
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
								and: "MeetupTops"
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
