/* eslint max-lines: 0 */
import React, { Component } from "react";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import { StaticSearch } from "../addons/StaticSearch";
import _ from "lodash";

const helper = require("../middleware/helper");

export default class DataList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [...props.data],
			selected: null,
			selectAll: false
		};

		this.type = this.props.multipleSelect ? "Terms" : "Term";
		this.urlParams = helper.URLParams.get(this.props.componentId, props.multipleSelect);
		this.customQuery = this.customQuery.bind(this);
		this.renderObjectList = this.renderObjectList.bind(this);
		this.renderStringList = this.renderStringList.bind(this);
		this.filterBySearch = this.filterBySearch.bind(this);
		this.onSelectAll = this.onSelectAll.bind(this);
		this.type = this.props.multipleSelect && this.props.queryFormat === "or" ? "Terms" : "Term";
	}

	componentWillMount() {
		this.setQueryInfo(this.props);
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
			if (nextProps.defaultSelected && nextProps.defaultSelected === nextProps.selectAllLabel) {
				this.onSelectAll();
			} else {
				this.changeValue(nextProps.defaultSelected);
			}
		}
		if (this.props.queryFormat !== nextProps.queryFormat) {
			this.type = nextProps.multipleSelect && nextProps.queryFormat === "or" ? "Terms" : "Term";
		}

		if (this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.executeQuery(this.state.selected);
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
		if (props.multipleSelect && Array.isArray(defaultValue) && props.selectAllLabel === defaultValue[0] ||
			!props.multipleSelect && props.selectAllLabel === defaultValue) {
			this.onSelectAll();
		} else {
			this.changeValue(defaultValue);
		}
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
									selected.push(item);
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
					const match = this.state.data.some((record) => {
						if (record.label ? record.label === defaultValue : record === defaultValue) {
							setTimeout(() => {
								this.handleChange(record);
							}, 100);
							return true;
						}
					});
					if (!match) {
						this.handleChange(null);
					}
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
	setQueryInfo(props) {
		const obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.appbaseField,
				customQuery: props.customQuery ? props.customQuery : this.customQuery,
				reactiveId: this.context.reactiveId,
				showFilter: props.showFilter,
				filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
				component: props.component,
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	customQuery(record) {
		if (this.state.selectAll) {
			return {
				exists: {
					field: [this.props.appbaseField]
				}
			};
		} else if (record) {
			// queryFormat should not affect SingleDataList
			if (this.props.queryFormat === "and" && this.props.multipleSelect) {
				// adds a sub-query with must as an array of objects for each terms/value
				const queryArray = record.map(item => (
					{
						[this.type]: {
							[this.props.appbaseField]: item
						}
					}
				));
				return {
					bool: {
						must: queryArray
					}
				};
			}

			// for the default queryFormat = "or" and SingleDataList
			return {
				[this.type]: {
					[this.props.appbaseField]: record
				}
			};
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

		const execQuery = () => {
			if (this.props.onValueChange) {
				this.props.onValueChange(null);
			}

			helper.URLParams.update(this.props.componentId, null, this.props.URLParams);
			helper.selectedSensor.set(obj, true);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(value)
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

	handleChange(record) {
		let value = record;

		if (typeof this.state.data[0] === "object" && record) {
			value = record.value;
		}

		this.setState({
			selected: value,
			selectAll: false
		}, () => {
			this.defaultSelected = value;
			this.executeQuery(value);
		});
	}

	handleCheckboxChange(record) {
		let { selected, data } = this.state;
		let value = record;

		if (typeof this.props.data[0] === "object") {
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
			selected: selected,
			selectAll: false
		}, () => {
			this.defaultSelected = selected;
			this.executeQuery(selected);
		});
	}

	executeQuery(value) {
		const obj = {
			key: this.props.componentId,
			value
		};

		const execQuery = () => {
			if (this.props.onValueChange) {
				if (this.state.selectAll) {
					this.props.onValueChange(this.props.data);
				} else {
					this.props.onValueChange(value);
				}
			}

			const selectedValue = typeof value === "string" ? ( value.trim() ? value : null ) : value;
			helper.URLParams.update(this.props.componentId, selectedValue, this.props.URLParams);
			helper.selectedSensor.set(obj, true);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(value)
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

	renderObjectList() {
		const { data, selected } = this.state;
		let list;
		if (data) {
			if (this.props.multipleSelect) {
				const cx = classNames({
					"rbc-checkbox-active": this.props.showCheckbox,
					"rbc-checkbox-inactive": !this.props.showCheckbox
				});
				list = data.map((record, i) => (
					<div
						className={`rbc-list-item row ${cx} ${selected && selected.indexOf(record.value) >= 0 ? "rbc-list-item-active" : ""}`}
						key={`${record.label}-${i}`}
						onClick={() => {this.handleCheckboxChange(record)}}>
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
				const cx = classNames({
					"rbc-radio-active": this.props.showRadio,
					"rbc-radio-inactive": !this.props.showRadio
				});
				list = data.map((record, i) => (
					<div
						className={`rbc-list-item row ${cx} ${selected && selected === record.value ? "rbc-list-item-active" : ""}`}
						key={`${record.label}-${i}`}
						onClick={() => this.handleChange(record)}>
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
		if (this.props.selectAllLabel) {
			list.unshift(this.getSelectAll());
		}
		return list;
	}

	renderStringList() {
		const { data, selected } = this.state;
		let list;

		if (data) {
			if (this.props.multipleSelect) {
				const cx = classNames({
					"rbc-checkbox-active": this.props.showCheckbox,
					"rbc-checkbox-inactive": !this.props.showCheckbox
				});
				list = data.map((record, i) => (
					<div
						className={`rbc-list-item row ${cx} ${selected && selected.indexOf(record) >= 0 ? "rbc-list-item-active" : ""}`}
						key={`${record}-${i}`}
						onClick={() => {this.handleCheckboxChange(record)}}>
						<input
							type="checkbox"
							className="rbc-checkbox-item"
							checked={selected && selected.indexOf(record) >= 0}
							onChange={() =>  {}}
						/>
						<label className="rbc-label">{record}</label>
					</div>
				));
			} else {
				const cx = classNames({
					"rbc-radio-active": this.props.showRadio,
					"rbc-radio-inactive": !this.props.showRadio
				});
				list = data.map((record, i) => (
					<div
						className={`rbc-list-item row ${cx} ${selected === record ? "rbc-list-item-active" : ""}`}
						key={`${record}-${i}`}
						onClick={() => this.handleChange(record)}>
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
		if (this.props.selectAllLabel) {
			list.unshift(this.getSelectAll());
		}
		return list;
	}

	getSelectAll(list) {
		let selectAllItem = null;
		if (this.props.multipleSelect) {
			const cx = classNames({
				"rbc-checkbox-active": this.props.showCheckbox,
				"rbc-checkbox-inactive": !this.props.showCheckbox
			});
			selectAllItem = (
				<div
					className={`rbc-list-item row ${cx} ${this.state.selectAll ? "rbc-list-item-active" : ""}`}
					key="select-all"
					onClick={this.onSelectAll}>
					<input
						type="checkbox"
						className="rbc-checkbox-item"
						checked={this.state.selectAll}
						onChange={() => {}}
					/>
					<label className="rbc-label">{this.props.selectAllLabel}</label>
				</div>
			);
		} else {
			const cx = classNames({
				"rbc-radio-active": this.props.showRadio,
				"rbc-radio-inactive": !this.props.showRadio
			});
			selectAllItem = (
				<div
					className={`rbc-list-item row ${cx} ${this.state.selectAll ? "rbc-list-item-active" : ""}`}
					key="select-all"
					onClick={this.onSelectAll}>
					<input
						type="radio"
						className="rbc-radio-item"
						checked={this.state.selectAll}
						onChange={() => {}}
					/>
					<label className="rbc-label">{this.props.selectAllLabel}</label>
				</div>
			);
		}
		return selectAllItem;
	}

	onSelectAll() {
		if (this.props.multipleSelect) {
			if (this.state.selectAll) {
				this.setState({
					selected: [],
					selectAll: false
				}, () => {
					this.executeQuery(null);
				});
			} else {
				this.setState({
					selected: [...this.props.data],
					selectAll: true
				}, () => {
					this.executeQuery(this.props.selectAllLabel);
				});
			}
		} else {
			this.setState({
				selected: this.props.selectAllLabel,
				selectAll: true
			}, () => {
				this.executeQuery(this.props.selectAllLabel);
			});
		}
	}

	filterBySearch(value) {
		if (value && value.trim() !== "") {
			let data = null;
			if (typeof this.props.data[0] === "object") {
				data = this.props.data.filter(item => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1);
			} else {
				data = this.props.data.filter(item => item.toLowerCase().indexOf(value.toLowerCase()) > -1);
			}
			this.setState({
				data
			});
		} else if (value.trim() === "") {
			this.setState({
				data: this.props.data
			});
		}
	}

	render() {
		let listComponent = null,
			title = null;

		if (this.props.data.length === 0) {
			return null;
		} else {
			if (typeof this.props.data[0] === "object") {
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
				{
					this.props.showSearch
						? (<StaticSearch
							placeholder={this.props.placeholder}
							changeCallback={this.filterBySearch}
						/>)
						: null
				}
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
	showSearch: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
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
	filterLabel: React.PropTypes.string,
	showRadio: React.PropTypes.bool,
	showCheckbox: React.PropTypes.bool,
	selectAllLabel: React.PropTypes.string,
	queryFormat: React.PropTypes.oneOf(["and", "or"])
};

// Default props value
DataList.defaultProps = {
	title: null,
	showSearch: false,
	placeholder: "Search",
	componentStyle: {},
	URLParams: false,
	multipleSelect: false,
	showFilter: true,
	showRadio: true,
	showCheckbox: true,
	queryFormat: "or"
};

DataList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};
