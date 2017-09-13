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
		_this.fieldType = _typeof(_this.props.dataField);
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
		this.previousQuery = null; // initial value for onQueryChange
		this.setReact(this.props);
		this.setQueryInfo(this.props);
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

		if (this.props.highlight !== nextProps.highlight || this.props.showFilter !== nextProps.showFilter || this.props.filterLabel !== nextProps.filterLabel) {
			this.setQueryInfo(nextProps);
			this.handleSearch({
				value: this.state.currentValue
			});
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

	DataSearch.prototype.highlightQuery = function highlightQuery(props) {
		var fields = {};
		var highlightField = props.highlightField ? props.highlightField : props.dataField;
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


	DataSearch.prototype.setQueryInfo = function setQueryInfo(props) {
		var _this3 = this;

		var getQuery = function getQuery(value) {
			var currentQuery = props.customQuery ? props.customQuery(value) : _this3.defaultSearchQuery(value);
			if (_this3.props.onQueryChange && JSON.stringify(_this3.previousQuery) !== JSON.stringify(currentQuery)) {
				_this3.props.onQueryChange(_this3.previousQuery, currentQuery);
			}
			_this3.previousQuery = currentQuery;
			return currentQuery;
		};
		var obj = {
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
		var searchObj = {
			key: this.searchInputId,
			value: {
				queryType: "multi_match",
				inputData: props.dataField,
				customQuery: this.defaultSearchQuery,
				component: "DataSearchInternal"
			}
		};
		helper.selectedSensor.setSensorInfo(searchObj);
	};

	// set value to search


	DataSearch.prototype.setValue = function setValue(value) {
		var _this4 = this;

		var obj = {
			key: this.searchInputId,
			value: value
		};

		var nextValue = obj.value ? obj.value : null;

		var execQuery = function execQuery() {
			if (_this4.props.onValueChange) {
				_this4.props.onValueChange(nextValue);
			}

			_this4.defaultSelected = value;
			helper.URLParams.update(_this4.props.componentId, value, _this4.props.URLParams);
			helper.selectedSensor.set(obj, true);

			if (value && value.trim() !== "") {
				_this4.setState({
					options: [{
						label: value,
						value: value
					}],
					isLoadingOptions: true,
					currentValue: value
				});
			} else {
				_this4.setState({
					options: [],
					isLoadingOptions: false,
					currentValue: value
				});
			}
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(nextValue).then(function () {
				execQuery();
			}).catch(function (e) {
				console.warn(_this4.props.componentId + " - beforeValueChange rejected the promise with", e);
			});
		} else {
			execQuery();
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
		var _this5 = this;

		var options = [];
		var dataField = Array.isArray(this.props.dataField) ? this.props.dataField : [this.props.dataField];
		data.hits.hits.map(function (hit) {
			if (_this5.fieldType === "string") {
				var tempField = _this5.getValue(_this5.props.dataField.trim(), hit._source);
				options.push({ value: tempField, label: tempField });
			} else if (_this5.fieldType === "object") {
				_this5.props.dataField.map(function (field) {
					var tempField = _this5.getValue(field, hit._source);
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
			};
		}

		return finalQuery;
	};

	DataSearch.prototype.shouldQuery = function shouldQuery(value, dataFields) {
		var _this6 = this;

		var fields = dataFields.map(function (field, index) {
			return "" + field + (Array.isArray(_this6.props.searchWeight) && _this6.props.searchWeight[index] ? "^" + _this6.props.searchWeight[index] : "");
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
		var _this7 = this;

		var channelObj = manager.create(this.context.appbaseRef, this.context.type, this.react, 100, 0, false, this.props.componentId);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
			var data = res.data;
			var rawData = void 0;
			if (res.mode === "streaming") {
				rawData = _this7.state.rawData;
				rawData.hits.hits.push(res.data);
			} else if (res.mode === "historic") {
				rawData = data;
			}
			_this7.setState({
				rawData: rawData
			});
			if (_this7.props.autoSuggest) {
				_this7.setData(rawData);
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
		var _this8 = this;

		var value = currentValue ? currentValue.value : null;
		value = value === "null" ? null : value;

		var obj = {
			key: this.props.componentId,
			value: value
		};

		var nextValue = obj.value ? obj.value : null;

		var execQuery = function execQuery() {
			if (_this8.props.onValueChange) {
				_this8.props.onValueChange(nextValue);
			}

			helper.URLParams.update(_this8.props.componentId, value, _this8.props.URLParams);
			helper.selectedSensor.set(obj, true);
			_this8.setState({
				currentValue: value
			});
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(nextValue).then(function () {
				execQuery();
			}).catch(function (e) {
				console.warn(_this8.props.componentId + " - beforeValueChange rejected the promise with", e);
			});
		} else {
			execQuery();
		}
	};

	DataSearch.prototype.handleInputChange = function handleInputChange(event) {
		var _this9 = this;

		var inputVal = event.target.value;
		this.setState({
			currentValue: inputVal
		});
		var obj = {
			key: this.props.componentId,
			value: inputVal
		};

		var execQuery = function execQuery() {
			if (_this9.props.onValueChange) {
				_this9.props.onValueChange(obj.value);
			}
			// pass the selected sensor value with componentId as key,
			var isExecuteQuery = true;
			helper.URLParams.update(_this9.props.componentId, inputVal, _this9.props.URLParams);
			helper.selectedSensor.set(obj, isExecuteQuery);
		};

		if (this.props.beforeValueChange) {
			this.props.beforeValueChange(obj.value).then(function () {
				execQuery();
			}).catch(function (e) {
				console.warn(_this9.props.componentId + " - beforeValueChange rejected the promise with", e);
			});
		} else {
			execQuery();
		}
	};

	DataSearch.prototype.handleBlur = function handleBlur(event, _ref) {
		var highlightedSuggestion = _ref.highlightedSuggestion;

		if (!highlightedSuggestion || !highlightedSuggestion.label) {
			this.handleSearch({
				value: this.state.currentValue
			});
		}
		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
	};

	DataSearch.prototype.handleKeyPress = function handleKeyPress(event) {
		if (event.key === "Enter") {
			event.target.blur();
		}
		if (this.props.onKeyPress) {
			this.props.onKeyPress(event);
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
		}, this.props.className);

		var options = this.state.currentValue === "" || this.state.currentValue === null ? this.props.defaultSuggestions && this.props.defaultSuggestions.length ? this.props.defaultSuggestions : [] : this.state.options;

		return React.createElement(
			"div",
			{ className: "rbc rbc-datasearch col s12 col-xs-12 card thumbnail " + cx + " " + (this.state.isLoadingOptions ? "is-loading" : ""), style: this.props.style },
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
					onKeyPress: this.handleKeyPress,
					onFocus: this.props.onFocus,
					onKeyDown: this.props.onKeyDown,
					onKeyUp: this.props.onKeyUp
				}
			}) : React.createElement(
				"div",
				{ className: "rbc-search-container col s12 col-xs-12" },
				React.createElement("input", {
					type: "text",
					className: "rbc-input",
					placeholder: this.props.placeholder,
					value: this.state.currentValue ? this.state.currentValue : "",
					onChange: this.handleInputChange,
					onBlur: this.props.onBlur,
					onFocus: this.props.onFocus,
					onKeyPress: this.props.onKeyPress,
					onKeyDown: this.props.onKeyDown,
					onKeyUp: this.props.onKeyUp
				})
			)
		);
	};

	return DataSearch;
}(Component);

export default DataSearch;


DataSearch.propTypes = {
	componentId: React.PropTypes.string.isRequired,
	dataField: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]),
	searchWeight: React.PropTypes.arrayOf(React.PropTypes.number),
	title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
	placeholder: React.PropTypes.string,
	autoSuggest: React.PropTypes.bool,
	defaultSelected: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	onQueryChange: React.PropTypes.func,
	onValueChange: React.PropTypes.func,
	beforeValueChange: React.PropTypes.func,
	react: React.PropTypes.object,
	defaultSuggestions: React.PropTypes.arrayOf(React.PropTypes.shape({
		label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
		value: React.PropTypes.string
	})),
	style: React.PropTypes.object,
	highlight: React.PropTypes.bool,
	highlightField: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]),
	URLParams: React.PropTypes.bool,
	showFilter: React.PropTypes.bool,
	filterLabel: React.PropTypes.string,
	queryFormat: React.PropTypes.oneOf(["and", "or"]),
	fuzziness: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
	className: React.PropTypes.string,
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
	className: TYPES.STRING,
	onBlur: TYPES.FUNCTION,
	onFocus: TYPES.FUNCTION,
	onKeyPress: TYPES.FUNCTION,
	onKeyDown: TYPES.FUNCTION,
	onKeyUp: TYPES.FUNCTION
};