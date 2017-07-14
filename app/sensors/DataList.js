/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";

const helper = require("../middleware/helper");

export default class DataList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: props.data,
			selected: null
		};

		this.type = this.props.multipleSelect ? "Terms" : "Term";
		this.urlParams = helper.URLParams.get(this.props.componentId, props.multipleSelect);
		this.customQuery = this.customQuery.bind(this);
		this.renderObjectList = this.renderObjectList.bind(this);
		this.renderStringList = this.renderStringList.bind(this);
	}

	componentWillMount() {
		this.setQueryInfo();
		this.checkDefault(this.props);
		this.listenFilter();
	}

	componentWillUnmount() {
		if(this.filterListener) {
			this.filterListener.remove();
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.data
		});
		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.changeValue(nextProps.defaultSelected);
		}
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if(data === this.props.componentId) {
				this.reset();
			}
		});
	}

	checkDefault(props) {
		this.urlParams = helper.URLParams.get(props.componentId, props.multipleSelect);
		const defaultValue = this.urlParams !== null ? this.urlParams : props.defaultSelected;
		this.changeValue(defaultValue);
	}

	changeValue(defaultValue) {
		if (!_.isEqual(this.defaultSelected, defaultValue)) {
			this.defaultSelected = defaultValue;
			if(defaultValue) {
				if (this.props.multipleSelect) {
					if (Array.isArray(defaultValue)) {
						let selected = [];
						defaultValue.forEach(item => {
							this.state.data.some(record => {
								if (record.label ? record.label === item : record === item) {
									selected.push(record);
									return true;
								}
							});
						});
						// when defaultSelected is updated, the selected values should be set without depending on their previous state
						this.setState({
							selected
						}, () => {
							this.defaultSelected = selected;
							this.executeQuery(selected);
						});
					} else {
						console.error(`${this.props.componentId} - defaultSelected should be an array`);
					}
				} else {
					this.state.data.some(record => {
						if (record.label ? record.label === defaultValue : record === defaultValue) {
							this.handleChange(record);
							return true;
						}
					});
				}
			} else if (defaultValue === null) {
				if (this.props.multipleSelect) {
					this.handleCheckboxChange(null);
				} else {
					this.handleChange(null);
				}
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
				component: this.props.component,
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	customQuery(record) {
		if (record) {
			const listQuery= {
				[this.type]: {
					[this.props.appbaseField]: record
				}
			};
			return this.props.multipleSelect ? (record.length ? listQuery : null) : listQuery;
		}
		return null;
	}

	reset() {
		this.setState({
			selected: this.props.multipleSelect ? [] : ""
		});

		const obj = {
			key: this.props.componentId,
			value: null
		};

		if (this.props.onValueChange) {
			this.props.onValueChange(null);
		}

		helper.URLParams.update(this.props.componentId, null, this.props.URLParams);
		helper.selectedSensor.set(obj, true);
	}

	handleChange(record) {
		let value = record;

		if (typeof this.state.data[0] === "object") {
			value = record.value;
		}

		this.setState({
			selected: value
		}, () => {
			this.defaultSelected = value;
		});

		this.executeQuery(value);
	}

	handleCheckboxChange(record) {
		let { selected, data } = this.state;
		let value = record;

		if (typeof data[0] === "object") {
			value = record.value;
		}

		if (selected && selected.length) {
			const index = selected.indexOf(value);

			if (index >= 0) {
				selected.splice(index, 1);
			} else {
				selected.push(value);
			}
		} else {
			selected = [value];
		}

		this.setState({
			selected: selected
		}, () => {
			this.defaultSelected = selected;
		});

		this.executeQuery(selected);
	}

	executeQuery(value) {
		const obj = {
			key: this.props.componentId,
			value
		};

		if (this.props.onValueChange) {
			this.props.onValueChange(value);
		}

		const selectedValue = typeof value === "string" ? ( value.trim() ? value : null ) : value;
		helper.URLParams.update(this.props.componentId, selectedValue, this.props.URLParams);
		helper.selectedSensor.set(obj, true);
	}

	renderObjectList() {
		const { data, selected } = this.state;
		let list;

		if (data) {
			if (this.props.multipleSelect) {
				list = data.map((record, i) => (
					<div className="rbc-list-item row" key={`${record.label}-${i}`} onClick={() => this.handleCheckboxChange(record)}>
						<input
							type="checkbox"
							className="rbc-checkbox-item"
							checked={selected && selected.indexOf(record.value) >= 0}
							onChange={() => {}}
						/>
						<label className="rbc-label">{record.label}</label>
					</div>
				));
			} else {
				list = data.map((record, i) => (
					<div className="rbc-list-item row" key={`${record.label}-${i}`} onClick={() => this.handleChange(record)}>
						<input
							type="radio"
							className="rbc-radio-item"
							checked={selected && selected === record.value}
							onChange={() => {}}
						/>
						<label className="rbc-label">{record.label}</label>
					</div>
				));
			}
		}
		return list;
	}

	renderStringList() {
		const { data, selected } = this.state;
		let list;

		if (data) {
			if (this.props.multipleSelect) {
				list = data.map((record, i) => (
					<div className="rbc-list-item row" key={`${record}-${i}`} onClick={() => this.handleCheckboxChange(record)}>
						<input
							type="checkbox"
							className="rbc-checkbox-item"
							checked={selected && selected.indexOf(record) >= 0}
							onChange={() => {}}
						/>
						<label className="rbc-label">{record}</label>
					</div>
				));
			} else {
				list = data.map((record, i) => (
					<div className="rbc-list-item row" key={`${record}-${i}`} onClick={() => this.handleChange(record)}>
						<input
							type="radio"
							className="rbc-radio-item"
							checked={selected === record}
							onChange={() => {}}
						/>
						<label className="rbc-label">{record}</label>
					</div>
				));
			}
		}
		return list;
	}

	render() {
		let listComponent = null,
			searchComponent = null,
			title = null;

		if (this.state.data.length === 0) {
			return null;
		} else {
			if (typeof this.state.data[0] === "object") {
				listComponent = this.renderObjectList();
			} else {
				listComponent = this.renderStringList();
			}
		}

		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder,
			"rbc-singledatalist": !this.props.multipleSelect,
			"rbc-multidatalist": this.props.multipleSelect,
			"rbc-initialloader-active": this.props.initialLoader,
			"rbc-initialloader-inactive": !this.props.initialLoader
		});

		return (
			<div className={`rbc col s12 col-xs-12 card thumbnail ${cx}`} style={this.props.componentStyle}>
				{title}
				<div className="rbc-list-container clearfix">
					{listComponent}
				</div>
			</div>
		);
	}
}

DataList.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.string.isRequired,
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	data: React.PropTypes.array,
	defaultSelected: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.array
	]),
	multipleSelect: React.PropTypes.bool,
	customQuery: React.PropTypes.func,
	componentStyle: React.PropTypes.object,
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string
};

// Default props value
DataList.defaultProps = {
	title: null,
	componentStyle: {},
	URLParams: false,
	multipleSelect: false,
	showFilter: true
};

DataList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};
