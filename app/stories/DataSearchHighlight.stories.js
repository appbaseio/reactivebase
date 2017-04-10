import React, { Component } from 'react';
import { ReactiveBase, DataSearch, ReactiveList, SingleDropdownList } from '../app.js';
import { ResponsiveStory } from '../middleware/helper.js';
import moment from "moment";

export default class DataSearchHighlight extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
	}

	componentDidMount() {
		ResponsiveStory();
	}

	onData(item) {
		const res = item._source;
		return (
			<table className="rbc-highlight-table">
				<tr>
					<th>title</th><td dangerouslySetInnerHTML={{__html: res.title}}></td>
				</tr>
				<tr>
					<th>text</th><td dangerouslySetInnerHTML={{__html: res.text}}></td>
				</tr>
				<tr>
					<th>by</th><td dangerouslySetInnerHTML={{__html: res.by}}></td>
				</tr>
			</table>
		)
	}

	render() {
		return (
			<ReactiveBase
				app="hacker-news"
				credentials="Nt7ZtBrAn:5656435e-0273-497e-a741-9a5a2085ae84"
				type="post"
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<DataSearch
							componentId="InputSensor"
							appbaseField={["title", "text", "by"]}
							placeholder="Search posts by title, text or author..."
							autocomplete={false}
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
		topic: 'group.group_topics.topic_name_raw',
		venue: 'venue_name_ngrams'
	}
};
