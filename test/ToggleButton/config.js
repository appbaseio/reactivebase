const values = [{
	"label": "Social",
	"value": "Social"
}, {
	"label": "Travel",
	"value": "Travel"
}, {
	"label": "Outdoors",
	"value": "Outdoors"
}];
const config = {
	mapping: {
		city: "group.group_city.raw",
		topic: "group.group_topics.topic_name_raw"
	},
	ToggleButton: {
		defaultSelected: [values[0].value],
		data: values
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
								"term": {
									[config.mapping.topic]: values[0].value
								}
							}],
							"minimum_should_match": 1,
							"boost": 1
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
