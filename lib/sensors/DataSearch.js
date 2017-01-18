'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DataSearch = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');

var DataSearch = exports.DataSearch = function (_Component) {
	_inherits(DataSearch, _Component);

	function DataSearch(props, context) {
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
		_this.type = 'match_phrase';
		_this.channelId = null;
		_this.channelListener = null;
		_this.fieldType = _typeof(_this.props.appbaseField);
		_this.handleSearch = _this.handleSearch.bind(_this);
		_this.handleInputChange = _this.handleInputChange.bind(_this);
		_this.setValue = _this.setValue.bind(_this);
		_this.defaultSearchQuery = _this.defaultSearchQuery.bind(_this);
		_this.previousSelectedSensor = {};
		return _this;
	}

	// Get the items from Appbase when component is mounted


	_createClass(DataSearch, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.setQueryInfo();
			this.createChannel();
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.channelId) {
				_ChannelManager.manager.stopStream(this.channelId);
			}
			if (this.channelListener) {
				this.channelListener.remove();
			}
		}

		// set the query type and input data

	}, {
		key: 'setQueryInfo',
		value: function setQueryInfo() {
			var obj = {
				key: this.props.sensorId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField,
					defaultQuery: this.defaultSearchQuery
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
			var searchObj = {
				key: this.props.searchInputId,
				value: {
					queryType: 'multi_match',
					inputData: this.props.appbaseField
				}
			};
			helper.selectedSensor.setSensorInfo(searchObj);
		}

		// Create a channel which passes the depends and receive results whenever depends changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			var depends = {};
			depends[this.props.searchInputId] = {
				operation: "must",
				defaultQuery: this.defaultSearchQuery
			};
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, depends);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				var data = res.data;
				var rawData = void 0;
				if (res.mode === 'streaming') {
					rawData = this.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if (res.mode === 'historic') {
					rawData = data;
				}
				this.setState({
					rawData: rawData
				});
				if (this.props.autocomplete) {
					this.setData(rawData);
				}
			}.bind(this));
		}

		//default query

	}, {
		key: 'defaultSearchQuery',
		value: function defaultSearchQuery(value) {
			var _this2 = this;

			if (value) {
				if (this.fieldType == 'string') {
					return {
						"match_phrase_prefix": _defineProperty({}, this.props.appbaseField, value)
					};
				} else {
					var _ret = function () {
						var query = [];
						_this2.props.appbaseField.map(function (field) {
							query.push({
								"match_phrase_prefix": _defineProperty({}, field, value)
							});
						});
						return {
							v: {
								bool: {
									should: query,
									minimum_should_match: 1
								}
							}
						};
					}();

					if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
				}
			}
		}

		// set value to search

	}, {
		key: 'setValue',
		value: function setValue(value) {
			var obj = {
				key: this.props.searchInputId,
				value: value
			};
			helper.selectedSensor.set(obj, true);
			if (value && value.trim() !== '') {
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

		// set data after get the result

	}, {
		key: 'setData',
		value: function setData(data) {
			var _this3 = this;

			var options = [];
			var searchField = null;
			if (this.fieldType == 'string') {
				searchField = 'hit._source.' + this.props.appbaseField + '.trim()';
			}
			// Check if this is Geo search or field tag search
			if (this.props.isGeoSearch) {
				(function () {
					// If it is Geo, we return the location field
					var latField = 'hit._source.' + _this3.props.latField;
					var lonField = 'hit._source.' + _this3.props.lonField;
					data.hits.hits.map(function (hit) {
						var location = {
							lat: eval(latField),
							lon: eval(lonField)
						};
						if (searchField) {
							options.push({ value: location, label: eval(searchField) });
						} else {
							if (_this3.fieldType == 'object') {
								_this3.props.appbaseField.map(function (field) {
									var tempField = 'hit._source.' + field;
									if (eval(tempField)) {
										options.push({ value: location, label: eval(tempField) });
									}
								});
							}
						}
					});
				})();
			} else {
				data.hits.hits.map(function (hit) {
					if (searchField) {
						options.push({ value: eval(searchField), label: eval(searchField) });
					} else {
						if (_this3.fieldType == 'object') {
							_this3.props.appbaseField.map(function (field) {
								var tempField = 'hit._source.' + field;
								if (eval(tempField)) {
									options.push({ value: eval(tempField), label: eval(tempField) });
								}
							});
						}
					}
				});
			}
			if (this.state.currentValue && this.state.currentValue.trim() !== '') {
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

		// Search results often contain duplicate results, so display only unique values

	}, {
		key: 'removeDuplicates',
		value: function removeDuplicates(myArr, prop) {
			return myArr.filter(function (obj, pos, arr) {
				return arr.map(function (mapObj) {
					return mapObj[prop];
				}).indexOf(obj[prop]) === pos;
			});
		}

		// When user has selected a search value

	}, {
		key: 'handleSearch',
		value: function handleSearch(currentValue) {
			var value = currentValue ? currentValue.value : null;
			value = value === 'null' ? null : value;
			var obj = {
				key: this.props.sensorId,
				value: value
			};
			helper.selectedSensor.set(obj, true);
			this.setState({
				currentValue: value
			});
		}
	}, {
		key: 'handleInputChange',
		value: function handleInputChange(event) {
			var inputVal = event.target.value;
			this.setState({
				'currentValue': inputVal
			});
			var obj = {
				key: this.props.sensorId,
				value: inputVal
			};

			// pass the selected sensor value with sensorId as key,
			var isExecuteQuery = true;
			helper.selectedSensor.set(obj, isExecuteQuery);
		}
	}, {
		key: 'render',
		value: function render() {
			var title = null;
			if (this.props.title) {
				title = _react2.default.createElement(
					'h4',
					{ className: 'rbc-title col s12 col-xs-12' },
					this.props.title
				);
			}
			var cx = (0, _classnames2.default)({
				'rbc-title-active': this.props.title,
				'rbc-title-inactive': !this.props.title,
				'rbc-placeholder-active': this.props.placeholder,
				'rbc-placeholder-inactive': !this.props.placeholder
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-datasearch col s12 col-xs-12 card thumbnail ' + cx },
				title,
				this.props.autocomplete ? _react2.default.createElement(_reactSelect2.default, _extends({
					isLoading: this.state.isLoadingOptions,
					value: this.state.currentValue,
					options: this.state.options,
					onInputChange: this.setValue,
					onChange: this.handleSearch,
					onBlurResetsInput: false
				}, this.props)) : _react2.default.createElement(
					'div',
					{ className: 'rbc-search-container col s12 col-xs-12' },
					_react2.default.createElement('input', {
						type: 'text',
						className: 'rbc-input',
						placeholder: this.props.placeholder,
						value: this.state.currentValue ? this.state.currentValue : '',
						onChange: this.handleInputChange
					}),
					_react2.default.createElement('span', { className: 'rbc-search-icon' })
				)
			);
		}
	}]);

	return DataSearch;
}(_react.Component);

DataSearch.propTypes = {
	sensorId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
	placeholder: _react2.default.PropTypes.string,
	autocomplete: _react2.default.PropTypes.bool.isRequired,
	sensorInputId: _react2.default.PropTypes.string
};

// Default props value
DataSearch.defaultProps = {
	placeholder: "Search...",
	autocomplete: true,
	sensorInputId: "searchLetter"
};

// context type
DataSearch.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};