'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('fbemitter');

var EventEmitter = _require.EventEmitter;

var $ = require('jquery');
var _ = require('lodash');
var globalI = 0;
var sensorEmitter = exports.sensorEmitter = new EventEmitter();

var watchForDependencyChange = exports.watchForDependencyChange = function watchForDependencyChange(react, previousSelectedSensor, cb, channelId, paginationCb, sortCb) {
	var self = this;
	globalI += 1;
	this.random = globalI;
	var selectedSensor = {};
	var sensorListener = void 0,
	    paginationListener = void 0;
	// check if depend object already exists
	var checkDependExists = function checkDependExists(depend) {
		if (!previousSelectedSensor.hasOwnProperty(depend)) {
			previousSelectedSensor[depend] = '';
		}
	};
	// apply depend changes when new value received
	var applyDependChange = function applyDependChange(react, depend) {
		if (selectedSensor[depend] && _typeof(selectedSensor[depend]) === 'object') {
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
			checkDependExists(depend);
			if (_typeof(selectedSensor[depend]) === 'object') {
				var newData = _(selectedSensor[depend]).toPairs().sortBy(0).fromPairs().value();
				var oldData = _(previousSelectedSensor[depend]).toPairs().sortBy(0).fromPairs().value();
				if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
					applyDependChange(react, depend);
				}
			} else {
				if (selectedSensor[depend] !== previousSelectedSensor[depend]) {
					applyDependChange(react, depend);
				}
			}
		});
	};

	this.start = function () {
		var self = this;
		this.sensorListener = sensorEmitter.addListener('sensorChange', function (data) {
			var foundDepend = false;
			for (var single in data) {
				if (react.indexOf(single) > -1) {
					foundDepend = true;
				}
			}
			if (foundDepend) {
				selectedSensor = data;
				self.init();
			}
		});

		this.paginationListener = sensorEmitter.addListener('paginationChange', function (data) {
			if (paginationCb) {
				if (react.indexOf(data.key) > -1) {
					paginationCb(data.value, channelId);
				}
			}
		});

		this.sortListener = sensorEmitter.addListener('sortChange', function (data) {
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

function selectedSensorFn() {
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
		} else {
			if (prop) {
				return self.selectedSensor[prop];
			} else {
				return self.selectedSensor;
			}
		}
	};

	// Set
	var set = function set(obj) {
		var isExecuteUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var setMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "sensorChange";

		var methodObj = void 0;
		switch (setMethod) {
			case 'sortChange':
				self.sortInfo[obj.key] = obj.value;
				methodObj = self.sortInfo;
				break;
			case 'paginationChange':
				self.selectedPagination[obj.key] = obj.value;
				methodObj = obj;
				break;
			case 'sensorChange':
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
};

var selectedSensor = exports.selectedSensor = new selectedSensorFn();

var ResponsiveStory = exports.ResponsiveStory = function ResponsiveStory() {
	function handleResponsive() {
		var height = $(window).height();
		$('.rbc.rbc-resultlist, .rbc.rbc-reactiveelement').css({
			maxHeight: height - 15 - paginationHeight()
		});
		$('.rbc.rbc-singlelist, .rbc.rbc-multilist').height(height - 100 - 15);
		$('.rbc-base > .row').css({
			'margin-bottom': 0
		});
		$('.rbc.rbc-nestedlist').css({
			maxHeight: height - 15
		});
		$('.rbc-reactivemap .rbc-container, .rbc.rbc-nestedlist').css({
			maxHeight: height
		});
	}

	function paginationHeight() {
		return $('.rbc-pagination').length * 85;
	}
	handleResponsive();
	$(window).resize(function () {
		handleResponsive();
	});
};

var sizeValidation = exports.sizeValidation = function sizeValidation(props, propName, componentName) {
	if (props[propName] < 1 || props[propName] > 1000) {
		return new Error('Size value is invalid, it should be between 1 and 1000.');
	}
};

var stepValidation = exports.stepValidation = function stepValidation(props, propName) {
	if (props[propName] > Math.floor((props['range']['end'] - props['range']['start']) / 2)) {
		return new Error('Step value is invalid, it should be less than or equal to ' + Math.floor((props['range']['end'] - props['range']['start']) / 2) + '.');
	} else if (props[propName] <= 0) {
		return new Error('Step value is invalid, it should be greater than 0.');
	}
};

var validateThreshold = exports.validateThreshold = function validateThreshold(props, propName, componentName) {
	if (!(!isNaN(props[propName]) && props['end'] > props['start'])) {
		return new Error('Threshold value validation has failed, end value should be greater than start value.');
	}
	if (componentName == 'GeoDistanceDropdown' || componentName == 'GeoDistanceSlider') {
		if (props['start'] <= 0) {
			return new Error('Threshold value is invalid, it should be greater than 0.');
		}
	}
};

var valueValidation = exports.valueValidation = function valueValidation(props, propName) {
	var end = props['data']['end'] ? props['data']['end'] : props['defaultSelected'];
	var start = props['data']['start'] ? props['data']['start'] : props['defaultSelected'];
	if (!(!isNaN(props[propName]) && end >= props['defaultSelected'] && start <= props['defaultSelected'])) {
		return new Error('Default value validation has failed, Default value should be between start and end values.');
	}
};

var validation = exports.validation = {
	resultListFrom: function resultListFrom(props, propName, componentName) {
		if (props[propName] < 0) {
			return new Error('From value is invalid, it should be greater than or equal to 0.');
		}
	}
};

var SerializeDepends = function SerializeDepends() {
	var conjunctions = ['and', 'or', 'not'];

	this.serialize = function (depends) {
		var queries = [];
		var dependsList = [];
		var compId = 0;

		function initialize() {
			queries = checkConjunctions(depends, 0);
			console.log(queries);
			return {
				queries: queries,
				dependsList: dependsList
			};
		}

		function checkConjunctions(depend, parentId) {
			for (var conjunction in depend) {
				compId++;
				var res = addConjunction(conjunction, parentId, depend[conjunction], compId);
				queries.push(res);
				if (conjunctions.indexOf(conjunction) < 0) {
					addDependList(conjunction);
				}
			}
			return queries;
		}

		function addConjunction(conjunction, parentId, depend, compId) {
			var leaf = true;
			if (conjunctions.indexOf(conjunction) > -1) {
				var dependRes = addLeaf(depend, compId);
				leaf = false;
				queries.push(dependRes);
			}
			return {
				parentId: parentId,
				componentId: compId,
				conjunction: conjunction,
				components: conjunction,
				leaf: leaf
			};
		}

		function addLeaf(depend, parentId) {
			compId++;
			var res = {
				parentId: parentId,
				componentId: compId,
				leaf: false,
				components: null
			};
			if (Object.prototype.toString.call(depend) === '[object Array]') {
				res.components = depend;
				res.leaf = true;
				addDependList(depend);
			} else if (typeof depend === 'string') {
				res.components = depend;
				res.leaf = true;
				addDependList(depend);
			} else {
				checkConjunctions(depend, parentId);
			}
			return res;
		}

		function addDependList(depend) {
			if (typeof depend === 'string') {
				addDep(depend);
			} else {
				depend.forEach(function (single) {
					addDep(single);
				});
			}
			function addDep(dep) {
				if (dependsList.indexOf(dep) < 0) {
					dependsList.push(dep);
				}
			}
		}

		return initialize();
	};
	this.createQuery = function (serializeResult, dependsQuery) {
		var query = {};
		var serializeResultQuery = serializeResult.queries.map(function (query) {
			query.checked = false;
			delete query.query;
			return query;
		});

		function initialize() {
			return checkAndMake();
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
			} else {
				return finalQuery();
			}
		}

		function finalQuery() {
			var query = {};
			var aggs = null;
			serializeResultQuery.forEach(function (sub) {
				if (sub.parentId === 0) {
					if (sub.conjunction !== 'aggs') {
						query = Object.assign(query, sub.query);
					} else if (sub.conjunction === 'aggs') {
						aggs = sub.query;
					}
				}
			});
			var fullQuery = null;
			if (query && Object.keys(query).length) {
				fullQuery = {
					body: {
						query: {
							bool: query
						}
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

		function canWeProceed(componentId) {
			var children = serializeResultQuery.filter(function (query) {
				return !query.checked && query.parentId === componentId;
			});
			var flag = children.length ? false : true;
			return flag;
		}

		function setQuery(depend) {
			var subQuery = [];
			var queryArray = null;
			var getParent = serializeResultQuery.filter(function (dep) {
				return dep.componentId === depend.parentId;
			});

			if (Object.prototype.toString.call(depend.components) === '[object Array]') {
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
			} else if (typeof depend.components === 'string') {
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

		function createBoolQuery(conjunction, queryArray) {
			if (!queryArray) {
				return null;
			} else {
				var _query = queryArray;
				var operation = getOperation(conjunction);
				if (conjunctions.indexOf(conjunction) > -1) {
					_query = _defineProperty({}, operation, queryArray);
				}
				return _query;
			}
		}

		function adjustQuery(originalQuery, conjunction, queryArray) {
			if (!queryArray) {
				return null;
			} else {
				var operation = getOperation(conjunction);
				var originalArray = originalQuery && originalQuery[operation] ? originalQuery[operation] : [];
				return _defineProperty({}, operation, originalArray.concat(queryArray));
			}
		}

		function getOperation(conjunction) {
			var operation = null;
			switch (conjunction) {
				case 'and':
					operation = 'must';
					break;
				case 'or':
					operation = 'should';
					break;
				case 'not':
					operation = 'must_not';
					break;
			}
			return operation;
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