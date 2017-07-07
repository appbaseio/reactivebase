import React, { Component } from "react";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";
import _ from "lodash";

const helper = require("../middleware/helper");

export default class MultiRange extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: []
		};
		this.type = "range";
		this.urlParams = helper.URLParams.get(this.props.componentId, true);
		this.handleChange = this.handleChange.bind(this);
		this.resetState = this.resetState.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
		this.customQuery = this.customQuery.bind(this);
	}

	// Set query information
	componentWillMount() {
		this.setQueryInfo();
		this.checkDefault(this.props);
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		this.checkDefault(nextProps);
	}

	componentWillUnmount() {
		if(this.filterListener) {
			this.filterListener.remove();
		}
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if(data === this.props.componentId) {
				this.changeValue(null);
			}
		});
	}

	checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId, true);
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	}

	changeValue(defaultValue) {
		if (!_.isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if(defaultValue) {
				this.resetState();
				const records = this.props.data.filter(record => defaultValue.indexOf(record.label) > -1);
				if (records && records.length) {
					setTimeout(this.handleChange.bind(this, records), 1000);
				}
			} else {
				this.handleChange(null);
			}
		}
	}

	// set the query type and input data
	setQueryInfo() {
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.customQuery,
				reactiveId: this.context.reactiveId,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: "MultiRange",
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	// build query for this sensor only
	customQuery(record) {
		function generateRangeQuery(appbaseField) {
			if (record.length > 0) {
				return record.map(singleRecord => ({
					range: {
						[appbaseField]: {
							gte: singleRecord.start,
							lte: singleRecord.end,
							boost: 2.0
						}
					}
				}));
			}
			return null;
		}

		if (record) {
			const query = {
				bool: {
					should: generateRangeQuery(this.props.appbaseField),
					minimum_should_match: 1,
					boost: 1.0
				}
			};
			return query;
		}
		return null;
	}

	// handle the input change and pass the value inside sensor info
	handleChange(record) {
		let selected = this.state.selected;
		let selectedIndex = null;
		let records = record;

		function setRecord(selectedRecord, index, item) {
			if (item.label === selectedRecord.label) {
				selectedIndex = index;
				selected.splice(index, 1);
			}
		}

		if(record) {
			if (selected === null) {
				selected = [];
			}
			if (!_.isArray(record)) {
				records = [record];
			}
			records.forEach((item) => {
				selected.forEach((selectedRecord, index) => {
					setRecord(selectedRecord, index, item);
				});
			});

			if (selectedIndex === null) {
				records.forEach((item) => {
					selected.push(item);
				});
			}
		} else {
			selected = null;
		}
		selected = selected === "" ? null : selected;
		selected = selected && selected.length ? selected : null;
		this.defaultSelected = selected;

		this.setState({
			selected
		});

		const obj = {
			key: this.props.componentId,
			value: selected
		};

		// pass the selected sensor value with componentId as key,
		const isExecuteQuery = true;
		if (this.props.onValueChange) {
			this.props.onValueChange(obj.value);
		}
		helper.URLParams.update(this.props.componentId, this.getSelectedLabels(selected), this.props.URLParams);
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	getSelectedLabels(selected) {
		return selected ? selected.map(item => item.label) : null;
	}

	resetState() {
		this.setState({
			selected: []
		});
		const obj = {
			key: this.props.componentId,
			value: []
		};
		// pass the selected sensor value with componentId as key,
		const isExecuteQuery = true;
		helper.URLParams.update(this.props.componentId, null, this.props.URLParams);
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	handleTagClick(label) {
		const target = this.state.selected.filter(record => record.label === label);
		this.handleChange(target[0]);
	}

	renderButtons() {
		let buttons;
		const selectedText = this.state.selected ? this.state.selected.map(record => record.label) : "";
		if (this.props.data) {
			buttons = this.props.data.map((record) => {
				const cx = classNames({
					"rbc-checkbox-active": this.props.showCheckbox,
					"rbc-checkbox-inactive": !this.props.showCheckbox,
					"rbc-list-item-active": selectedText.indexOf(record.label) !== -1,
					"rbc-list-item-inactive": selectedText.indexOf(record.label) === -1
				});

				return (
					<div className={`rbc-list-item row ${cx}`} key={record.label} onClick={() => this.handleChange(record)}>
						<input
							type="checkbox"
							className="rbc-checkbox-item"
							checked={selectedText.indexOf(record.label) > -1}
							value={record.label}
						/>
						<label className="rbc-label">{record.label}</label>
					</div>
				);
			});
		}
		return buttons;
	}

	// render
	render() {
		let title = null;
		const TagItemsArray = [];

		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		if (this.state.selected && this.props.showTags) {
			this.state.selected.forEach((item) => {
				TagItemsArray.push(<Tag
					key={item.label}
					value={item.label}
					onClick={this.handleTagClick}
				/>);
			});
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-checkbox-active": this.props.showCheckbox,
			"rbc-checkbox-inactive": !this.props.showCheckbox
		});

		return (
			<div className={`rbc rbc-multirange col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.componentStyle}>
				<div className="row">
					{title}
					<div className="col s12 col-xs-12 rbc-list-container">
						{
							TagItemsArray.length ?
								<div className="row" style={{ marginTop: "0" }}>
									{TagItemsArray}
								</div> :
							null
						}
						{this.renderButtons()}
					</div>
				</div>
			</div>
		);
	}
}

const Tag = (props) => {
	return (
		<span onClick={() => props.onClick(props.value)} className="rbc-tag-item col">
			<a className="close">×</a>
			<span>{props.value}</span>
		</span>
	);
}

Tag.propTypes = {
	onClick: React.PropTypes.func.isRequired,
	value: React.PropTypes.string.isRequired
};

MultiRange.propTypes = {
	appbaseField: React.PropTypes.string.isRequired,
	componentId: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	data: React.PropTypes.any.isRequired,
	defaultSelected: React.PropTypes.array,
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	showTags: React.PropTypes.bool,
	showCheckbox: React.PropTypes.bool
};

// Default props value
MultiRange.defaultProps = {
	URLParams: false,
	showFilter: true,
	showTags: true,
	showCheckbox: true
};

// context type
MultiRange.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

MultiRange.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.NUMBER,
	title: TYPES.STRING,
	data: TYPES.OBJECT,
	defaultSelected: TYPES.ARRAY,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	showTags: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	showCheckbox: TYPES.BOOLEAN
};
