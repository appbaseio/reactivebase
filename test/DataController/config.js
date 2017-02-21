const config = {
	mapping: {
		topic: 'group.group_topics.topic_name_raw',
		venue: 'venue_name_ngrams'
	},
	DataController: {
		customQuery: {
			"query": {
				"match_all": {}
			}
		}
	},
	ReactiveList: {
		sortBy: "asc",
		size: 1,
		from: 0
	},
	ReactiveBase: {
		app: "ReactiveMapTest",
		username: "J9GnR18lo",
		password: "348fb7b0-52e5-4b24-8306-9efeaba5ee09",
		type: "meetupdata"
	}
};
const expectedValues = {
	appliedQuery: {
		"body": {
			"query": {
				"bool": {
					"must": [config.DataController.customQuery]
				}
			},
			"sort": [{
				[config.mapping.topic]: {
					"order": config.ReactiveList.sortBy
				}
			}],
			"size": config.ReactiveList.size,
			"from": config.ReactiveList.from
		},
		"type": config.ReactiveBase.type
	},
	resultLength: 1
}
module.exports = {
	config: config,
	expectedValues: expectedValues
};
