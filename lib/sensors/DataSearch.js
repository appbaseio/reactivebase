"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactAutosuggest = require("react-autosuggest");

var _reactAutosuggest2 = _interopRequireDefault(_reactAutosuggest);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require("../middleware/ChannelManager");

var _ChannelManager2 = _interopRequireDefault(_ChannelManager);

var _constants = require("../middleware/constants");

var TYPES = _interopRequireWildcard(_constants);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require("../middleware/helper");

var DataSearch = function (_Component) {
	_inherits(DataSearch, _Component);

	function DataSearch(props) {
		_classCallCheck(this, DataSearch);

		var _this = _possibleConstructorReturn(this, (DataSearch.__proto__ || Object.getPrototypeOf(DataSearch)).call(this, props));

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
		_this.clearSuggestions = _this.clearSuggestions.bind(_this);
		_this.handleBlur = _this.handleBlur.bind(_this);
		_this.handleKeyPress = _this.handleKeyPress.bind(_this);
		_this.defaultSearchQuery = _this.defaultSearchQuery.bind(_this);
		_this.previousSelectedSensor = {};
		_this.urlParams = helper.URLParams.get(_this.props.componentId);
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(DataSearch, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.setQueryInfo();
			this.createChannel();
			this.checkDefault();
			this.listenFilter();
		}
	}, {
		key: "componentWillUpdate",
		value: function componentWillUpdate() {
			this.checkDefault();
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			if (this.channelId) {
				_ChannelManager2.default.stopStream(this.channelId);
			}
			if (this.channelListener) {
				this.channelListener.remove();
			}
			if (this.filterListener) {
				this.filterListener.remove();
			}
		}
	}, {
		key: "listenFilter",
		value: function listenFilter() {
			var _this2 = this;

			this.filterListener = helper.sensorEmitter.addListener("clearFilter", function (data) {
				if (data === _this2.props.componentId) {
					_this2.defaultValue = "";
					_this2.changeValue(_this2.defaultValue);
				}
			});
		}
	}, {
		key: "highlightQuery",
		value: function highlightQuery() {
			var fields = {};
			var highlightFields = this.props.highlightFields ? this.props.highlightFields : this.props.appbaseField;
			if (typeof highlightFields === "string") {
				fields[highlightFields] = {};
			} else if (_lodash2.default.isArray(highlightFields)) {
				highlightFields.forEach(function (item) {
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
		}

		// set the query type and input data

	}, {
		key: "setQueryInfo",
		value: function setQueryInfo() {
			var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField,
					customQuery: this.props.customQuery ? this.props.customQuery : this.defaultSearchQuery
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
					customQuery: this.defaultSearchQuery
				}
			};
			helper.selectedSensor.setSensorInfo(searchObj);
		}

		// set value to search

	}, {
		key: "setValue",
		value: function setValue(value) {
			var obj = {
				key: this.searchInputId,
				value: value
			};
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
		}
	}, {
		key: "getValue",
		value: function getValue(field, hit) {
			var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

			var val = void 0;
			if (_lodash2.default.has(hit, field)) {
				val = hit[field];
			} else if (field.indexOf(".") > -1) {
				var prefix = "";
				var fieldSplit = field.split(".");
				fieldSplit.forEach(function (item, index) {
					prefix += item;
					if (_lodash2.default.isArray(_lodash2.default.get(hit, prefix))) {
						prefix += "[" + index + "]";
					}
					if (fieldSplit.length - 1 !== index) {
						prefix += ".";
					} else {
						val = _lodash2.default.get(hit, prefix);
					}
				});
			}
			return val;
		}

		// Search results often contain duplicate results, so display only unique values

	}, {
		key: "removeDuplicates",
		value: function removeDuplicates(myArr, prop) {
			return myArr.filter(function (obj, pos, arr) {
				return arr.map(function (mapObj) {
					return mapObj[prop];
				}).indexOf(obj[prop]) === pos;
			});
		}

		// set data after get the result

	}, {
		key: "setData",
		value: function setData(data) {
			var _this3 = this;

			var options = [];
			var appbaseField = _lodash2.default.isArray(this.props.appbaseField) ? this.props.appbaseField : [this.props.appbaseField];
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
		}

		// default query

	}, {
		key: "defaultSearchQuery",
		value: function defaultSearchQuery(value) {
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
		}
	}, {
		key: "shouldQuery",
		value: function shouldQuery(value, fields) {
			var _this4 = this;

			var queries = [];
			fields.forEach(function (field, index) {
				var query = [{
					match: _defineProperty({}, field, {
						query: value
					})
				}, {
					match_phrase_prefix: _defineProperty({}, field, {
						query: value
					})
				}];
				if (_lodash2.default.isArray(_this4.props.weights) && _this4.props.weights[index]) {
					query[0].match[field].boost = _this4.props.weights[index];
					query[1].match_phrase_prefix[field].boost = _this4.props.weights[index];
				}
				queries = queries.concat(query);
			});
			return queries;
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: "createChannel",
		value: function createChannel() {
			var _this5 = this;

			var react = this.props.react ? this.props.react : {};
			var reactAnd = [this.searchInputId];
			react = helper.setupReact(react, reactAnd);
			var channelObj = _ChannelManager2.default.create(this.context.appbaseRef, this.context.type, react);
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
		}
	}, {
		key: "checkDefault",
		value: function checkDefault() {
			this.defaultValue = this.urlParams !== null ? this.urlParams : this.props.defaultSelected;
			this.changeValue(this.defaultValue);
		}
	}, {
		key: "changeValue",
		value: function changeValue(defaultValue) {
			if (this.defaultSelected != defaultValue) {
				this.defaultSelected = defaultValue;
				setTimeout(this.setValue.bind(this, this.defaultSelected), 100);
				this.handleSearch({
					value: this.defaultSelected
				});
			}
		}

		// When user has selected a search value

	}, {
		key: "handleSearch",
		value: function handleSearch(currentValue) {
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
		}
	}, {
		key: "handleInputChange",
		value: function handleInputChange(event) {
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
		}
	}, {
		key: "handleBlur",
		value: function handleBlur(event, _ref) {
			var highlightedSuggestion = _ref.highlightedSuggestion;

			if (!highlightedSuggestion || !highlightedSuggestion.label) {
				this.handleSearch({
					value: this.state.currentValue
				});
			}
		}
	}, {
		key: "handleKeyPress",
		value: function handleKeyPress(event) {
			if (event.key === "Enter") {
				event.target.blur();
			}
		}
	}, {
		key: "onInputChange",
		value: function onInputChange(event, _ref2) {
			var method = _ref2.method,
			    newValue = _ref2.newValue;

			if (method === "type") {
				this.setValue(newValue);
			}
		}
	}, {
		key: "onSuggestionSelected",
		value: function onSuggestionSelected(event, _ref3) {
			var suggestion = _ref3.suggestion;

			this.handleSearch(suggestion);
		}
	}, {
		key: "clearSuggestions",
		value: function clearSuggestions() {
			this.setState({
				options: []
			});
		}
	}, {
		key: "getSuggestionValue",
		value: function getSuggestionValue(suggestion) {
			return suggestion.label;
		}
	}, {
		key: "renderSuggestion",
		value: function renderSuggestion(suggestion) {
			return _react2.default.createElement(
				"span",
				null,
				suggestion.label
			);
		}
	}, {
		key: "render",
		value: function render() {
			var title = null;
			if (this.props.title) {
				title = _react2.default.createElement(
					"h4",
					{ className: "rbc-title col s12 col-xs-12" },
					this.props.title
				);
			}
			var cx = (0, _classnames2.default)({
				"rbc-title-active": this.props.title,
				"rbc-title-inactive": !this.props.title,
				"rbc-placeholder-active": this.props.placeholder,
				"rbc-placeholder-inactive": !this.props.placeholder,
				"rbc-autoSuggest-active": this.props.autoSuggest,
				"rbc-autoSuggest-inactive": !this.props.autoSuggest
			});

			return _react2.default.createElement(
				"div",
				{ className: "rbc rbc-datasearch col s12 col-xs-12 card thumbnail " + cx + " " + (this.state.isLoadingOptions ? "is-loading" : ""), style: this.props.componentStyle },
				title,
				this.props.autoSuggest ? _react2.default.createElement(_reactAutosuggest2.default, {
					suggestions: this.state.options,
					onSuggestionsFetchRequested: function onSuggestionsFetchRequested() {},
					onSuggestionsClearRequested: this.clearSuggestions,
					onSuggestionSelected: this.onSuggestionSelected,
					getSuggestionValue: this.getSuggestionValue,
					renderSuggestion: this.renderSuggestion,
					focusInputOnSuggestionClick: false,
					inputProps: {
						placeholder: this.props.placeholder,
						value: this.state.currentValue === null ? "" : this.state.currentValue,
						onChange: this.onInputChange,
						onBlur: this.handleBlur,
						onKeyPress: this.handleKeyPress
					}
				}) : _react2.default.createElement(
					"div",
					{ className: "rbc-search-container col s12 col-xs-12" },
					_react2.default.createElement("input", {
						type: "text",
						className: "rbc-input",
						placeholder: this.props.placeholder,
						value: this.state.currentValue ? this.state.currentValue : "",
						onChange: this.handleInputChange
					}),
					_react2.default.createElement("span", { className: "rbc-search-icon" })
				)
			);
		}
	}]);

	return DataSearch;
}(_react.Component);

exports.default = DataSearch;


DataSearch.propTypes = {
	componentId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
	weights: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number),
	title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.element]),
	placeholder: _react2.default.PropTypes.string,
	autoSuggest: _react2.default.PropTypes.bool,
	defaultSelected: _react2.default.PropTypes.string,
	customQuery: _react2.default.PropTypes.func,
	onValueChange: _react2.default.PropTypes.func,
	react: _react2.default.PropTypes.object,
	componentStyle: _react2.default.PropTypes.object,
	highlight: _react2.default.PropTypes.bool,
	highlightFields: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
	URLParams: _react2.default.PropTypes.bool,
	allowFilter: _react2.default.PropTypes.bool
};

// Default props value
DataSearch.defaultProps = {
	placeholder: "Search",
	autoSuggest: true,
	componentStyle: {},
	highlight: false,
	URLParams: false,
	allowFilter: true
};

// context type
DataSearch.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
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
	URLParams: TYPES.BOOLEAN,
	allowFilter: TYPES.BOOLEAN,
	weights: TYPES.OBJECT
};