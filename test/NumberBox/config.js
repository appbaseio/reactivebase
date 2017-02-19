const values = {
	label: "Car Ratings",
	start: 1,
	end: 5
};
const config = {
	mapping: {
		rating: 'rating'
	},
	NumberBox: {
		defaultSelected: 3,
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
						"term": {
							[config.mapping.rating]: config.NumberBox.defaultSelected
						}
					}]
				}
			},
			"size": config.ReactiveList.size,
			"from": config.ReactiveList.from
		},
		"type": ''
	},
	resultLength: 1
}
module.exports = {
	config: config,
	expectedValues: expectedValues
};
