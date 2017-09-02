import React, { Component } from "react";
import { ReactiveBase, DataSearch, ReactiveList, SelectedFilters } from "../app.js";
import ResponsiveStory from "./ReactiveElement/ResponsiveStory";

export default class DataSearchDefault extends Component {
	constructor(props) {
		super(props);
		this.onData = this.onData.bind(this);
	}

	componentDidMount() {
		ResponsiveStory();
	}

	onData(data) {
		const res = data._source;
		return (
			<div className="row">
				<div className="col s6 col-xs-6">
					<img className="responsive-img img-responsive" src="https://www.enterprise.com/content/dam/global-vehicle-images/cars/FORD_FOCU_2012-1.png" />
				</div>
				<div className="col s6 col-xs-6">
					<div dangerouslySetInnerHTML={{ __html: res.name }} />
					<div dangerouslySetInnerHTML={{ __html: res.brand }} />
					<div className="highlight_tags">
						{res.rating} stars
					</div>
				</div>
			</div>
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
						<SelectedFilters componentId="CarSensor" />
						<DataSearch
							dataField={["name", "brand"]}
							componentId="CarSensor"
							placeholder="Search Cars"
							{...this.props}
						/>
					</div>

					<div className="col s6 col-xs-6">
						<ReactiveList
							componentId="SearchResult"
							dataField="name"
							title="Results"
							sortBy="asc"
							from={0}
							size={20}
							stream
							onData={this.onData}
							react={{
								and: "CarSensor"
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}
