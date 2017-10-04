import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import moment from "moment";
import * as TYPES from "../middleware/constants";

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
		let { filters } = this.state;
		Object.keys(data).forEach((item) => {
			const selectedFilter = this.isSibling(item);
			if (selectedFilter) {
				if (data[item] && (
					(typeof data[item] === "string" && data[item].trim() !== "") ||
					(Array.isArray(data[item]) && data[item].length > 0) ||
					(Object.keys(data[item]).length !== 0)
				)) {
					filters[item] = {
						value: data[item],
						component: selectedFilter.component,
						filterLabel: selectedFilter.filterLabel
					};
				} else if (item in filters) {
					delete filters[item];
				}
				isanyChange = true;
			}
		});
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
		if (sensorInfo && sensorInfo.showFilter && sensorInfo.component && (sensorInfo.reactiveId === 0 || sensorInfo.reactiveId) && this.blacklist.indexOf(sensorInfo.component) < 0 && this.context.reactiveId === sensorInfo.reactiveId) {
			filter = {
				component: sensorInfo.component,
				filterLabel: sensorInfo.filterLabel
			};
		}
		return filter;
	}

	clearFilter(item) {
		const { filters } = this.state;
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
			};
			value = JSON.stringify(value);
		} else if (item.component === "MultiDropdownRange" || item.component === "MultiRange" || item.component === "ToggleButton" || item.component === "ToggleList") {
			value = item.value.map(range => range.label);
			value = value.join(", ");
		} else if (item.component === "SingleRange" || item.component === "SingleDropdownRange" || item.component === "RatingsFilter") {
			value = item.value.label;
		} else if (item.component === "GeoDistanceSlider") {
			value = item.value.currentValue;
			if (value && item.value.currentDistance) {
				value += ` (${item.value.currentDistance})`;
			}
		} else if (item.component === "GeoDistanceDropdown") {
			value = item.value.currentValue;
			if (value && item.value.unit && item.value.end) {
				value += ` (${item.value.start}${item.value.unit} - ${item.value.end}${item.value.unit})`;
			}
		} else if (item.component === "CategorySearch") {
			value = item && item.value && item.value.value ? item.value.value : null;
			if (item.value.category && value) {
				value += ` in ${item.value.category}`;
			}
		} else if (item.component === "PlacesSearch") {
			value = item.value.currentValue;
		} else if (item.component === "NestedList" || item.component === "NestedMultiList") {
			value = item.value.join(" > ");
		} else if (item.component === "NumberBox") {	// currently not showing NumberBox
			value = value.value;
		} else if (Array.isArray(item.value)) {
			value = item.value.join(", ");
		} else if (_.isObject(item.value)) {
			value = JSON.stringify(item.value);
		}
		return value;
	}

	render() {
		return Object.keys(this.state.filters).length ? (
			<div className={`rbc rbc-selectedfilters rbc-tag-container row card thumbnail ${this.props.className ? this.props.className : ""}`} style={this.props.style}>
				{
					Object.keys(this.state.filters).map((item) => {
						if (!this.props.blackList.includes(item)) {
							return (<span key={item} className="rbc-tag-item col" title={this.parseValue(this.state.filters[item])}>
								<button className="close" onClick={() => this.clearFilter(item)}>x</button>
								<span className="rbc-tag-text">
									<strong>{this.state.filters[item].filterLabel}</strong> : {this.parseValue(this.state.filters[item])}
								</span>
							</span>);
						}
						return null;
					})
				}
			</div>
		) : null;
	}
}

SelectedFilters.propTypes = {
	style: PropTypes.object,
	componentId: PropTypes.string,
	blackList: PropTypes.arrayOf(PropTypes.string),
	className: PropTypes.string
};

SelectedFilters.defaultProps = {
	style: {},
	blackList: []
};

// context type
SelectedFilters.contextTypes = {
	reactiveId: PropTypes.number
};

SelectedFilters.types = {
	style: TYPES.OBJECT,
	componentId: TYPES.STRING,
	blackList: TYPES.ARRAY
};
