import React, { Component } from "react";
import classNames from "classnames";
import * as TYPES from "../middleware/constants";

const helper = require("../middleware/helper");

export default class DataController extends Component {
	constructor(props) {
		super(props);
		this.type = "match";
		this.value = "customValue";
		this.urlParams = helper.URLParams.get(this.props.componentId);
	}

	// Set query information
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setQueryInfo(this.props);
		this.checkDefault();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.setValue(this.defaultSelected);
		}
	}

	componentWillUpdate() {
		this.checkDefault();
	}

	checkDefault() {
		this.defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		if (this.defaultValue && this.defaultSelected != this.defaultValue) {
			this.defaultSelected = this.defaultValue;
			setTimeout(this.setValue.bind(this, this.defaultSelected), 100);
		}
	}

	// set the query type and input data
	setQueryInfo(props) {
		const valObj = {
			queryType: this.type,
			reactiveId: this.context.reactiveId,
			showFilter: props.showFilter,
			filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
			component: "DataController",
			defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
		};
		if (props.customQuery) {
			const customQuery = (value) => {
				const currentQuery = props.customQuery(value);
				if (this.props.onQueryChange && JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
					this.props.onQueryChange(this.previousQuery, currentQuery);
				}
				this.previousQuery = currentQuery;
				return currentQuery;
			};
			valObj.customQuery = customQuery;
		}
		const obj = {
			key: props.componentId,
			value: valObj
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	setValue(value) {
		const obj = {
			key: this.props.componentId,
			value
		};

		const execQuery = () => {
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			// pass the selected sensor value with componentId as key,
			const isExecuteQuery = true;
			helper.URLParams.update(this.props.componentId, value, this.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(obj.value)
			.then(() => {
				execQuery();
			})
			.catch((e) => {
				console.warn(`${this.props.componentId} - beforeValueChange rejected the promise with`, e);
			});
		} else {
			execQuery();
		}
	}

	// render
	render() {
		let title = null,
			dataLabel = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		if (this.props.dataLabel) {
			dataLabel = (<span className="rbc-datalabel col s12 col-xs-12">{this.props.dataLabel}</span>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-datalabel-active": this.props.dataLabel,
			"rbc-datalabel-inactive": !this.props.dataLabel,
			"rbc-visible-active": this.props.visible,
			"rbc-visible-inactive": !this.props.visible
		});

		return (
			<div className={`rbc rbc-datacontroller card thumbnail ${cx}`} style={this.props.componentStyle}>
				{
				this.props.visible ?
				(
					<div>
						{title}
						{dataLabel}
					</div>
				) : null
			}
			</div>
		);
	}
}

DataController.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	visible: React.PropTypes.bool,
	dataLabel: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	customQuery: React.PropTypes.func.isRequired,
	onValueChange: React.PropTypes.func,
	onQueryChange: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	defaultSelected: React.PropTypes.any,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string
};

React.PropTypes.oneOfType([
	React.PropTypes.string,
	React.PropTypes.element
]);

// Default props value
DataController.defaultProps = {
	visible: false,
	defaultSelected: "default",
	componentStyle: {},
	URLParams: false,
	showFilter: true
};

// context type
DataController.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

DataController.types = {
	componentId: TYPES.STRING,
	title: TYPES.STRING,
	visible: TYPES.BOOLEAN,
	dataLabel: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING
};
