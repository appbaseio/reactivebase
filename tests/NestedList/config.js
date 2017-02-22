const config = {
	mapping: {
		brand: 'brand.raw',
		model: 'model.raw',
		price: 'price'
	},
	NestedList: {
		defaultSelected: ["bmw"]
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
						"bool": {
							"must": [{
								"term": {
									[config.mapping.brand]: config.NestedList.defaultSelected[0]
								}
							}]
						}
					}]
				}
			},
			"sort": [{
				[config.mapping.price]: {
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