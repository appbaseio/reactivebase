"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var helper = require("./helper");

// queryBuild
// Builds the query by using react object and values of sensor
var queryBuild = exports.queryBuild = function queryBuild(channelObj, previousSelectedSensor) {
	var sortObj = [];
	var requestOptions = null;

	// check if sortinfo is availbale
	function sortAvailable(depend) {
		var sortInfo = helper.selectedSensor.get(depend, "sortInfo");
		return sortInfo;
	}

	// build single query or if default query present in sensor itself use that
	function singleQuery(depend) {
		var sensorInfo = helper.selectedSensor.get(depend, "sensorInfo");
		var sQuery = null;
		if (sensorInfo && sensorInfo.customQuery) {
			sQuery = sensorInfo.customQuery(previousSelectedSensor[depend]);
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
		if (aggsObj.sortRef) {
			var sortField = sortAvailable(aggsObj.sortRef);
			if (sortField && sortField.aggSort) {
				aggsObj.sort = sortField.aggSort;
			}
		}
		if (aggsObj.sort === "count") {
			order = "desc";
			type = "_count";
		} else if (aggsObj.sort === "asc") {
			order = "asc";
			type = "_term";
		} else {
			order = "desc";
			type = "_term";
		}
		var orderQuery = "{\n\t\t\t\t\"" + type + "\" : \"" + order + "\"\n\t\t\t}";
		return JSON.parse("{\n\t\t\t\t\"" + aggsObj.key + "\": {\n\t\t\t\t\t\"terms\": {\n\t\t\t\t\t\t\"field\": \"" + aggsObj.key + "\",\n\t\t\t\t\t\t\"size\": " + aggsObj.size + ",\n\t\t\t\t\t\t\"order\": " + orderQuery + "\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}");
	}

	function generateQuery() {
		var dependsQuery = {};
		channelObj.serializeDepends.dependsList.forEach(function (depend) {
			if (depend === "aggs") {
				dependsQuery[depend] = aggsQuery(depend);
			} else if (depend && depend.indexOf("channel-options-") > -1) {
				requestOptions = previousSelectedSensor[depend];
			} else {
				dependsQuery[depend] = singleQuery(depend);
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