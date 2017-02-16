const config = {
	mapping: {
		topic: 'group.group_topics.topic_name_raw',
		venue: 'venue_name_ngrams'
	},
	DataSearch: {
		defaultSelected: "The Grand Bar"
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
					"must": [{
						"bool": {
							"should": [{
								"match_phrase_prefix": {
									[config.mapping.topic]: [config.DataSearch.defaultSelected]
								}
							}, {
								"match_phrase_prefix": {
									[config.mapping.venue]: [config.DataSearch.defaultSelected]
								}
							}],
							"minimum_should_match": 1
						}
					}]
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
