'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ResultList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

var _JsonPrint = require('./component/JsonPrint');

var _JsonPrint2 = _interopRequireDefault(_JsonPrint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');
var $ = require('jquery');

var ResultList = exports.ResultList = function (_Component) {
	_inherits(ResultList, _Component);

	function ResultList(props, context) {
		_classCallCheck(this, ResultList);

		var _this = _possibleConstructorReturn(this, (ResultList.__proto__ || Object.getPrototypeOf(ResultList)).call(this, props));

		_this.state = {
			markers: [],
			query: {},
			rawData: [],
			resultMarkup: []
		};
		if (_this.props.sortOptions) {
			var obj = _this.props.sortOptions[0];
			_this.sortObj = _defineProperty({}, obj.appbaseField, {
				order: obj.sortBy
			});
		} else if (_this.props.sortBy) {
			_this.sortObj = _defineProperty({}, _this.props.appbaseField, {
				order: _this.props.sortBy
			});
		}
		_this.resultSortKey = 'ResultSort';
		_this.channelId = null;
		_this.channelListener = null;
		_this.queryStartTime = 0;
		_this.handleSortSelect = _this.handleSortSelect.bind(_this);
		_this.nextPage = _this.nextPage.bind(_this);
		_this.appliedQuery = {};
		return _this;
	}

	_createClass(ResultList, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.createChannel();
			if (this.props.requestOnScroll) {
				this.listComponent();
			}
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

		// Create a channel which passes the depends and receive results whenever depends changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			// Set the depends - add self aggs query as well with depends
			var depends = this.props.depends ? this.props.depends : {};
			if (this.sortObj) {
				this.enableSort(depends);
			}
			// create a channel and listen the changes
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, depends, this.props.size, this.props.from);
			this.channelId = channelObj.channelId;
			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				// implementation to prevent initialize query issue if old query response is late then the newer query
				// then we will consider the response of new query and prevent to apply changes for old query response.
				// if queryStartTime of channel response is greater than the previous one only then apply changes
				if (res.mode === 'historic' && res.startTime > this.queryStartTime) {
					this.afterChannelResponse(res);
				} else if (res.mode === 'stream') {
					this.afterChannelResponse(res);
				}
			}.bind(this));
		}
	}, {
		key: 'afterChannelResponse',
		value: function afterChannelResponse(res) {
			var data = res.data;
			var rawData = void 0,
			    markersData = void 0,
			    newData = [],
			    currentData = [];
			this.streamFlag = false;
			if (res.mode === 'streaming') {
				this.channelMethod = 'streaming';
				var modData = this.streamDataModify(this.state.rawData, res);
				rawData = modData.rawData;
				newData = res;
				currentData = this.state.rawData;
				res = modData.res;
				this.streamFlag = true;
				markersData = this.setMarkersData(rawData);
			} else if (res.mode === 'historic') {
				this.queryStartTime = res.startTime;
				this.channelMethod = 'historic';
				newData = res.data.hits && res.data.hits.hits ? res.data.hits.hits : [];
				var normalizeCurrentData = this.normalizeCurrentData(res, this.state.rawData, newData);
				newData = normalizeCurrentData.newData;
				currentData = normalizeCurrentData.currentData;
				rawData = currentData.concat(newData);
			}
			this.setState({
				rawData: rawData,
				newData: newData,
				currentData: currentData,
				markersData: markersData
			}, function () {
				// Pass the historic or streaming data in index method
				res.allMarkers = rawData;
				var modifiedData = JSON.parse(JSON.stringify(res));
				modifiedData.newData = this.state.newData;
				modifiedData.currentData = this.state.currentData;
				delete modifiedData.data;
				var generatedData = this.props.onData ? this.props.onData(modifiedData) : this.defaultonData(res);
				this.setState({
					resultMarkup: generatedData
				});
				if (this.streamFlag) {
					this.streamMarkerInterval();
				}
			}.bind(this));
		}

		// normalize current data

	}, {
		key: 'normalizeCurrentData',
		value: function normalizeCurrentData(res, rawData, newData) {
			var appliedQuery = JSON.parse(JSON.stringify(res.appliedQuery));
			if (this.props.requestOnScroll) {
				delete appliedQuery.body.from;
				delete appliedQuery.body.size;
			}
			var currentData = JSON.stringify(appliedQuery) === JSON.stringify(this.appliedQuery) ? rawData : [];
			if (!currentData.length) {
				this.appliedQuery = appliedQuery;
			} else {
				newData = newData.filter(function (newRecord) {
					var notExits = true;
					currentData.forEach(function (oldRecord) {
						if (newRecord._id + '-' + newRecord._type === oldRecord._id + '-' + oldRecord._type) {
							notExits = false;
						}
					});
					return notExits;
				});
			}
			return {
				currentData: currentData,
				newData: newData
			};
		}

		// enable sort

	}, {
		key: 'enableSort',
		value: function enableSort(depends) {
			depends[this.resultSortKey] = { operation: "must" };
			var sortObj = {
				key: this.resultSortKey,
				value: this.sortObj
			};
			helper.selectedSensor.setSortInfo(sortObj);
		}

		// append data if pagination is applied

	}, {
		key: 'appendData',
		value: function appendData(data) {
			var rawData = this.state.rawData;
			var hits = rawData.hits.hits.concat(data.hits.hits);
			rawData.hits.hits = _.uniqBy(hits, '_id');;
			return rawData;
		}

		// append stream boolean flag and also start time of stream

	}, {
		key: 'streamDataModify',
		value: function streamDataModify(rawData, res) {
			if (res.data) {
				res.data.stream = true;
				res.data.streamStart = new Date();
				if (res.data._deleted) {
					var hits = rawData.hits.hits.filter(function (hit) {
						return hit._id !== res.data._id;
					});
					rawData.hits.hits = hits;
				} else {
					var prevData = rawData.hits.hits.filter(function (hit) {
						return hit._id === res.data._id;
					});
					var _hits = rawData.hits.hits.filter(function (hit) {
						return hit._id !== res.data._id;
					});
					rawData.hits.hits = _hits;
					rawData.hits.hits.push(res.data);
				}
			}
			return {
				rawData: rawData,
				res: res,
				streamFlag: true
			};
		}

		// tranform the raw data to marker data

	}, {
		key: 'setMarkersData',
		value: function setMarkersData(hits) {
			var self = this;
			if (hits) {
				return hits;
			} else {
				return [];
			}
		}

		// default markup

	}, {
		key: 'defaultonData',
		value: function defaultonData(res) {
			var result = void 0;
			if (res.allMarkers) {
				result = res.allMarkers.map(function (marker, index) {
					return _react2.default.createElement(
						'div',
						{
							key: index,
							style: { 'borderBottom': '1px solid #eee', 'padding': '12px' },
							className: 'makerInfo' },
						_react2.default.createElement(_JsonPrint2.default, { data: marker._source })
					);
				});
			}
			result = _react2.default.createElement(
				'div',
				{ className: 'row', style: { 'marginTop': '60px' } },
				result
			);
			return result;
		}
	}, {
		key: 'nextPage',
		value: function nextPage() {
			var channelOptionsObj = _ChannelManager.manager.channels[this.channelId].previousSelectedSensor['channel-options-' + this.channelId];
			var obj = {
				key: 'channel-options-' + this.channelId,
				value: {
					size: this.props.size,
					from: channelOptionsObj.from + this.props.size
				}
			};
			_ChannelManager.manager.nextPage(this.channelId);
		}
	}, {
		key: 'listComponent',
		value: function listComponent() {
			var _this2 = this;

			var node = this.refs.ListContainer;
			if (node) {
				node.addEventListener('scroll', function () {
					if ($(node).scrollTop() + $(node).innerHeight() >= node.scrollHeight) {
						_this2.nextPage();
					}
				});
			}
		}
	}, {
		key: 'handleSortSelect',
		value: function handleSortSelect(event) {
			var index = event.target.value;
			this.sortObj = _defineProperty({}, this.props.sortOptions[index]['appbaseField'], {
				order: this.props.sortOptions[index]['sortBy']
			});
			var obj = {
				key: this.resultSortKey,
				value: this.sortObj
			};
			helper.selectedSensor.set(obj, true, 'sortChange');
		}
	}, {
		key: 'render',
		value: function render() {
			var title = null,
			    sortOptions = null;
			var cx = (0, _classnames2.default)({
				'rbc-title-active': this.props.title,
				'rbc-title-inactive': !this.props.title,
				'rbc-sort-active': this.props.sortOptions,
				'rbc-sort-inactive': !this.props.sortOptions
			});

			if (this.props.title) {
				title = _react2.default.createElement(
					'h4',
					{ className: 'rbc-title col s12 col-xs-12' },
					this.props.title
				);
			}

			if (this.props.sortOptions) {
				var options = this.props.sortOptions.map(function (item, index) {
					return _react2.default.createElement(
						'option',
						{ value: index, key: index },
						item.label
					);
				});

				sortOptions = _react2.default.createElement(
					'div',
					{ className: 'rbc-sortoptions input-field col' },
					_react2.default.createElement(
						'select',
						{ className: 'browser-default form-control', onChange: this.handleSortSelect },
						options
					)
				);
			}

			return _react2.default.createElement(
				'div',
				{ ref: 'ListContainer', className: 'rbc rbc-resultlist card thumbnail ' + cx },
				title,
				sortOptions,
				this.state.resultMarkup
			);
		}
	}]);

	return ResultList;
}(_react.Component);

ResultList.propTypes = {
	sensorId: _react2.default.PropTypes.string,
	appbaseField: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.string,
	sortBy: _react2.default.PropTypes.string,
	sortOptions: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
		label: _react2.default.PropTypes.string,
		field: _react2.default.PropTypes.string,
		order: _react2.default.PropTypes.string
	})),
	from: _react2.default.PropTypes.number,
	onData: _react2.default.PropTypes.func,
	size: _react2.default.PropTypes.number,
	requestOnScroll: _react2.default.PropTypes.bool
};

ResultList.defaultProps = {
	from: 0,
	size: 20,
	requestOnScroll: true
};

// context type
ResultList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};