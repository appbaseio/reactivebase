var moment = require("moment");
const values = {
	gte: '2017-02-15T18:30:00.000Z',
	lte: '2017-02-16T18:30:00.000Z'
}
const config = {
	mapping: {
		city: "group.group_city.raw",
		topic: "group.group_topics.topic_name_raw",
		date: 'mtime'
	},
	DatePicker: {
		defaultSelected: moment(values.gte)
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
						"range": {
							"mtime": {
								"gte": values.gte,
								"lt": values.lte
							}
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
