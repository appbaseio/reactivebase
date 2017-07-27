import _get from "lodash/get";
import _has from "lodash/has";
import _isEqual from "lodash/isEqual";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import classNames from "classnames";
import manager from "../middleware/ChannelManager";
import * as TYPES from "../middleware/constants";


var helper = require("../middleware/helper");

var DataSearch = function (_Component) {
	_inherits(DataSearch, _Component);

	function DataSearch(props) {
		_classCallCheck(this, DataSearch);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {
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
		_this.type = "match_phrase";
		_this.searchInputId = "internal-" + _this.props.componentId;
		_this.channelId = null;
		_this.channelListener = null;
		_this.fieldType = _typeof(_this.props.appbaseField);
		_this.handleSearch = _this.handleSearch.bind(_this);
		_this.handleInputChange = _this.handleInputChange.bind(_this);
		_this.setValue = _this.setValue.bind(_this);
		_this.onInputChange = _this.onInputChange.bind(_this);
		_this.onSuggestionSelected = _this.onSuggestionSelected.bind(_this);
		_this.handleBlur = _this.handleBlur.bind(_this);
		_this.handleKeyPress = _this.handleKeyPress.bind(_this);
		_this.defaultSearchQuery = _this.defaultSearchQuery.bind(_this);
		_this.previousSelectedSensor = {};
		_this.urlParams = helper.URLParams.get(_this.props.componentId);
		return _this;
	}

	// Get the items from Appbase when component is mounted


	DataSearch.prototype.componentWillMount = function componentWillMount() {
		this.setReact(this.props);
		this.setQueryInfo();
		this.createChannel();
		this.checkDefault();
		this.listenFilter();
	};

	DataSearch.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
		if (!_isEqual(this.props.react, nextProps.react)) {
			this.setReact(nextProps);
			manager.update(this.channelId, this.react, null, null, false);
		}

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.changeValue(nextProps.defaultSelected);
		} else if (nextProps.customQuery) {
			if (this.props.customQuery) {
				if (!_isEqual(nextProps.customQuery(this.state.currentValue), this.props.customQuery(this.state.currentValue))) {
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
	};

	// stop streaming request and remove listener when component will unmount


	DataSearch.prototype.componentWillUnmount = function componentWillUnmount() {
		if (this.channelId) {
			manager.stopStream(this.channelId);
		}
		if (this.channelListener) {
			this.channelListener.remove();
		}
		if (this.filterListener) {
			this.filterListener.remove();
		}
	};

	DataSearch.prototype.listenFilter = function listenFilter() {
		var _this2 = this;

		this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
			if (data === _this2.props.componentId) {
				_this2.defaultValue = "";
				_this2.changeValue(_this2.defaultValue);
			}
		});
	};

	DataSearch.prototype.highlightQuery = function highlightQuery() {
		var fields = {};
		var highlightField = this.props.highlightField ? this.props.highlightField : this.props.appbaseField;
		if (typeof highlightField === "string") {
			fields[highlightField] = {};
		} else if (Array.isArray(highlightField)) {
			highlightField.forEach(function (item) {
				fields[item] = {};
			});
		}
		return {
			highlight: {
				pre_tags: ["<span class=\"rbc-highlight\">"],
				post_tags: ["</span>"],
				fields: fields
			}
		};
	};

	// set the query type and input data


	DataSearch.prototype.setQueryInfo = function setQueryInfo() {
		var obj = {
			key: this.props.componentId,
			value: {
				queryType: this.type,
				inputData: this.props.appbaseField,
				customQuery: this.props.customQuery ? this.props.customQuery : this.defaultSearchQuery,
				reactiveId: this.context.reactiveId,
				showFilter: this.props.showFilter,
				filterLabel: this.props.filterLabel ? this.props.filterLabel : this.props.componentId,
				component: "DataSearch",
				defaultSelected: this.urlParams !== null ? this.urlParams : this.props.defaultSelected
			}
		};
		if (this.props.highlight) {
			obj.value.externalQuery = this.highlightQuery();
		}
		helper.selectedSensor.setSensorInfo(obj);
		var searchObj = {
			key: this.searchInputId,
			value: {
				queryType: "multi_match",
				inputData: this.props.appbaseField,
				customQuery: this.defaultSearchQuery,
				component: "DataSearchInternal"
			}
		};
		helper.selectedSensor.setSensorInfo(searchObj);
	};

	// set value to search


	DataSearch.prototype.setValue = function setValue(value) {
		var obj = {
			key: this.searchInputId,
			value: value
		};
		this.defaultSelected = value;
		helper.URLParams.update(this.props.componentId, value, this.props.URLParams);
		helper.selectedSensor.set(obj, true);
		if (value && value.trim() !== "") {
			this.setState({
				options: [{
					label: value,
					value: value
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

	DataSearch.prototype.getValue = function getValue(field, hit) {
		var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		var val = void 0;
		if (_has(hit, field)) {
			val = hit[field];
		} else if (field.indexOf(".") > -1) {
			var prefix = "";
			var fieldSplit = field.split(".");
			fieldSplit.forEach(function (item, index) {
				prefix += item;
				if (Array.isArray(_get(hit, prefix))) {
					prefix += "[" + index + "]";
				}
				if (fieldSplit.length - 1 !== index) {
					prefix += ".";
				} else {
					val = _get(hit, prefix);
				}
			});
		}
		return val;
	};

	// Search results often contain duplicate results, so display only unique values


	DataSearch.prototype.removeDuplicates = function removeDuplicates(myArr, prop) {
		return myArr.filter(function (obj, pos, arr) {
			return arr.map(function (mapObj) {
				return mapObj[prop];
			}).indexOf(obj[prop]) === pos;
		});
	};

	// set data after get the result


	DataSearch.prototype.setData = function setData(data) {
		var _this3 = this;

		var options = [];
		var appbaseField = Array.isArray(this.props.appbaseField) ? this.props.appbaseField : [this.props.appbaseField];
		data.hits.hits.map(function (hit) {
			if (_this3.fieldType === "string") {
				var tempField = _this3.getValue(_this3.props.appbaseField.trim(), hit._source);
				options.push({ value: tempField, label: tempField });
			} else if (_this3.fieldType === "object") {
				_this3.props.appbaseField.map(function (field) {
					var tempField = _this3.getValue(field, hit._source);
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
			options: options,
			isLoadingOptions: false
		});
	};

	// default query


	DataSearch.prototype.defaultSearchQuery = function defaultSearchQuery(value) {
		var finalQuery = null,
		    fields = void 0;
		if (value) {
			if (this.fieldType === "string") {
				fields = [this.props.appbaseField];
			} else {
				fields = this.props.appbaseField;
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
			};
		}

		return finalQuery;
	};

	DataSearch.prototype.shouldQuery = function shouldQuery(value, appbaseFields) {
		var _this4 = this;

		var fields = appbaseFields.map(function (field, index) {
			return "" + field + (Array.isArray(_this4.props.weights) && _this4.props.weights[index] ? "^" + _this4.props.weights[index] : "");
		});

		if (this.props.queryFormat === "and") {
			return [{
				multi_match: {
					query: value,
					fields: fields,
					type: "cross_fields",
					operator: "and",
					fuzziness: this.props.fuzziness ? this.props.fuzziness : 0
				}
			}, {
				multi_match: {
					query: value,
					fields: fields,
					type: "phrase_prefix",
					operator: "and"
				}
			}];
		}

		return [{
			multi_match: {
				query: value,
				fields: fields,
				type: "best_fields",
				operator: "or",
				fuzziness: this.props.fuzziness ? this.props.fuzziness : 0
			}
		}, {
			multi_match: {
				query: value,
				fields: fields,
				type: "phrase_prefix",
				operator: "or"
			}
		}];
	};

	DataSearch.prototype.setReact = function setReact(props) {
		var react = Object.assign({}, props.react);
		var reactAnd = [this.searchInputId];
		this.react = helper.setupReact(react, reactAnd);
	};

	// Create a channel which passes the react and receive results whenever react changes


	DataSearch.prototype.createChannel = function createChannel() {
		var _this5 = this;

		var channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
			var data = res.data;
			var rawData = void 0;
			if (res.mode === "streaming") {
				rawData = _this5.state.rawData;
				rawData.hits.hits.push(res.data);
			} else if (res.mode === "historic") {
				rawData = data;
			}
			_this5.setState({
				rawData: rawData
			});
			if (_this5.props.autoSuggest) {
				_this5.setData(rawData);
			}
		});
	};

	DataSearch.prototype.checkDefault = function checkDefault() {
		this.defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
		this.changeValue(this.defaultValue);
	};

	DataSearch.prototype.changeValue = function changeValue(defaultValue) {
		if (this.defaultSelected != defaultValue) {
			this.defaultSelected = defaultValue;
			setTimeout(this.setValue.bind(this, this.defaultSelected), 100);
			this.handleSearch({
				value: this.defaultSelected
			});
		}
	};

	// When user has selected a search value


	DataSearch.prototype.handleSearch = function handleSearch(currentValue) {
		var value = currentValue ? currentValue.value : null;
		value = value === "null" ? null : value;
		var obj = {
			key: this.props.componentId,
			value: value
		};
		helper.URLParams.update(this.props.componentId, value, this.props.URLParams);
		helper.selectedSensor.set(obj, true);
		this.setState({
			currentValue: value
		});
	};

	DataSearch.prototype.handleInputChange = function handleInputChange(event) {
		var inputVal = event.target.value;
		this.setState({
			currentValue: inputVal
		});
		var obj = {
			key: this.props.componentId,
			value: inputVal
		};
		if (this.props.onValueChange) {
			this.props.onValueChange(obj.value);
		}
		// pass the selected sensor value with componentId as key,
		var isExecuteQuery = true;
		helper.URLParams.update(this.props.componentId, inputVal, this.props.URLParams);
		helper.selectedSensor.set(obj, isExecuteQuery);
	};

	DataSearch.prototype.handleBlur = function handleBlur(event, _ref) {
		var highlightedSuggestion = _ref.highlightedSuggestion;

		if (!highlightedSuggestion || !highlightedSuggestion.label) {
			this.handleSearch({
				value: this.state.currentValue
			});
		}
	};

	DataSearch.prototype.handleKeyPress = function handleKeyPress(event) {
		if (event.key === "Enter") {
			event.target.blur();
		}
	};

	DataSearch.prototype.onInputChange = function onInputChange(event, _ref2) {
		var method = _ref2.method,
		    newValue = _ref2.newValue;

		if (method === "type") {
			this.setValue(newValue);
		}
	};

	DataSearch.prototype.onSuggestionSelected = function onSuggestionSelected(event, _ref3) {
		var suggestion = _ref3.suggestion;

		this.handleSearch(suggestion);
	};

	DataSearch.prototype.getSuggestionValue = function getSuggestionValue(suggestion) {
		return suggestion.label.innerText || suggestion.label;
	};

	DataSearch.prototype.renderSuggestion = function renderSuggestion(suggestion) {
		return React.createElement(
			"span",
			null,
			suggestion.label
		);
	};

	DataSearch.prototype.render = function render() {
		var title = null;
		if (this.props.title) {
			title = React.createElement(
				"h4",
				{ className: "rbc-title col s12 col-xs-12" },
				this.props.title
			);
		}
		var cx = classNames({
			"rbc-title-active": this.props.title,
			"rbc-title-inactive": !this.props.title,
			"rbc-placeholder-active": this.props.placeholder,
			"rbc-placeholder-inactive": !this.props.placeholder,
			"rbc-autoSuggest-active": this.props.autoSuggest,
			"rbc-autoSuggest-inactive": !this.props.autoSuggest
		});

		var options = this.state.currentValue === "" || this.state.currentValue === null ? this.props.initialSuggestions && this.props.initialSuggestions.length ? this.props.initialSuggestions : [] : this.state.options;

		return React.createElement(
			"div",
			{ className: "rbc rbc-datasearch col s12 col-xs-12 card thumbnail " + cx + " " + (this.state.isLoadingOptions ? "is-loading" : ""), style: this.props.componentStyle },
			title,
			this.props.autoSuggest ? React.createElement(Autosuggest, {
				suggestions: options,
				onSuggestionsFetchRequested: function onSuggestionsFetchRequested() {},
				onSuggestionsClearRequested: function onSuggestionsClearRequested() {},
				onSuggestionSelected: this.onSuggestionSelected,
				getSuggestionValue: this.getSuggestionValue,
				renderSuggestion: this.renderSuggestion,
				shouldRenderSuggestions: function shouldRenderSuggestions() {
					return true;
				},
				focusInputOnSuggestionClick: false,
				inputProps: {
					placeholder: this.props.placeholder,
					value: this.state.currentValue === null ? "" : this.state.currentValue,
					onChange: this.onInputChange,
					onBlur: this.handleBlur,
					onKeyPress: this.handleKeyPress
				}
			}) : React.createElement(
				"div",
				{ className: "rbc-search-container col s12 col-xs-12" },
				React.createElement("input", {
					type: "text",
					className: "rbc-input",
					placeholder: this.props.placeholder,
					value: this.state.currentValue ? this.state.currentValue : "",
					onChange: this.handleInputChange
				})
			)
		);
	};

	return DataSearch;
}(Component);

export default DataSearch;


DataSearch.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	appbaseField: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]),
	weights: React.PropTypes.arrayOf(React.PropTypes.number),
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	placeholder: React.PropTypes.string,
	autoSuggest: React.PropTypes.bool,
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	react: React.PropTypes.object,
	initialSuggestions: React.PropTypes.arrayOf(React.PropTypes.shape({
		label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
		value: React.PropTypes.string
	})),
	componentStyle: React.PropTypes.object,
	highlight: React.PropTypes.bool,
	highlightField: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]),
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	queryFormat: React.PropTypes.oneOf(["and", "or"]),
	fuzziness: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
};

// Default props value
DataSearch.defaultProps = {
	placeholder: "Search",
	autoSuggest: true,
	componentStyle: {},
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
	appbaseField: TYPES.STRING,
	appbaseFieldType: TYPES.STRING,
	react: TYPES.OBJECT,
	title: TYPES.STRING,
	placeholder: TYPES.STRING,
	autoSuggest: TYPES.BOOLEAN,
	defaultSelected: TYPES.STRING,
	customQuery: TYPES.FUNCTION,
	componentStyle: TYPES.OBJECT,
	highlight: TYPES.BOOLEAN,
	highlightField: TYPES.STRING,
	URLParams: TYPES.BOOLEAN,
	showFilter: TYPES.BOOLEAN,
	filterLabel: TYPES.STRING,
	weights: TYPES.ARRAY,
	queryFormat: TYPES.STRING,
	fuzziness: TYPES.NUMBER
};