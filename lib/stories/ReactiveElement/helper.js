"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.GetTopTopics = undefined;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GetTopTopics = exports.GetTopTopics = function GetTopTopics(data) {
	var store = {};
	var topics = [];
	data.forEach(function (singleData) {
		singleData._source.group.group_topics.forEach(function (topic) {
			store[topic.topic_name] = store[topic.topic_name] ? store[topic.topic_name] + 1 : 1;
		});
	});
	for (var topic in store) {
		var obj = {
			name: topic,
			value: store[topic]
		};
		topics.push(obj);
	}
	topics = _lodash2.default.sortBy(topics, "value").reverse();
	return topics;
};