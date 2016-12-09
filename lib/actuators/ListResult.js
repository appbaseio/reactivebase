'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ListResult = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _ImmutableQuery = require('../middleware/ImmutableQuery.js');

var _ChannelManager = require('../middleware/ChannelManager.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var helper = require('../middleware/helper.js');

var ListResult = exports.ListResult = function (_Component) {
	_inherits(ListResult, _Component);

	function ListResult(props, context) {
		_classCallCheck(this, ListResult);

		var _this = _possibleConstructorReturn(this, (ListResult.__proto__ || Object.getPrototypeOf(ListResult)).call(this, props));

		_this.state = {
			markers: [],
			query: {},
			rawData: {
				hits: {
					hits: []
				}
			},
			resultMarkup: []
		};
		_this.nextPage = _this.nextPage.bind(_this);
		return _this;
	}

	_createClass(ListResult, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.createChannel();
			this.listComponent();
		}

		// Create a channel which passes the depends and receive results whenever depends changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			// Set the depends - add self aggs query as well with depends
			var depends = this.props.depends ? this.props.depends : {};
			// create a channel and listen the changes
			var channelObj = _ChannelManager.manager.create(this.context.appbaseConfig, depends, this.props.requestSize);
			this.channelId = channelObj.channelId;
			channelObj.emitter.addListener(channelObj.channelId, function (res) {
				var data = res.data;
				var rawData = void 0,
				    markersData = void 0;
				this.streamFlag = false;
				if (res.method === 'stream') {
					this.channelMethod = 'stream';
					var modData = this.streamDataModify(this.state.rawData, res);
					rawData = modData.rawData;
					res = modData.res;
					this.streamFlag = true;
					markersData = this.setMarkersData(rawData);
				} else if (res.method === 'historic') {
					this.channelMethod = 'historic';
					rawData = res.appliedQuery && res.appliedQuery.body && res.appliedQuery.body.from !== 0 ? this.appendData(data) : data;
					markersData = this.setMarkersData(data);
				}
				this.setState({
					rawData: rawData,
					markersData: markersData
				}, function () {
					// Pass the historic or streaming data in index method
					res.allMarkers = rawData;
					var generatedData = this.props.markerOnIndex ? this.props.markerOnIndex(res) : this.defaultMarkerOnIndex(res);
					this.setState({
						resultMarkup: generatedData
					});
					if (this.streamFlag) {
						this.streamMarkerInterval();
					}
				}.bind(this));
			}.bind(this));
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
		value: function setMarkersData(data) {
			var self = this;
			if (data && data.hits && data.hits.hits) {
				return data.hits.hits;
			} else {
				return [];
			}
		}

		// default markup

	}, {
		key: 'defaultMarkerOnIndex',
		value: function defaultMarkerOnIndex(res) {
			var result = void 0;
			if (res.allMarkers && res.allMarkers.hits && res.allMarkers.hits.hits) {
				result = res.allMarkers.hits.hits.map(function (marker, index) {
					return _react2.default.createElement(
						'div',
						{ key: index, className: 'makerInfo' },
						JSON.stringify(marker)
					);
				});
			}
			return result;
		}
	}, {
		key: 'nextPage',
		value: function nextPage() {
			var channelOptionsObj = _ChannelManager.manager.channels[this.channelId].previousSelectedSensor['channel-options-' + this.channelId];
			var obj = {
				key: 'channel-options-' + this.channelId,
				value: {
					size: this.props.requestSize,
					from: channelOptionsObj.from + this.props.requestSize
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
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ ref: 'ListContainer', className: 'map-container reactiveComponent appbaseMapComponent listResult', style: this.props.containerStyle },
				this.state.resultMarkup
			);
		}
	}]);

	return ListResult;
}(_react.Component);

ListResult.propTypes = {
	markerOnIndex: _react2.default.PropTypes.func,
	requestSize: _react2.default.PropTypes.number,
	requestOnScroll: _react2.default.PropTypes.bool
};
ListResult.defaultProps = {
	requestSize: 20,
	requestOnScroll: true,
	containerStyle: {
		height: '700px',
		overflow: 'auto'
	}
};

// context type
ListResult.contextTypes = {
	appbaseConfig: _react2.default.PropTypes.any.isRequired
};