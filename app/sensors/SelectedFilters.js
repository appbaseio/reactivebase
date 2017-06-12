import React, { Component } from "react";
import classNames from "classnames";
import _ from "lodash";
import moment from "moment";
const helper = require("../middleware/helper.js");

export default class SelectedFilters extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			filters: {}
		};
		this.blacklist = ["NumberBox", "RangeSlider"];
	}

	componentDidMount() {
		this.listenChanges();
	}

	componentWillUnmount() {
		if (this.sensorListener) {
			this.sensorListener.remove();
		}
	}

	listenChanges() {
		this.sensorListener = helper.sensorEmitter.addListener("sensorChange", this.updateSensors.bind(this));
	}

	updateSensors(data) {
		let isanyChange = false;
		let filters = this.state.filters;
		Object.keys(data).forEach(item => {
			const selectedFilter = this.isSibling(item);
			if (selectedFilter) {
				if (data[item]) {
					filters[item] = {
						value: data[item],
						component: selectedFilter.component
					};
				} else {
					if (item in filters) {
						delete filters[item];
					}
				}
				isanyChange = true;
			}
		})
		if (!isanyChange) {
			filters = [];
		}
		this.setState({
			filters
		});
	}

	isSibling(siblingComponentId) {
		let filter = null;
		const sensorInfo = helper.selectedSensor.get(siblingComponentId, "sensorInfo");
		if (sensorInfo && sensorInfo.allowFilter && sensorInfo.component && (sensorInfo.reactiveId === 0 || sensorInfo.reactiveId) && this.blacklist.indexOf(sensorInfo.component) < 0 && this.context.reactiveId === sensorInfo.reactiveId) {
			filter = {
				component: sensorInfo.component
			};
		}
		return filter;
	}

	clearFilter(item) {
		let filters = this.state.filters;
		delete filters[item];
		this.setState({
			filters
		});
		helper.sensorEmitter.emit("clearFilter", item);
	}

	parseValue(item) {
		let value = item.value;
		if (item.component === "DatePicker") {
			value = moment(item.value).format("YYYY-MM-DD");
		} else if (item.component === "DateRange") {
			value = {
				start: item.value.startDate ? moment(item.value.startDate).format("YYYY-MM-DD") : null,
				end: item.value.endDate ? moment(item.value.endDate).format("YYYY-MM-DD") : null
			}
			value = JSON.stringify(value);
		} else if (item.component === "MultiDropdownRange" || item.component === "MultiRange" || item.component === "ToggleButton" || item.component === "ToggleList") {
			value = item.value.map(range => range.label);
			value = value.join(", ");
		} else if (item.component === "SingleRange" || item.component === "SingleDropdownRange" || item.component === "RatingsFilter") {
			value = item.value.label;
		} else if (item.component === "GeoDistanceSlider") {
			value = item.value.currentValue;
			if (value && item.value.currentDistance) {
				value += " (" + item.value.currentDistance + ")";
			}
		} else if (item.component === "GeoDistanceDropdown") {
			value = item.value.currentValue;
			if (value && item.value.unit && item.value.end) {
				value += " (" + item.value.start + item.value.unit + " - " + item.value.end + item.value.unit + ")";
			}
		} else if (item.component === "CategorySearch") {
			value = item && item.value && item.value.value ? item.value.value : null;
			if (item.value.category && value) {
				value += " in " + item.value.category;
			}
		} else if (item.component === "PlacesSearch") {
			value = item.value.currentValue;
		} else if (item.component === "NestedList") {
			value = item.value.join(" > ");
		} else if (_.isArray(item.value)) {
			value = item.value.join(", ");
		} else if (_.isObject(item.value)) {
			value = JSON.stringify(item.value);
		}
		return value;
	}

	render() {
		return Object.keys(this.state.filters).length ? (
			<div className={`rbc rbc-selectedfilters rbc-tag-container row card thumbnail`} style={this.props.componentStyle}>
				{
					Object.keys(this.state.filters).map(item => (
						<span key={item} className="rbc-tag-item col">
							<button className="close" onClick={() => this.clearFilter(item)}>x</button>
							<span className="rb-tag-text">
								<strong>{item}</strong> : {this.parseValue(this.state.filters[item])}
							</span>
						</span>
					))
				}
			</div>
		) : null
	}
}

SelectedFilters.propTypes = {
	componentStyle: React.PropTypes.object,
	componentId: React.PropTypes.string.isRequired
};

SelectedFilters.defaultProps = {
	componentStyle: {}
};

// context type
SelectedFilters.contextTypes = {
	reactiveId: React.PropTypes.number
};
