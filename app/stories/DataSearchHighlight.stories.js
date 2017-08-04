import React, { Component } from "react";
import { ReactiveBase, DataSearch, ReactiveList, SingleDropdownList, SelectedFilters } from "../app.js";
import ResponsiveStory from "./ReactiveElement/ResponsiveStory";
import moment from "moment";

export default class DataSearchHighlight extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		ResponsiveStory();
	}

	onData(item) {
		const res = item._source;
		return (
			<table className="rbc-highlight-table">
				<tr>
					<th>title</th><td dangerouslySetInnerHTML={{ __html: res.title }} />
				</tr>
				<tr>
					<th>text</th><td dangerouslySetInnerHTML={{ __html: res.text }} />
				</tr>
				<tr>
					<th>by</th><td dangerouslySetInnerHTML={{ __html: res.by }} />
				</tr>
			</table>
		);
	}

	render() {
		return (
			<ReactiveBase
				app="hn"
				credentials="Uzq9SU9vM:7298de2f-1884-4d38-8dfd-f7fa14060198"
				type="post"
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<SelectedFilters componentId="SelectedFilters" />
						<DataSearch
							componentId="InputSensor"
							appbaseField={["title", "text", "by"]}
							placeholder="Search posts by title, text or author..."
							autoSuggest={false}
							highlight={true}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ReactiveList
							appbaseField="title"
							from={0}
							size={50}
							showPagination={true}
							onData={this.onData}
							react={{
								and: ["InputSensor"]
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

DataSearchHighlight.defaultProps = {
	mapping: {
		topic: "group.group_topics.topic_name_raw",
		venue: "venue_name_ngrams"
	}
};
