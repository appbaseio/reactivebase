const helper = require("./helper");

function isObject(item) {
	return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, source) {
	let output = Object.assign({}, target);
	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach(key => {
			if (isObject(source[key])) {
				if (!(key in target))
					Object.assign(output, { [key]: source[key] });
				else
					output[key] = mergeDeep(target[key], source[key]);
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		});
	}
	return output;
}

// queryBuild
// Builds the query by using react object and values of sensor
export const queryBuild = function(channelObj, previousSelectedSensor) {
	const sortObj = [];
	let requestOptions = null;

	// check if sortinfo is availbale
	function sortAvailable(depend) {
		const sortInfo = helper.selectedSensor.get(depend, "sortInfo");
		return sortInfo;
	}

	// check if external query part is availbale (i.e. highlight)
	function isExternalQuery(depend) {
		let finalValue = null;
		const sensorInfo = helper.selectedSensor.get(depend, "sensorInfo");
		if (sensorInfo && sensorInfo.externalQuery) {
			finalValue = sensorInfo.externalQuery;
		}
		return finalValue;
	}

	// build single query or if default query present in sensor itself use that
	function singleQuery(depend) {
		const sensorInfo = helper.selectedSensor.get(depend, "sensorInfo");
		let sQuery = null;
		if (sensorInfo && sensorInfo.customQuery) {
			const sensorValue = depend in previousSelectedSensor ? previousSelectedSensor[depend] : helper.selectedSensor.get(depend);
			sQuery = sensorInfo.customQuery(sensorValue);
		} else if (previousSelectedSensor[depend]) {
			sQuery = {};
			sQuery[sensorInfo.queryType] = {};
			if (sensorInfo.queryType !== "match_all") {
				sQuery[sensorInfo.queryType][sensorInfo.inputData] = previousSelectedSensor[depend];
			}
		}
		return sQuery;
	}

	function aggsQuery(depend) {
		const aggsObj = channelObj.react[depend];
		let order,
			type;
		let query;
		if (aggsObj.customQuery) {
			query = aggsObj.customQuery(aggsObj);
		} else {
			if (aggsObj.sortRef) {
				const sortField = sortAvailable(aggsObj.sortRef);
				if (sortField && sortField.aggSort) {
					aggsObj.sort = sortField.aggSort;
				}
			}
			if (aggsObj.sort === "count") {
				order = "desc";
				type = "_count";
			} else if (aggsObj.sort === "asc" || aggsObj.sort === "desc") {
				order = aggsObj.sort;
				type = "_term";
			}
			query = {
				[aggsObj.key]: {
					terms: {
						field: aggsObj.key
					}
				}
			};
			if (aggsObj.size) {
				query[aggsObj.key].terms.size = aggsObj.size;
			}
			if (aggsObj.sort) {
				query[aggsObj.key].terms.order = {
					[type]: order
				};
			}
		}
		return query;
	}

	function generateQuery() {
		const dependsQuery = {};
		let isDataSearchInternal = false;
		channelObj.serializeDepends.dependsList.forEach((depend) => {
			const sensorInfo = helper.selectedSensor.get(depend, "sensorInfo");
			if (sensorInfo && sensorInfo.component === "DataSearchInternal") {
				isDataSearchInternal = true;
			}
		});
		channelObj.serializeDepends.dependsList.forEach((depend) => {
			if (depend === "aggs") {
				dependsQuery[depend] = aggsQuery(depend);
			} else if (depend && depend.indexOf("channel-options-") > -1) {
				requestOptions = requestOptions || {};
				requestOptions = mergeDeep(previousSelectedSensor[depend], requestOptions);
			} else {
				dependsQuery[depend] = singleQuery(depend);
				const externalQuery = isExternalQuery(depend);
				if (externalQuery && !isDataSearchInternal) {
					requestOptions = requestOptions || {};
					requestOptions = mergeDeep(externalQuery, requestOptions);
				}
			}
			const sortField = sortAvailable(depend);
			if (sortField && !("aggSort" in sortField)) {
				sortObj.push(sortField);
			}
		});
		return dependsQuery;
	}

	function combineQuery(dependsQuery) {
		let query = helper.serializeDepends.createQuery(channelObj.serializeDepends, dependsQuery);
		if (query && query.body) {
			if (sortObj && sortObj.length) {
				query.body.sort = sortObj;
			}
			// apply request options
			if (requestOptions && Object.keys(requestOptions).length) {
				Object.keys(requestOptions).forEach((reqOption) => {
					query.body[reqOption] = requestOptions[reqOption];
				});
			}
		} else {
			query = {};
		}
		return query;
	}

	function initialize() {
		const dependsQuery = generateQuery();
		const query = combineQuery(dependsQuery);
		return query;
	}
	return initialize();
};
