import React, { Component } from "react";
import Select from "react-select";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import * as TYPES from "../middleware/constants";

const helper = require("../middleware/helper");

export default class DataSearch extends Component {
	// Search results often contain duplicate results, so display only unique values
	removeDuplicates(myArr, prop) {
		return myArr.filter((obj, pos, arr) => arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos);
	}

	constructor(props) {
		super(props);
		this.state = {
			items: [],
			currentValue: null,
			isLoading: false,
			options: [],
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		this.type = "match_phrase";
		this.searchInputId = `internal-${this.props.componentId}`;
		this.channelId = null;
		this.channelListener = null;
		this.fieldType = typeof this.props.appbaseField;
		this.handleSearch = this.handleSearch.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.setValue = this.setValue.bind(this);
		this.defaultSearchQuery = this.defaultSearchQuery.bind(this);
		this.previousSelectedSensor = {};
	}

	// Get the items from Appbase when component is mounted
	componentDidMount() {
		this.setQueryInfo();
		this.createChannel();
		this.checkDefault();
	}

	componentWillUpdate() {
		this.checkDefault();
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {	
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
	}

	// set the query type and input data
	setQueryInfo() {
		const obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.defaultSearchQuery
			}
		};
		helper.selectedSensor.setSensorInfo(obj);
		const searchObj = {
			key: this.searchInputId,
			value: {
				queryType: "multi_match",
				inputData: this.props.appbaseField,
				customQuery: this.defaultSearchQuery
			}
		};
		helper.selectedSensor.setSensorInfo(searchObj);
	}

	// set value to search
	setValue(value) {
		const obj = {
			key: this.searchInputId,
			value
		};
		helper.selectedSensor.set(obj, true);
		if (value && value.trim() !== "") {
			this.setState({
				options: [{
					label: value,
					value
				}],
				isLoadingOptions: true,
				currentValue: value
			});
		} else {
			this.setState({
				options: [],
				isLoadingOptions: false,
				currentValue: value
			});
		}
	}

	// set data after get the result
	setData(data) {
		let options = [];
		let searchField = null;
		if (this.fieldType === "string") {
			searchField = `hit._source.${this.props.appbaseField}.trim()`;
		}
		data.hits.hits.map((hit) => {
			if (searchField) {
				options.push({ value: eval(searchField), label: eval(searchField) });
			} else if (this.fieldType === "object") {
				this.props.appbaseField.map((field) => {
					const tempField = `hit._source.${field}`;
					if (eval(tempField)) {
						options.push({ value: eval(tempField), label: eval(tempField) });
					}
				});
			}
		});
		if (this.state.currentValue && this.state.currentValue.trim() !== "") {
			options.unshift({
				label: this.state.currentValue,
				value: this.state.currentValue
			});
		}
		options = this.removeDuplicates(options, "label");
		this.setState({
			options,
			isLoadingOptions: false
		});
	}

	// default query
	defaultSearchQuery(value) {
		if (value) {
			if (this.fieldType === "string") {
				return {
					match_phrase_prefix: {
						[this.props.appbaseField]: value
					}
				};
			}
			const query = [];
			this.props.appbaseField.map((field) => {
				query.push({
					match_phrase_prefix: {
						[field]: value
					}
				});
			});
			return {
				bool: {
					should: query,
					minimum_should_match: 1
				}
			};
		}
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		const react = this.props.react ? this.props.react : {};
		if (react && react.and && typeof react.and === "string") {
			react.and = [react.and];
		} else {
			react.and = react.and ? react.and : [];
		}
		react.and.push(this.searchInputId);
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, (res) => {
			const data = res.data;
			let rawData;
			if (res.mode === "streaming") {
				rawData = this.state.rawData;
				rawData.hits.hits.push(res.data);
			} else if (res.mode === "historic") {
				rawData = data;
			}
			this.setState({
				rawData
			});
			if (this.props.autocomplete) {
				this.setData(rawData);
			}
		});
	}

	checkDefault() {
		if (this.props.defaultSelected && this.defaultSelected !== this.props.defaultSelected) {
			this.defaultSelected = this.props.defaultSelected;
			setTimeout(this.setValue.bind(this, this.defaultSelected), 100);
			this.handleSearch({
				value: this.defaultSelected
			});
		}
	}

	// When user has selected a search value
	handleSearch(currentValue) {
		let value = currentValue ? currentValue.value : null;
		value = value === "null" ? null : value;
		const obj = {
			key: this.props.componentId,
			value
		};
		helper.selectedSensor.set(obj, true);
		this.setState({
			currentValue: value
		});
	}

	handleInputChange(event) {
		const inputVal = event.target.value;
		this.setState({
			currentValue: inputVal
		});
		const obj = {
			key: this.props.componentId,
			value: inputVal
		};

		// pass the selected sensor value with componentId as key,
		const isExecuteQuery = true;
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	render() {
		let title = null;
		if (this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}
		const cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder,
			"rbc-autocomplete-active": this.props.autocomplete,
			"rbc-autocomplete-inactive": !this.props.autocomplete
		});

		return (
			<div className={`rbc rbc-datasearch col s12 col-xs-12 card thumbnail ${cx}`}>
				{title}
				{
					this.props.autocomplete ?
						<Select
							isLoading={this.state.isLoadingOptions}
							value={this.state.currentValue}
							options={this.state.options}
							onInputChange={this.setValue}
							onChange={this.handleSearch}
							onBlurResetsInput={false}
							{...this.props}
						/> :
						<div className="rbc-search-container col s12 col-xs-12">
							<input
								type="text"
								className="rbc-input"
								placeholder={this.props.placeholder}
								value={this.state.currentValue ? this.state.currentValue : ""}
								onChange={this.handleInputChange}
							/>
							<span className="rbc-search-icon" />
						</div>
				}
			</div>
		);
	}
}

DataSearch.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.arrayOf(React.PropTypes.string)
	]),
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	placeholder: React.PropTypes.string,
	autocomplete: React.PropTypes.bool,
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	react: React.PropTypes.object
};

// Default props value
DataSearch.defaultProps = {
	placeholder: "Search",
	autocomplete: true
};

// context type
DataSearch.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};

DataSearch.types = {
	componentId: TYPES.STRING,
	appbaseField: TYPES.STRING,
	react: TYPES.OBJECT,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	autocomplete: TYPES.BOOLEAN,
	defaultSelected: TYPES.STRING,
	customQuery: TYPES.FUNCTION
};
