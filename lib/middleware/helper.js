"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RecactivebaseComponents = exports.updateStats = exports.combineStreamData = exports.prepareResultData = exports.serializeDepends = exports.selectedSensor = exports.WatchForDependencyChange = exports.sensorEmitter = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* eslint max-lines: 0 */


var _utils = require("./utils");

Object.keys(_utils).forEach(function (key) {
	if (key === "default" || key === "__esModule") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _utils[key];
		}
	});
});

var _URLParams = require("./URLParams");

Object.keys(_URLParams).forEach(function (key) {
	if (key === "default" || key === "__esModule") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _URLParams[key];
		}
	});
});

var _fbemitter = require("fbemitter");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var globalI = 0;
var sensorEmitter = exports.sensorEmitter = new _fbemitter.EventEmitter();

var WatchForDependencyChange = exports.WatchForDependencyChange = function WatchForDependencyChange(react, previousSelectedSensor, cb, channelId, paginationCb, sortCb) {
	globalI += 1;
	this.random = globalI;
	var selectedSensor = {};
	// check if depend object already exists
	var checkDependExists = function checkDependExists(depend) {
		if (!Object.prototype.hasOwnProperty.call(previousSelectedSensor, depend)) {
			previousSelectedSensor[depend] = "";
		}
	};
	// apply depend changes when new value received
	var applyDependChange = function applyDependChange(currentReact, depend) {
		if (selectedSensor[depend] && _typeof(selectedSensor[depend]) === "object") {
			previousSelectedSensor[depend] = JSON.parse(JSON.stringify(selectedSensor[depend]));
		} else {
			previousSelectedSensor[depend] = selectedSensor[depend];
		}
		// if (!selectedSensor[depend].doNotExecute) {
		cb(depend, channelId);
		// }
	};

	// initialize the process
	this.init = function () {
		react.forEach(function (depend) {
			if (!(depend.indexOf("channel-options-") > -1 || depend.indexOf("aggs") > -1)) {
				checkDependExists(depend);
				if (_typeof(selectedSensor[depend]) === "object") {
					if (!_lodash2.default.isEqual(selectedSensor[depend], previousSelectedSensor[depend])) {
						applyDependChange(react, depend);
					}
				} else if (selectedSensor[depend] !== previousSelectedSensor[depend]) {
					applyDependChange(react, depend);
				}
			}
		});
	};

	this.start = function () {
		var self = this;
		this.sensorListener = sensorEmitter.addListener("sensorChange", function (data) {
			var foundDepend = false;

			Object.keys(data).forEach(function (item) {
				if (item.indexOf("channel-options-") < 0 && react.indexOf(item) > -1) {
					foundDepend = true;
				}
			});

			if (foundDepend) {
				selectedSensor = data;
				self.init();
			}
		});

		this.paginationListener = sensorEmitter.addListener("paginationChange", function (data) {
			if (paginationCb) {
				if (react.indexOf(data.key) > -1) {
					paginationCb(data.value, channelId);
				}
			}
		});

		this.sortListener = sensorEmitter.addListener("sortChange", function () {
			if (sortCb) {
				sortCb(channelId);
			}
		});
	};

	this.stop = function () {
		if (this.sensorListener) {
			this.sensorListener.remove();
		}
		if (this.paginationListener) {
			this.paginationListener.remove();
		}
		if (this.sortListener) {
			this.sortListener.remove();
		}
	};
};

function SelectedSensorFn() {
	var self = this;
	this.sensorInfo = {};
	this.selectedSensor = {};
	this.paginationInfo = {};
	this.selectedPagination = {};
	this.sortInfo = {};
	this.selectedSort = {};

	// Get
	var get = function get(prop, obj) {
		if (obj) {
			return self[obj][prop];
		}
		if (prop) {
			return self.selectedSensor[prop];
		}
		return self.selectedSensor;
	};

	// Set
	var set = function set(obj) {
		var isExecuteUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var setMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "sensorChange";

		var methodObj = void 0;
		switch (setMethod) {
			case "sortChange":
				self.sortInfo[obj.key] = obj.value;
				methodObj = self.sortInfo;
				break;
			case "paginationChange":
				self.selectedPagination[obj.key] = obj.value;
				methodObj = obj;
				break;
			case "sensorChange":
			default:
				self.selectedSensor[obj.key] = obj.value;
				methodObj = self.selectedSensor;
				break;
		}
		if (isExecuteUpdate) {
			sensorEmitter.emit(setMethod, methodObj);
		}
	};

	// Set fieldname
	var setSensorInfo = function setSensorInfo(obj) {
		self.sensorInfo[obj.key] = obj.value;
	};

	// Set sort info
	var setSortInfo = function setSortInfo(obj) {
		self.sortInfo[obj.key] = obj.value;
	};

	// Set pagination info
	var setPaginationInfo = function setPaginationInfo(obj) {
		self.paginationInfo[obj.key] = obj.value;
	};

	return {
		get: get,
		set: set,
		setSensorInfo: setSensorInfo,
		setSortInfo: setSortInfo,
		setPaginationInfo: setPaginationInfo
	};
}

var selectedSensor = exports.selectedSensor = new SelectedSensorFn();

var SerializeDepends = function SerializeDepends() {
	var conjunctions = ["and", "or", "not"];

	this.serialize = function (depends) {
		var queries = [];
		var dependsList = [];
		var compId = 0;

		function addDependList(depend) {
			function addDep(dep) {
				if (dependsList.indexOf(dep) < 0) {
					dependsList.push(dep);
				}
			}

			if (typeof depend === "string") {
				addDep(depend);
			} else {
				depend.forEach(function (single) {
					addDep(single);
				});
			}
		}

		function checkConjunctions(depend, parentId) {
			Object.keys(depend).forEach(function (conjunction) {
				compId += 1;
				var res = addConjunction(conjunction, parentId, depend[conjunction], compId);
				queries.push(res);
				if (conjunctions.indexOf(conjunction) < 0) {
					addDependList(conjunction);
				}
			});
			return queries;
		}

		function addLeaf(depend, parentId) {
			compId += 1;
			var res = {
				parentId: parentId,
				componentId: compId,
				leaf: false,
				components: null
			};
			if (Object.prototype.toString.call(depend) === "[object Array]") {
				res.components = depend;
				res.leaf = true;
				addDependList(depend);
			} else if (typeof depend === "string") {
				res.components = depend;
				res.leaf = true;
				addDependList(depend);
			} else {
				checkConjunctions(depend, parentId);
			}
			return res;
		}

		function addConjunction(conjunction, parentId, depend, currentCompId) {
			var leaf = true;
			if (conjunctions.indexOf(conjunction) > -1) {
				var dependRes = addLeaf(depend, currentCompId);
				leaf = false;
				queries.push(dependRes);
			}
			return {
				parentId: parentId,
				componentId: currentCompId,
				conjunction: conjunction,
				components: conjunction,
				leaf: leaf
			};
		}

		function initialize() {
			queries = checkConjunctions(depends, 0);
			return {
				queries: queries,
				dependsList: dependsList
			};
		}

		return initialize();
	};

	this.createQuery = function (serializeResult, dependsQuery) {
		var serializeResultQuery = serializeResult.queries.map(function (query) {
			query.checked = false;
			delete query.query;
			return query;
		});

		function setQuery(depend) {
			var subQuery = [];
			var queryArray = null;
			var getParent = serializeResultQuery.filter(function (dep) {
				return dep.componentId === depend.parentId;
			});
			if (_lodash2.default.isArray(depend.components)) {
				depend.components.forEach(function (comp) {
					if (dependsQuery[comp]) {
						if (queryArray) {
							queryArray.push(dependsQuery[comp]);
						} else {
							queryArray = [];
							queryArray.push(dependsQuery[comp]);
						}
					}
				});
			} else if (typeof depend.components === "string") {
				if (dependsQuery[depend.components]) {
					queryArray = dependsQuery[depend.components];
				}
			}

			if (getParent && getParent.length) {
				subQuery = getParent[0].query ? adjustQuery(getParent[0].query, getParent[0].conjunction, queryArray) : createBoolQuery(getParent[0].conjunction, queryArray);
			} else {
				subQuery = queryArray;
			}
			if (subQuery) {
				serializeResultQuery = serializeResultQuery.map(function (dep) {
					if (getParent.length && dep.componentId === getParent[0].componentId) {
						dep.query = subQuery;
					} else if (depend.parentId === 0 && dep.componentId === depend.componentId) {
						dep.query = subQuery;
					}
					return dep;
				});
			}
		}

		function canWeProceed(componentId) {
			var children = serializeResultQuery.filter(function (query) {
				return !query.checked && query.parentId === componentId;
			});
			var flag = !children.length;
			return flag;
		}

		function mixQuery() {
			serializeResultQuery.forEach(function (sub) {
				setnewquery(sub);
			});
		}

		function setnewquery(sub) {
			if (!sub.query && sub.components) {
				sub.query = [];
				var child = serializeResultQuery.filter(function (item) {
					return item.parentId === sub.componentId;
				});
				child.forEach(function (sub2, index2) {
					var semiquery = setnewquery(sub2);
					if (semiquery) {
						if (_lodash2.default.isArray(semiquery)) {
							if (semiquery.length) {
								sub.query.push(semiquery);
							}
						} else {
							sub.query.push(semiquery);
						}
					}
					if (index2 === child.length - 1 && sub.query.length && sub.conjunction && sub.conjunction !== "aggs") {
						sub.query = createBoolQuery(sub.conjunction, sub.query);
					}
				});
			} else {
				return sub.query;
			}
		}

		function finalQuery() {
			var query = {};
			var aggs = null;
			serializeResultQuery.forEach(function (sub) {
				if (sub.parentId === 0) {
					if (sub.conjunction !== "aggs") {
						query = Object.assign(query, sub.query);
					} else if (sub.conjunction === "aggs") {
						aggs = sub.query;
					}
				}
			});
			var fullQuery = null;
			if (query && Object.keys(query).length) {
				fullQuery = {
					body: {
						query: query
					}
				};
			}
			if (aggs) {
				if (fullQuery) {
					fullQuery.body.aggs = aggs;
				} else {
					fullQuery = {
						body: {
							aggs: aggs
						}
					};
				}
			}
			return fullQuery;
		}

		function checkAndMake() {
			var uncheckedQueryFound = false;
			serializeResultQuery.forEach(function (dependParent) {
				if (!dependParent.checked && canWeProceed(dependParent.componentId)) {
					dependParent.checked = true;
					uncheckedQueryFound = true;
					setQuery(dependParent);
				}
			});
			if (uncheckedQueryFound) {
				return checkAndMake();
			}
			mixQuery();
			return finalQuery();
		}

		function initialize() {
			return checkAndMake();
		}

		function getOperation(conjunction) {
			var operation = null;
			switch (conjunction) {
				case "and":
					operation = "must";
					break;
				case "or":
					operation = "should";
					break;
				case "not":
					operation = "must_not";
					break;
				default:
					operation = "must";
			}
			return operation;
		}

		function createBoolQuery(conjunction, queryArray) {
			if (!queryArray) {
				return null;
			}
			var query = queryArray;
			var operation = getOperation(conjunction);
			if (conjunctions.indexOf(conjunction) > -1) {
				query = {
					bool: _defineProperty({}, operation, queryArray)
				};
			}
			return query;
		}

		function adjustQuery(originalQuery, conjunction, queryArray) {
			if (!queryArray) {
				return null;
			}
			var operation = getOperation(conjunction);
			var originalArray = originalQuery && originalQuery[operation] ? originalQuery[operation] : [];
			return _defineProperty({}, operation, originalArray.concat(queryArray));
		}

		return initialize();
	};
};

var serializeDepends = exports.serializeDepends = new SerializeDepends();

var prepareResultData = exports.prepareResultData = function prepareResultData(data, res) {
	var response = {
		err: null,
		res: null
	};
	if (data.error) {
		response.err = data;
	} else {
		response.res = {
			mode: data.mode,
			newData: data.newData,
			currentData: data.currentData,
			appliedQuery: data.appliedQuery
		};
		if (res) {
			response.res.took = res.took ? res.took : 0;
			response.res.total = res.hits && res.hits.total ? res.hits.total : 0;
		}
	}
	return response;
};

var combineStreamData = exports.combineStreamData = function combineStreamData(currentData, newData) {
	if (newData) {
		if (newData._deleted) {
			var hits = currentData.filter(function (hit) {
				return hit._id !== newData._id;
			});
			currentData = hits;
		} else {
			var _hits = currentData.filter(function (hit) {
				return hit._id !== newData._id;
			});
			currentData = _hits;
			currentData.unshift(newData);
		}
	}
	return currentData;
};

var updateStats = exports.updateStats = function updateStats(total, newData) {
	if (newData) {
		if (newData._deleted) {
			total -= 1;
		} else if (!newData._updated) {
			total += 1;
		}
	}
	return total;
};

var RecactivebaseComponents = exports.RecactivebaseComponents = [];