'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ReactiveElement = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

var _JsonPrint = require('./component/JsonPrint');

var _JsonPrint2 = _interopRequireDefault(_JsonPrint);

var _PoweredBy = require('../sensors/PoweredBy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');
var $ = require('jquery');
var _ = require('lodash');

var ReactiveElement = exports.ReactiveElement = function (_Component) {
	_inherits(ReactiveElement, _Component);

	function ReactiveElement(props, context) {
		_classCallCheck(this, ReactiveElement);

		var _this = _possibleConstructorReturn(this, (ReactiveElement.__proto__ || Object.getPrototypeOf(ReactiveElement)).call(this, props));

		_this.state = {
			markers: [],
			query: {},
			rawData: [],
			resultMarkup: [],
			isLoading: false
		};
		_this.channelId = null;
		_this.channelListener = null;
		_this.queryStartTime = 0;
		_this.appliedQuery = {};
		return _this;
	}

	_createClass(ReactiveElement, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.initialize();
		}
	}, {
		key: 'initialize',
		value: function initialize() {
			this.createChannel();
		}

		// stop streaming request and remove listener when component will unmount

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.removeChannel();
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
		}

		// Create a channel which passes the react and receive results whenever react changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
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
				if (res.mode === 'historic' && res.startTime > this.queryStartTime) {
					this.afterChannelResponse(res);
				} else if (res.mode === 'streaming') {
					this.afterChannelResponse(res);
				}
			}.bind(this));
			var obj = {
				key: 'streamChanges',
				value: ''
			};
			helper.selectedSensor.set(obj, true);
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
					resultMarkup: generatedData,
					currentData: this.combineCurrentData(newData)
				});
				if (this.streamFlag) {
					this.streamMarkerInterval();
				}
			}.bind(this));
		}

		// Check if stream data exists in markersData
		// and if exists the call streamToNormal.

	}, {
		key: 'streamMarkerInterval',
		value: function streamMarkerInterval() {
			var _this2 = this;

			var markersData = this.state.markersData;
			var isStreamData = markersData.filter(function (hit) {
				return hit.stream && hit.streamStart;
			});
			if (isStreamData.length) {
				this.isStreamDataExists = true;
				setTimeout(function () {
					return _this2.streamToNormal();
				}, this.props.streamActiveTime * 1000);
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

		// default markup

	}, {
		key: 'defaultonData',
		value: function defaultonData(response) {
			var result = null;
			var res = response.res;
			if (res && res.appliedQuery) {
				result = _react2.default.createElement(
					'div',
					{ className: 'row', style: { 'marginTop': '60px' } },
					_react2.default.createElement(
						'pre',
						null,
						JSON.stringify(res.newData, null, 4)
					)
				);
			}
			return result;
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
				'rbc-placeholder-active': this.props.placeholder,
				'rbc-placeholder-inactive': !this.props.placeholder,
				'rbc-stream-active': this.props.stream,
				'rbc-stream-inactive': !this.props.stream
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
					'p',
					{ className: 'rbc-placeholder col s12 col-xs-12' },
					this.props.placeholder
				);
			}

			return _react2.default.createElement(
				'div',
				{ className: 'rbc-reactiveelement-container' },
				_react2.default.createElement(
					'div',
					{ ref: 'ListContainer', className: 'rbc rbc-reactiveelement card thumbnail ' + cx, style: this.props.componentStyle },
					title,
					this.state.resultMarkup || placeholder
				),
				_react2.default.createElement(_PoweredBy.PoweredBy, null)
			);
		}
	}]);

	return ReactiveElement;
}(_react.Component);

ReactiveElement.propTypes = {
	componentId: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.string,
	from: helper.validation.resultListFrom,
	onData: _react2.default.PropTypes.func,
	size: helper.sizeValidation,
	stream: _react2.default.PropTypes.bool,
	componentStyle: _react2.default.PropTypes.object,
	placeholder: _react2.default.PropTypes.string
};

ReactiveElement.defaultProps = {
	from: 0,
	size: 20,
	requestOnScroll: true,
	stream: false,
	componentStyle: {}
};

// context type
ReactiveElement.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};