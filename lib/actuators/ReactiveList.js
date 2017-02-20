'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ReactiveList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

var _JsonPrint = require('./component/JsonPrint');

var _JsonPrint2 = _interopRequireDefault(_JsonPrint);

var _PoweredBy = require('../sensors/PoweredBy');

var _InitialLoader = require('../sensors/InitialLoader');

var _NoResults = require('../sensors/NoResults');

var _ResultStats = require('../sensors/ResultStats');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');
var $ = require('jquery');
var _ = require('lodash');

var ReactiveList = exports.ReactiveList = function (_Component) {
	_inherits(ReactiveList, _Component);

	function ReactiveList(props, context) {
		_classCallCheck(this, ReactiveList);

		var _this = _possibleConstructorReturn(this, (ReactiveList.__proto__ || Object.getPrototypeOf(ReactiveList)).call(this, props));

		_this.state = {
			markers: [],
			query: {},
			currentData: [],
			resultMarkup: [],
			isLoading: false,
			queryStart: false,
			resultStats: {
				resultFound: false,
				total: 0,
				took: 0
			},
			showPlaceholder: true
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

	_createClass(ReactiveList, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.streamProp = this.props.stream;
			this.requestOnScroll = this.props.requestOnScroll;
			this.size = this.props.size;
			this.initialize();
		}
	}, {
		key: 'initialize',
		value: function initialize() {
			var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			this.createChannel(executeChannel);
			if (this.props.requestOnScroll) {
				this.listComponent();
			}
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate() {
			var _this2 = this;

			setTimeout(function () {
				if (_this2.streamProp != _this2.props.stream) {
					_this2.streamProp = _this2.props.stream;
					_this2.removeChannel();
					_this2.initialize(true);
				}
				if (_this2.requestOnScroll != _this2.props.requestOnScroll) {
					_this2.requestOnScroll = _this2.props.requestOnScroll;
					_this2.listComponent();
				}
				if (_this2.size != _this2.props.size) {
					_this2.size = _this2.props.size;
					_this2.setState({
						currentData: []
					});
					_this2.removeChannel();
					_this2.initialize(true);
				}
			}, 300);
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.removeChannel();
		}

		// check the height and set scroll if scroll not exists

	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			if (!this.state.showPlaceholder) {
				this.applyScroll();
			}
		}
	}, {
		key: 'applyScroll',
		value: function applyScroll() {
			var resultElement = $('.rbc.rbc-reactivelist');
			var scrollElement = $('.rbc-reactivelist-scroll-container');
			var padding = 45;
			if (resultElement && resultElement.length && scrollElement && scrollElement.length) {
				scrollElement.css('height', 'auto');
				setTimeout(checkHeight, 1000);
			}
			function checkHeight() {
				var flag = resultElement.get(0).scrollHeight - padding > resultElement.height() ? true : false;
				var scrollFlag = scrollElement.get(0).scrollHeight > scrollElement.height() ? true : false;
				if (!flag && !scrollFlag && scrollElement.length) {
					scrollElement.css('height', resultElement.height() - 100);
				}
			}
		}
	}, {
		key: 'removeChannel',
		value: function removeChannel() {
			if (this.channelId) {
				_ChannelManager.manager.stopStream(this.channelId);
				this.channelId = null;
			}
			if (this.channelListener) {
				this.channelListener.remove();
			}
			if (this.loadListener) {
				this.loadListener.remove();
			}
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			var executeChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			// Set the react - add self aggs query as well with react
			var react = this.props.react ? this.props.react : {};
			if (react && react.and && typeof react.and === 'string') {
				react.and = [react.and];
			}
			react.and.push('streamChanges');
			if (this.sortObj) {
				this.enableSort(react);
			}
			// create a channel and listen the changes
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, react, this.props.size, this.props.from, this.props.stream);
			this.channelId = channelObj.channelId;

			this.channelListener = channelObj.emitter.addListener(channelObj.channelId, function (res) {
				// implementation to prevent initialize query issue if old query response is late then the newer query
				// then we will consider the response of new query and prevent to apply changes for old query response.
				// if queryStartTime of channel response is greater than the previous one only then apply changes
				if (res.error && res.startTime > this.queryStartTime) {
					this.setState({
						queryStart: false,
						showPlaceholder: false
					});
					if (this.props.onData) {
						var modifiedData = helper.prepareResultData(data);
						this.props.onData(modifiedData);
					}
				}
				if (res.appliedQuery) {
					if (res.mode === 'historic' && res.startTime > this.queryStartTime) {
						var visibleNoResults = res.appliedQuery && res.data && !res.data.error ? res.data.hits && res.data.hits.total ? false : true : false;
						var resultStats = {
							resultFound: res.appliedQuery && res.data && !res.data.error && res.data.hits && res.data.hits.total ? true : false
						};
						if (res.appliedQuery && res.data && !res.data.error) {
							resultStats.total = res.data.hits.total;
							resultStats.took = res.data.took;
						}
						this.setState({
							queryStart: false,
							visibleNoResults: visibleNoResults,
							resultStats: resultStats,
							showPlaceholder: false
						});
						this.afterChannelResponse(res);
					} else if (res.mode === 'streaming') {
						this.afterChannelResponse(res);
					}
				} else {
					this.setState({
						showPlaceholder: true
					});
				}
			}.bind(this));
			this.listenLoadingChannel(channelObj);
			if (executeChannel) {
				setTimeout(function () {
					var obj = {
						key: 'streamChanges',
						value: ''
					};
					helper.selectedSensor.set(obj, true);
				}, 100);
			}
		}
	}, {
		key: 'listenLoadingChannel',
		value: function listenLoadingChannel(channelObj) {
			this.loadListener = channelObj.emitter.addListener(channelObj.channelId + '-query', function (res) {
				if (res.appliedQuery) {
					this.setState({
						queryStart: res.queryState
					});
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
				newData = res.data;
				newData.stream = true;
				currentData = this.state.currentData;
				this.streamFlag = true;
				markersData = this.setMarkersData(rawData);
			} else if (res.mode === 'historic') {
				this.queryStartTime = res.startTime;
				this.channelMethod = 'historic';
				newData = res.data.hits && res.data.hits.hits ? res.data.hits.hits : [];
				var normalizeCurrentData = this.normalizeCurrentData(res, this.state.currentData, newData);
				newData = normalizeCurrentData.newData;
				currentData = normalizeCurrentData.currentData;
			}
			this.setState({
				rawData: rawData,
				newData: newData,
				currentData: currentData,
				markersData: markersData,
				isLoading: false
			}, function () {
				// Pass the historic or streaming data in index method
				res.allMarkers = rawData;
				var modifiedData = JSON.parse(JSON.stringify(res));
				modifiedData.newData = this.state.newData;
				modifiedData.currentData = this.state.currentData;
				delete modifiedData.data;
				modifiedData = helper.prepareResultData(modifiedData, res.data);
				var generatedData = this.props.onData ? this.props.onData(modifiedData) : this.defaultonData(modifiedData);
				this.setState({
					resultMarkup: this.wrapMarkup(generatedData),
					currentData: this.combineCurrentData(newData)
				});
				if (this.streamFlag) {
					this.streamMarkerInterval();
				}
			}.bind(this));
		}
	}, {
		key: 'wrapMarkup',
		value: function wrapMarkup(generatedData) {
			var markup = null;
			if (Object.prototype.toString.call(generatedData) === '[object Array]') {
				markup = generatedData.map(function (item, index) {
					return _react2.default.createElement(
						'div',
						{ key: index, className: 'rbc-list-item' },
						item
					);
				});
			} else {
				markup = generatedData;
			}
			return markup;
		}

		// Check if stream data exists in markersData
		// and if exists the call streamToNormal.

	}, {
		key: 'streamMarkerInterval',
		value: function streamMarkerInterval() {
			var _this3 = this;

			var markersData = this.state.markersData;
			var isStreamData = markersData.filter(function (hit) {
				return hit.stream && hit.streamStart;
			});
			if (isStreamData.length) {
				this.isStreamDataExists = true;
				setTimeout(function () {
					return _this3.streamToNormal();
				}, this.props.streamActiveTime * 1000);
			} else {
				this.isStreamDataExists = false;
			}
		}

		// Check the difference between current time and attached stream time
		// if difference is equal to streamActiveTime then delete stream and starStream property of marker

	}, {
		key: 'streamToNormal',
		value: function streamToNormal() {
			var _this4 = this;

			var markersData = this.state.markersData;
			var isStreamData = markersData.filter(function (hit) {
				return hit.stream && hit.streamStart;
			});
			if (isStreamData.length) {
				markersData = markersData.map(function (hit, index) {
					if (hit.stream && hit.streamStart) {
						var currentTime = new Date();
						var timeDiff = (currentTime.getTime() - hit.streamStart.getTime()) / 1000;
						if (timeDiff >= _this4.props.streamActiveTime) {
							delete hit.stream;
							delete hit.streamStart;
						}
					}
					return hit;
				});
				this.setState({
					markersData: markersData
				});
			} else {
				this.isStreamDataExists = false;
			}
		}

		// normalize current data

	}, {
		key: 'normalizeCurrentData',
		value: function normalizeCurrentData(res, rawData, newData) {
			var appliedQuery = JSON.parse(JSON.stringify(res.appliedQuery));
			if (this.props.requestOnScroll && appliedQuery && appliedQuery.body) {
				delete appliedQuery.body.from;
				delete appliedQuery.body.size;
			}
			var currentData = JSON.stringify(appliedQuery) === JSON.stringify(this.appliedQuery) ? rawData ? rawData : [] : [];
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
	}, {
		key: 'combineCurrentData',
		value: function combineCurrentData(newData) {
			if (_.isArray(newData)) {
				return this.state.currentData.concat(newData);
			} else {
				return this.streamDataModify(this.state.currentData, newData);
			}
		}

		// enable sort

	}, {
		key: 'enableSort',
		value: function enableSort(react) {
			react.and.push(this.resultSortKey);
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
		value: function streamDataModify(rawData, data) {
			if (data) {
				data.stream = true;
				data.streamStart = new Date();
				if (data._deleted) {
					var hits = rawData.filter(function (hit) {
						return hit._id !== data._id;
					});
					rawData = hits;
				} else {
					var prevData = rawData.filter(function (hit) {
						return hit._id === data._id;
					});
					var _hits = rawData.filter(function (hit) {
						return hit._id !== data._id;
					});
					rawData = _hits;
					rawData.unshift(data);
				}
			}
			return rawData;
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
	}, {
		key: 'defaultonData',
		value: function defaultonData(response) {
			var _this5 = this;

			var res = response.res;
			var result = null;
			if (res) {
				var combineData = res.currentData;
				if (res.mode === 'historic') {
					combineData = res.currentData.concat(res.newData);
				} else if (res.mode === 'streaming') {
					combineData = helper.combineStreamData(res.currentData, res.newData);
				}
				if (combineData) {
					result = combineData.map(function (markerData, index) {
						var marker = markerData._source;
						return _react2.default.createElement(
							'div',
							{ className: 'row', style: { 'marginTop': '60px' } },
							_this5.itemMarkup(marker, markerData)
						);
					});
				}
			}
			return result;
		}
	}, {
		key: 'itemMarkup',
		value: function itemMarkup(marker, markerData) {
			return _react2.default.createElement(
				'div',
				{
					key: markerData._id,
					style: { 'borderBottom': '1px solid #eee', 'padding': '12px', 'fontSize': '12px' },
					className: 'makerInfo' },
				_react2.default.createElement(_JsonPrint2.default, { data: marker })
			);
		}
	}, {
		key: 'nextPage',
		value: function nextPage() {
			this.setState({
				isLoading: true
			});
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
			var listParentElement = this.refs.ListContainer;
			var listChildElement = this.refs.resultListScrollContainer;
			setScroll.call(this, listParentElement);
			setScroll.call(this, listChildElement);
			function setScroll(node) {
				var _this6 = this;

				if (node) {
					node.addEventListener('scroll', function () {
						if (_this6.props.requestOnScroll && $(node).scrollTop() + $(node).innerHeight() >= node.scrollHeight) {
							_this6.nextPage();
						}
					});
				}
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
			    placeholder = null,
			    sortOptions = null;
			var cx = (0, _classnames2.default)({
				'rbc-title-active': this.props.title,
				'rbc-title-inactive': !this.props.title,
				'rbc-sort-active': this.props.sortOptions,
				'rbc-sort-inactive': !this.props.sortOptions,
				'rbc-stream-active': this.props.stream,
				'rbc-stream-inactive': !this.props.stream,
				'rbc-placeholder-active': this.props.placeholder,
				'rbc-placeholder-inactive': !this.props.placeholder
			});

			if (this.props.title) {
				title = _react2.default.createElement(
					'h4',
					{ className: 'rbc-title col s12 col-xs-12' },
					this.props.title
				);
			}
			if (this.props.placeholder) {
				placeholder = _react2.default.createElement(
					'div',
					{ className: 'rbc-placeholder col s12 col-xs-12' },
					this.props.placeholder
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
				{ className: 'rbc-reactivelist-container' },
				_react2.default.createElement(
					'div',
					{ ref: 'ListContainer', className: 'rbc rbc-reactivelist card thumbnail ' + cx, style: this.props.componentStyle },
					title,
					sortOptions,
					this.props.resultStats.show ? _react2.default.createElement(_ResultStats.ResultStats, { setText: this.props.resultStats.setText, visible: this.state.resultStats.resultFound, took: this.state.resultStats.took, total: this.state.resultStats.total }) : null,
					_react2.default.createElement(
						'div',
						{ ref: 'resultListScrollContainer', className: 'rbc-reactivelist-scroll-container col s12 col-xs-12' },
						this.state.resultMarkup
					),
					this.state.isLoading ? _react2.default.createElement('div', { className: 'rbc-loader' }) : null,
					this.state.showPlaceholder ? placeholder : null
				),
				this.props.noResults.show ? _react2.default.createElement(_NoResults.NoResults, { defaultText: this.props.noResults.text, visible: this.state.visibleNoResults }) : null,
				this.props.initialLoader.show ? _react2.default.createElement(_InitialLoader.InitialLoader, { defaultText: this.props.initialLoader.text, queryState: this.state.queryStart }) : null,
				_react2.default.createElement(_PoweredBy.PoweredBy, null)
			);
		}
	}]);

	return ReactiveList;
}(_react.Component);

ReactiveList.propTypes = {
	componentId: _react2.default.PropTypes.string,
	appbaseField: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.string,
	sortBy: _react2.default.PropTypes.oneOf(['asc', 'desc']),
	sortOptions: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
		label: _react2.default.PropTypes.string,
		field: _react2.default.PropTypes.string,
		order: _react2.default.PropTypes.string
	})),
	from: helper.validation.resultListFrom,
	onData: _react2.default.PropTypes.func,
	size: helper.sizeValidation,
	requestOnScroll: _react2.default.PropTypes.bool,
	stream: _react2.default.PropTypes.bool,
	componentStyle: _react2.default.PropTypes.object,
	initialLoader: _react2.default.PropTypes.shape({
		show: _react2.default.PropTypes.bool,
		text: _react2.default.PropTypes.string
	}),
	noResults: _react2.default.PropTypes.shape({
		show: _react2.default.PropTypes.bool,
		text: _react2.default.PropTypes.string
	}),
	resultStats: _react2.default.PropTypes.shape({
		show: _react2.default.PropTypes.bool,
		setText: _react2.default.PropTypes.func
	}),
	placeholder: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number, _react2.default.PropTypes.element])
};

ReactiveList.defaultProps = {
	from: 0,
	size: 20,
	requestOnScroll: true,
	stream: false,
	ShowNoResults: true,
	initialLoader: {
		show: true
	},
	noResults: {
		show: true
	},
	resultStats: {
		show: true
	},
	ShowResultStats: true,
	componentStyle: {}
};

// context type
ReactiveList.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};