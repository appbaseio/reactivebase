const values = [{ "start": 0, "end": 100, "label": "Cheap" },
	{ "start": 101, "end": 200, "label": "Moderate" },
	{ "start": 201, "end": 500, "label": "Pricey" },
	{ "start": 501, "end": 1000, "label": "First Date" }
]
const config = {
	mapping: {
		price: 'price',
		name: 'name'
	},
	SingleDropdownRange: {
		defaultSelected: values[0].label,
		data: values
	},
	ReactiveList: {
		sortBy: "asc",
		size: 1,
		from: 0
	},
	ReactiveBase: {
		app: "car-store",
		username: "cf7QByt5e",
		password: "d2d60548-82a9-43cc-8b40-93cbbe75c34c"
	}
};
const expectedValues = {
	appliedQuery: {
		"body": {
			"query": {
				"bool": {
					"must": [{
						"range": {
							[config.mapping.price]: {
								"gte": values[0].start,
								"lte": values[0].end,
								"boost": 2
							}
						}
					}]
				}
			},
			"sort": [{
				[config.mapping.name]: {
					"order": config.ReactiveList.sortBy
				}
			}],
			"size": config.ReactiveList.size,
			"from": config.ReactiveList.from
		},
		"type": ""
	},
	resultLength: 1
}
module.exports = {
	config: config,
	expectedValues: expectedValues
};
