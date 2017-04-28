"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var _ = require("lodash");
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
	topics = _.sortBy(topics, "value").reverse();
	return topics;
};