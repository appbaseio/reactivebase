var helper = require("./helper");

// queryBuild
// Builds the query by using react object and values of sensor
export var queryBuild = function queryBuild(channelObj, previousSelectedSensor) {
	var sortObj = [];
	var requestOptions = null;

	// check if sortinfo is availbale
	function sortAvailable(depend) {
		var sortInfo = helper.selectedSensor.get(depend, "sortInfo");
		return sortInfo;
	}

	// check if external query part is availbale (i.e. highlight)
	function isExternalQuery(depend) {
		var finalValue = null;
		var sensorInfo = helper.selectedSensor.get(depend, "sensorInfo");
		if (sensorInfo && sensorInfo.externalQuery) {
			finalValue = sensorInfo.externalQuery;
		}
		return finalValue;
	}

	// build single query or if default query present in sensor itself use that
	function singleQuery(depend) {
		var sensorInfo = helper.selectedSensor.get(depend, "sensorInfo");
		var sQuery = null;
		if (sensorInfo && sensorInfo.customQuery) {
			var sensorValue = depend in previousSelectedSensor ? previousSelectedSensor[depend] : helper.selectedSensor.get(depend);
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
		var aggsObj = channelObj.react[depend];
		var order = void 0,
		    type = void 0;
		var query = void 0;
		if (aggsObj.customQuery) {
			query = aggsObj.customQuery(aggsObj);
		} else {
			var _query;

			if (aggsObj.sortRef) {
				var sortField = sortAvailable(aggsObj.sortRef);
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
			query = (_query = {}, _query[aggsObj.key] = {
				terms: {
					field: aggsObj.key
				}
			}, _query);
			if (aggsObj.size) {
				query[aggsObj.key].terms.size = aggsObj.size;
			}
			if (aggsObj.sort) {
				var _query$aggsObj$key$te;

				query[aggsObj.key].terms.order = (_query$aggsObj$key$te = {}, _query$aggsObj$key$te[type] = order, _query$aggsObj$key$te);
			}
		}
		return query;
	}

	function generateQuery() {
		var dependsQuery = {};
		var isDataSearchInternal = false;
		channelObj.serializeDepends.dependsList.forEach(function (depend) {
			var sensorInfo = helper.selectedSensor.get(depend, "sensorInfo");
			if (sensorInfo && sensorInfo.component === "DataSearchInternal") {
				isDataSearchInternal = true;
			}
		});
		channelObj.serializeDepends.dependsList.forEach(function (depend) {
			if (depend === "aggs") {
				dependsQuery[depend] = aggsQuery(depend);
			} else if (depend && depend.indexOf("channel-options-") > -1) {
				requestOptions = requestOptions || {};
				if (previousSelectedSensor[depend] && "highlight" in previousSelectedSensor[depend] && "highlight" in requestOptions) {
					requestOptions.highlight.fields = Object.assign({}, previousSelectedSensor[depend].highlight.fields, requestOptions.highlight.fields);
				}
				requestOptions = Object.assign({}, previousSelectedSensor[depend], requestOptions);
			} else {
				dependsQuery[depend] = singleQuery(depend);
				var externalQuery = isExternalQuery(depend);
				if (externalQuery && !isDataSearchInternal) {
					requestOptions = requestOptions || {};
					if ("highlight" in externalQuery && "highlight" in requestOptions) {
						requestOptions.highlight.fields = Object.assign({}, externalQuery.highlight.fields, requestOptions.highlight.fields);
					}
					requestOptions = Object.assign(externalQuery, requestOptions);
				}
			}
			var sortField = sortAvailable(depend);
			if (sortField && !("aggSort" in sortField)) {
				sortObj.push(sortField);
			}
		});
		return dependsQuery;
	}

	function combineQuery(dependsQuery) {
		var query = helper.serializeDepends.createQuery(channelObj.serializeDepends, dependsQuery);
		if (query && query.body) {
			if (sortObj && sortObj.length) {
				query.body.sort = sortObj;
			}
			// apply request options
			if (requestOptions && Object.keys(requestOptions).length) {
				Object.keys(requestOptions).forEach(function (reqOption) {
					query.body[reqOption] = requestOptions[reqOption];
				});
			}
		} else {
			query = {};
		}
		return query;
	}

	function initialize() {
		var dependsQuery = generateQuery();
		var query = combineQuery(dependsQuery);
		return query;
	}
	return initialize();
};