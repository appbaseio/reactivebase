"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
			query = _defineProperty({}, aggsObj.key, {
				terms: {
					field: aggsObj.key
				}
			});
			if (aggsObj.size) {
				query[aggsObj.key].terms.size = aggsObj.size;
			}
			if (aggsObj.sort) {
				query[aggsObj.key].terms.order = _defineProperty({}, type, order);
			}
		}
		return query;
	}

	function generateQuery() {
		var dependsQuery = {};
		channelObj.serializeDepends.dependsList.forEach(function (depend) {
			if (depend === "aggs") {
				dependsQuery[depend] = aggsQuery(depend);
			} else if (depend && depend.indexOf("channel-options-") > -1) {
				requestOptions = requestOptions || {};
				requestOptions = Object.assign(requestOptions, previousSelectedSensor[depend]);
			} else {
				dependsQuery[depend] = singleQuery(depend);
				var externalQuery = isExternalQuery(depend);
				if (externalQuery) {
					requestOptions = requestOptions || {};
					requestOptions = Object.assign(requestOptions, externalQuery);
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