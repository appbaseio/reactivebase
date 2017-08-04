import React, { Component } from "react";
import { ReactiveBase, TextField, ReactiveList, SelectedFilters } from "../app.js";
import ResponsiveStory from "./ReactiveElement/ResponsiveStory";

export default class TextFieldDefault extends Component {
	constructor(props) {
		super(props);
		this.nameQuery = this.nameQuery.bind(this);
	}

	componentDidMount() {
		ResponsiveStory();
	}

	nameQuery(value) {
		if (value) {
			return {
				match: {
					"cars.name": value
				}
			};
		} return null;
	}

	onData(markerData) {
		const marker = markerData._source;
		return (
			<a
				className="full_row single-record single_record_for_clone"
				href="#"
				key={markerData._id}
			>
				<div className="text-container full_row" style={{ paddingLeft: "10px" }}>
					<div className="text-head text-overflow full_row">
						<span className="text-head-info text-overflow">
							{marker.name ? marker.name : ""} - {marker.brand ? marker.brand : ""}
						</span>
						<span className="text-head-city">{marker.brand ? marker.brand : ""}</span>
					</div>
					<div className="text-description text-overflow full_row">
						<ul className="highlight_tags">
							{marker.price ? `Priced at $${marker.price}` : "Free Test Drive"}
						</ul>
					</div>
				</div>
			</a>
		);
	}

	render() {
		return (
			<ReactiveBase
				app="car-store"
				credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
			>
				<div className="row">
					<div className="col s6 col-xs-6">
						<SelectedFilters componentId="SelectedFilters" />
						<TextField
							componentId="NameTextSensor"
							appbaseField={this.props.mapping.name}
							title="TextField"
							customQuery={this.NameQuery}
							{...this.props}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							appbaseField={this.props.mapping.name}
							title="Cars"
							from={0}
							size={20}
							onData={this.onData}
							react={{
								and: "NameTextSensor"
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

TextFieldDefault.defaultProps = {
	mapping: {
		name: "name"
	}
};
