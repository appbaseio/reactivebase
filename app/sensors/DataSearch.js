import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import * as TYPES from "../middleware/constants";
import _ from "lodash";

const helper = require("../middleware/helper");

export default class DataSearch extends Component {
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
		this.fieldType = typeof this.props.dataField;
		this.handleSearch = this.handleSearch.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.setValue = this.setValue.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.defaultSearchQuery = this.defaultSearchQuery.bind(this);
		this.previousSelectedSensor = {};
		this.urlParams = helper.URLParams.get(this.props.componentId);
	}

	// Get the items from Appbase when component is mounted
	componentWillMount() {
		this.previousQuery = null;	// initial value for onQueryChange
		this.setReact(this.props);
		this.setQueryInfo(this.props);
		this.createChannel();
		this.checkDefault();
		this.listenFilter();
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(this.props.react, nextProps.react)) {
			this.setReact(nextProps);
			manager.update(this.channelId, this.react, null, null, false);
		}

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.changeValue(nextProps.defaultSelected);
		} else if (nextProps.customQuery) {
			if (this.props.customQuery) {
				if (!_.isEqual(nextProps.customQuery(this.state.currentValue), this.props.customQuery(this.state.currentValue))) {
					this.handleSearch({
						value: this.state.currentValue
					});
				}
			} else {
				this.handleSearch({
					value: this.state.currentValue
				});
			}
		}

		if (
				this.props.highlight !== nextProps.highlight ||
				this.props.showFilter !== nextProps.showFilter ||
				this.props.filterLabel !== nextProps.filterLabel
			) {
			this.setQueryInfo(nextProps);
			this.handleSearch({
				value: this.state.currentValue
			});
		}
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if(this.filterListener) {
			this.filterListener.remove();
		}
	}

	listenFilter() {
		this.filterListener = helper.sensorEmitter.addListener("clearFilter", (data) => {
			if(data === this.props.componentId) {
				this.defaultValue = "";
				this.changeValue(this.defaultValue);
			}
		});
	}

	highlightQuery(props) {
		const fields = {};
		const highlightField = props.highlightField ? props.highlightField : props.dataField;
		if (typeof highlightField === "string") {
			fields[highlightField] = {};
		} else if (Array.isArray(highlightField)) {
			highlightField.forEach((item) => {
				fields[item] = {};
			});
		}
		return {
			highlight: {
				pre_tags: ["<span class=\"rbc-highlight\">"],
				post_tags: ["</span>"],
				fields
			}
		};
	}

	// set the query type and input data
	setQueryInfo(props) {
		const getQuery = (value) => {
			const currentQuery = props.customQuery ? props.customQuery(value) : this.defaultSearchQuery(value);
			if (this.props.onQueryChange && JSON.stringify(this.previousQuery) !== JSON.stringify(currentQuery)) {
				this.props.onQueryChange(this.previousQuery, currentQuery);
			}
			this.previousQuery = currentQuery;
			return currentQuery;
		};
		const obj = {
			key: props.componentId,
			value: {
				queryType: this.type,
				inputData: props.dataField,
				customQuery: getQuery,
				reactiveId: this.context.reactiveId,
				showFilter: props.showFilter,
				filterLabel: props.filterLabel ? props.filterLabel : props.componentId,
				component: "DataSearch",
				defaultSelected: this.urlParams !== null ? this.urlParams : props.defaultSelected
			}
		};
		if (props.highlight) {
			obj.value.externalQuery = this.highlightQuery(props);
		}
		helper.selectedSensor.setSensorInfo(obj);
		const searchObj = {
			key: this.searchInputId,
			value: {
				queryType: "multi_match",
				inputData: props.dataField,
				customQuery: this.defaultSearchQuery,
				component: "DataSearchInternal"
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

		const nextValue = obj.value ? obj.value : null;

		const execQuery = () => {
			if (this.props.onValueChange) {
				this.props.onValueChange(nextValue);
			}

			this.defaultSelected = value;
			helper.URLParams.update(this.props.componentId, value, this.props.URLParams);
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
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(nextValue)
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

	getValue(field, hit, index = 0) {
		let val;
		if (_.has(hit, field)) {
			val = hit[field];
		} else if (field.indexOf(".") > -1) {
			let prefix = "";
			const fieldSplit = field.split(".");
			fieldSplit.forEach((item, index) => {
				prefix += item;
				if (Array.isArray(_.get(hit, prefix))) {
					prefix += `[${index}]`;
				}
				if (fieldSplit.length - 1 !== index) {
					prefix += ".";
				} else {
					val = _.get(hit, prefix);
				}
			});
		}
		return val;
	}

	// Search results often contain duplicate results, so display only unique values
	removeDuplicates(myArr, prop) {
		return myArr.filter((obj, pos, arr) => arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos);
	}

	// set data after get the result
	setData(data) {
		let options = [];
		const dataField = Array.isArray(this.props.dataField) ? this.props.dataField : [this.props.dataField];
		data.hits.hits.map((hit) => {
			if (this.fieldType === "string") {
				const tempField = this.getValue(this.props.dataField.trim(), hit._source);
				options.push({ value: tempField, label: tempField });
			} else if (this.fieldType === "object") {
				this.props.dataField.map((field) => {
					const tempField = this.getValue(field, hit._source);
					if (tempField) {
						options.push({ value: tempField, label: tempField });
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
		let finalQuery = null,
			fields;
		if (value) {
			if (this.fieldType === "string") {
				fields = [this.props.dataField];
			} else {
				fields = this.props.dataField;
			}
			finalQuery = {
				bool: {
					should: this.shouldQuery(value, fields),
					minimum_should_match: "1"
				}
			};
		}

		if (value === "") {
			finalQuery = {
				"match_all": {}
			}
		}

		return finalQuery;
	}

	shouldQuery(value, dataFields) {
		const fields = dataFields.map(
			(field, index) => `${field}${(Array.isArray(this.props.searchWeight) && this.props.searchWeight[index]) ? ("^" + this.props.searchWeight[index]) : ""}`
		);

		if (this.props.queryFormat === "and") {
			return [
				{
					multi_match: {
						query: value,
						fields,
						type: "cross_fields",
						operator: "and",
						fuzziness: this.props.fuzziness ? this.props.fuzziness : 0
					}
				},
				{
					multi_match: {
						query: value,
						fields,
						type: "phrase_prefix",
						operator: "and"
					}
				}
			];
		}

		return [
			{
				multi_match: {
					query: value,
					fields,
					type: "best_fields",
					operator: "or",
					fuzziness: this.props.fuzziness ? this.props.fuzziness : 0
				}
			},
			{
				multi_match: {
					query: value,
					fields,
					type: "phrase_prefix",
					operator: "or"
				}
			}
		];
	}

	setReact(props) {
		const react = Object.assign({}, props.react);
		const reactAnd = [this.searchInputId];
		this.react = helper.setupReact(react, reactAnd);
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		const channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
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
			if (this.props.autoSuggest) {
				this.setData(rawData);
			}
		});
	}

	checkDefault() {
		this.defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		this.changeValue(this.defaultValue);
	}

	changeValue(defaultValue) {
		if (this.defaultSelected != defaultValue) {
			this.defaultSelected = defaultValue;
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

		const nextValue = obj.value ? obj.value : null;

		const execQuery = () => {
			if (this.props.onValueChange) {
				this.props.onValueChange(nextValue);
			}

			helper.URLParams.update(this.props.componentId, value, this.props.URLParams);
			helper.selectedSensor.set(obj, true);
			this.setState({
				currentValue: value
			});
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(nextValue)
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

	handleInputChange(event) {
		const inputVal = event.target.value;
		this.setState({
			currentValue: inputVal
		});
		const obj = {
			key: this.props.componentId,
			value: inputVal
		};

		const execQuery = () => {
			if (this.props.onValueChange) {
				this.props.onValueChange(obj.value);
			}
			// pass the selected sensor value with componentId as key,
			const isExecuteQuery = true;
			helper.URLParams.update(this.props.componentId, inputVal, this.props.URLParams);
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

	handleBlur(event, { highlightedSuggestion }) {
		if (!highlightedSuggestion || !highlightedSuggestion.label) {
			this.handleSearch({
				value: this.state.currentValue
			});
		}
	}

	handleKeyPress(event) {
		if (event.key === "Enter") {
			event.target.blur();
		}
	}

	onInputChange(event, { method, newValue }) {
		if (method === "type") {
			this.setValue(newValue);
		}
	}

	onSuggestionSelected(event, { suggestion }) {
		this.handleSearch(suggestion);
	}

	getSuggestionValue(suggestion) {
		return suggestion.label.innerText || suggestion.label;
	}

	renderSuggestion(suggestion) {
		return <span>{suggestion.label}</span>
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
			"rbc-autoSuggest-active": this.props.autoSuggest,
			"rbc-autoSuggest-inactive": !this.props.autoSuggest
		});

		const options = this.state.currentValue === "" || this.state.currentValue === null
							? this.props.defaultSuggestions && this.props.defaultSuggestions.length
							? this.props.defaultSuggestions
							: []
							: this.state.options;

		return (
			<div className={`rbc rbc-datasearch col s12 col-xs-12 card thumbnail ${cx} ${this.state.isLoadingOptions ? "is-loading" : ""}`} style={this.props.style}>
				{title}
				{
					this.props.autoSuggest ?
						<Autosuggest
							suggestions={options}
							onSuggestionsFetchRequested={() => {}}
							onSuggestionsClearRequested={() => {}}
							onSuggestionSelected={this.onSuggestionSelected}
							getSuggestionValue={this.getSuggestionValue}
							renderSuggestion={this.renderSuggestion}
							shouldRenderSuggestions={() => true}
							focusInputOnSuggestionClick={false}
							inputProps={{
								placeholder: this.props.placeholder,
								value: this.state.currentValue === null ? "" : this.state.currentValue,
								onChange: this.onInputChange,
								onBlur: this.handleBlur,
								onKeyPress: this.handleKeyPress
							}}
						/> :
						<div className="rbc-search-container col s12 col-xs-12">
							<input
								type="text"
								className="rbc-input"
								placeholder={this.props.placeholder}
								value={this.state.currentValue ? this.state.currentValue : ""}
								onChange={this.handleInputChange}
								onBlur={this.props.onBlur}
								onFocus={this.props.onFocus}
								onKeyPress={this.props.onKeyPress}
								onKeyDown={this.props.onKeyDown}
								onKeyUp={this.props.onKeyUp}
							/>
						</div>
				}
			</div>
		);
	}
}

DataSearch.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.arrayOf(React.PropTypes.string)
	]),
	searchWeight: React.PropTypes.arrayOf(React.PropTypes.number),
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	placeholder: React.PropTypes.string,
	autoSuggest: React.PropTypes.bool,
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	onQueryChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	react: React.PropTypes.object,
	defaultSuggestions: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			label: React.PropTypes.oneOfType([
				React.PropTypes.string,
				React.PropTypes.element
			]),
			value: React.PropTypes.string
		})
	),
	style: React.PropTypes.object,
	highlight: React.PropTypes.bool,
	highlightField: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.arrayOf(React.PropTypes.string)
	]),
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	queryFormat: React.PropTypes.oneOf(["and", "or"]),
	fuzziness: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
	]),
	onBlur: React.PropTypes.func,
	onFocus: React.PropTypes.func,
	onKeyPress: React.PropTypes.func,
	onKeyDown: React.PropTypes.func,
	onKeyUp: React.PropTypes.func
};

// Default props value
DataSearch.defaultProps = {
	placeholder: "Search",
	autoSuggest: true,
	style: {},
	highlight: false,
	URLParams: false,
	showFilter: true,
	queryFormat: "or"
};

// context type
DataSearch.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired,
	reactiveId: React.PropTypes.number
};

DataSearch.types = {
	componentId: TYPES.STRING,
	dataField: TYPES.STRING,
	dataFieldType: TYPES.STRING,
	react: TYPES.OBJECT,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	autoSuggest: TYPES.BOOLEAN,
	defaultSelected: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	style: TYPES.OBJECT,
	highlight: TYPES.BOOLEAN,
	highlightField: TYPES.STRING,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	searchWeight: TYPES.ARRAY,
	queryFormat: TYPES.STRING,
	fuzziness: TYPES.NUMBER,
	onBlur: TYPES.FUNCTION,
	onFocus: TYPES.FUNCTION,
	onKeyPress: TYPES.FUNCTION,
	onKeyDown: TYPES.FUNCTION,
	onKeyUp: TYPES.FUNCTION
};
