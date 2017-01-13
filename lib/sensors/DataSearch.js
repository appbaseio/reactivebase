'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DataSearch = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
		_this.handleSearch = _this.handleSearch.bind(_this);
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
					inputData: this.props.appbaseField
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
			var depends = this.props.depends ? this.props.depends : {};
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
				this.setData(rawData);
			}.bind(this));
		}

		//default query

	}, {
		key: 'defaultSearchQuery',
		value: function defaultSearchQuery(value) {
			return {
				"match_phrase_prefix": _defineProperty({}, this.props.appbaseField, value)
			};
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
			var _this2 = this;

			var options = [];
			var searchField = 'hit._source.' + this.props.appbaseField + '.trim()';
			// Check if this is Geo search or field tag search
			if (this.props.isGeoSearch) {
				(function () {
					// If it is Geo, we return the location field
					var latField = 'hit._source.' + _this2.props.latField;
					var lonField = 'hit._source.' + _this2.props.lonField;
					data.hits.hits.map(function (hit) {
						var location = {
							lat: eval(latField),
							lon: eval(lonField)
						};
						options.push({ value: location, label: eval(searchField) });
					});
				})();
			} else {
				data.hits.hits.map(function (hit) {
					options.push({ value: eval(searchField), label: eval(searchField) });
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
		key: 'render',
		value: function render() {
			var cx = (0, _classnames2.default)({
				'rbc-placeholder-active': this.props.placeholder,
				'rbc-placeholder-inactive': !this.props.placeholder
			});

			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-datasearch ' + cx },
				_react2.default.createElement(_reactSelect2.default, _extends({
					isLoading: this.state.isLoadingOptions,
					value: this.state.currentValue,
					options: this.state.options,
					onInputChange: this.setValue,
					onChange: this.handleSearch,
					onBlurResetsInput: false
				}, this.props))
			);
		}
	}]);

	return DataSearch;
}(_react.Component);

DataSearch.propTypes = {
	sensorId: _react2.default.PropTypes.string.isRequired,
	sensorInputId: _react2.default.PropTypes.string,
	appbaseField: _react2.default.PropTypes.string,
	placeholder: _react2.default.PropTypes.string,
	size: _react2.default.PropTypes.number
};

// Default props value
DataSearch.defaultProps = {
	placeholder: "Search...",
	size: 10,
	executeDepends: true,
	sensorInputId: "searchLetter"
};

// context type
DataSearch.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};