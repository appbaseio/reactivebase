var { EventEmitter } = require('fbemitter');
var $ = require('jquery');
var globalI = 0;
export var sensorEmitter = new EventEmitter();

export var watchForDependencyChange = function(actuate, previousSelectedSensor, cb, channelId, paginationCb, sortCb) {
	var self = this;
	globalI += 1;
	this.random = globalI;
	let selectedSensor = {};
	let sensorListener, paginationListener;
	// check if depend object already exists
	let checkDependExists = function(depend) {
		if (!previousSelectedSensor.hasOwnProperty(depend)) {
			previousSelectedSensor[depend] = '';
		}
	}
	// apply depend changes when new value received
	let applyDependChange = function(actuate, depend) {
		if (selectedSensor[depend] && typeof selectedSensor[depend] === 'object') {
			previousSelectedSensor[depend] = JSON.parse(JSON.stringify(selectedSensor[depend]));
		} else {
			previousSelectedSensor[depend] = selectedSensor[depend];
		}
		// if (!selectedSensor[depend].doNotExecute) {
			cb(depend, channelId);
		// }
	}

	// initialize the process
	this.init = function() {
		actuate.forEach((depend) => {
			checkDependExists(depend);
			if (typeof selectedSensor[depend] === 'object') {
				if (JSON.stringify(selectedSensor[depend]) !== JSON.stringify(previousSelectedSensor[depend])) {
					applyDependChange(actuate, depend);
				}
			} else {
				if (selectedSensor[depend] !== previousSelectedSensor[depend]) {
					applyDependChange(actuate, depend);
				}
			}
		});
	}

	this.start = function() {
		var self = this;
		this.sensorListener = sensorEmitter.addListener('sensorChange', function(data) {
			let foundDepend = false;
			for(let single in data) {
				if(actuate.indexOf(single) > -1) {
					foundDepend = true;
				}
			}
			if(foundDepend) {
				selectedSensor = data;
				self.init();
			}
		});

		this.paginationListener = sensorEmitter.addListener('paginationChange', function(data) {
			if (paginationCb) {
				if (actuate.indexOf(data.key) > -1) {
					paginationCb(data.value, channelId);
				}
			}
		});

		this.sortListener = sensorEmitter.addListener('sortChange', function(data) {
			if (sortCb) {
				sortCb(channelId);
			}
		});
	}

	this.stop = function() {
		if (this.sensorListener) {
			this.sensorListener.remove();
		}
		if (this.paginationListener) {
			this.paginationListener.remove();
		}
		if (this.sortListener) {
			this.sortListener.remove();
		}
	}

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
	let get = function(prop, obj) {
		if (obj) {
			return self[obj][prop];
		} else {
			if (prop) {
				return self.selectedSensor[prop];
			} else {
				return self.selectedSensor;
			}
		}
	}

	// Set
	let set = function(obj, isExecuteUpdate = false, setMethod = "sensorChange") {
		let methodObj;
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
	}

	// Set fieldname
	let setSensorInfo = function(obj) {
		self.sensorInfo[obj.key] = obj.value;
	}

	// Set sort info
	let setSortInfo = function(obj) {
		self.sortInfo[obj.key] = obj.value;
	}

	// Set pagination info
	let setPaginationInfo = function(obj) {
		self.paginationInfo[obj.key] = obj.value;
	}

	return {
		get: get,
		set: set,
		setSensorInfo: setSensorInfo,
		setSortInfo: setSortInfo,
		setPaginationInfo: setPaginationInfo
	};
};

export var selectedSensor = new selectedSensorFn();

export var ResponsiveStory = function() {
	function handleResponsive() {
		var height = $(window).height();
		$('.rbc.rbc-resultlist').css({
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
	$(window).resize(function() {
		handleResponsive();
	})
}

export var sizeValidation = function(props, propName, componentName) {
	if (props[propName] < 1 || props[propName] > 1000) {
		return new Error('Size value is invalid, it should be between 1 and 1000.');
	}
}

export var stepValidation = function(props, propName) {
	if (props[propName] > Math.floor((props['range']['end'] - props['range']['start'])/2)) {
		return new Error(`Step value is invalid, it should be less than or equal to ${Math.floor((props['range']['end'] - props['range']['start'])/2)}.`);
	} else if (props[propName] <= 0) {
		return new Error('Step value is invalid, it should be greater than 0.');
	}
}

export var validateThreshold = function(props, propName, componentName) {
	if(!(!isNaN(props[propName]) && props['end'] > props['start'])) {
		return new Error('Threshold value validation has failed, end value should be greater than start value.');
	}
	if (componentName == 'GeoDistanceDropdown' || componentName == 'GeoDistanceSlider') {
		if (props['start'] < 0) {
			return new Error('Threshold value is invalid, it should be greater than 0.');
		}
	}
}

export var valueValidation = function(props, propName) {
	const end = props['data']['end'] ? props['data']['end'] : props['defaultSelected'];
	const start = props['data']['start'] ? props['data']['start'] : props['defaultSelected'];
	if(!(!isNaN(props[propName]) && end >= props['defaultSelected'] && start <= props['defaultSelected'])) {
		return new Error('Default value validation has failed, Default value should be between start and end values.');
	}
}

export var validation = {
	resultListFrom: function(props, propName, componentName) {
		if (props[propName] < 0) {
			return new Error('From value is invalid, it should be greater than or equal to 0.');
		}
	}
}

var SerializeDepends = function() {
	let conjunctions = ['and', 'or', 'not'];
		
	this.serialize = function(depends) {
		let queries = [];
		let dependsList = [];
		let compId = 0;

		function initialize() {
			queries = checkConjunctions(depends, 0);
			console.log(queries);
			return {
				queries: queries,
				dependsList: dependsList
			};
		}

		function checkConjunctions(depend, parentId) {
			for(let conjunction in depend) {
				compId++;
				let res = addConjunction(conjunction, parentId, depend[conjunction], compId);
				queries.push(res);
				if(conjunctions.indexOf(conjunction) < 0) {
					addDependList(conjunction);
				}
			}
			return queries;
		}

		function addConjunction(conjunction, parentId, depend, compId) {
			let leaf = true;
			if(conjunctions.indexOf(conjunction) > -1) {
				let dependRes = addLeaf(depend, compId);
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
			let res = {
				parentId: parentId,
				componentId: compId,
				leaf: false,
				components: null
			};
			if(Object.prototype.toString.call(depend) === '[object Array]' ) {
				res.components = depend;
				res.leaf = true;
				addDependList(depend);
			}
			else if(typeof depend === 'string') {
				res.components = depend;
				res.leaf = true;
				addDependList(depend);
			}
			else {
				checkConjunctions(depend, parentId);
			}
			return res;
		}

		function addDependList(depend) {
			if(typeof depend === 'string') {
				addDep(depend);
			} else {
				depend.forEach((single) => {
					addDep(single);
				})
			}
			function addDep(dep) {
				if(dependsList.indexOf(dep) < 0) {
					dependsList.push(dep);
				}
			}
		}

		return initialize();
	}
	this.createQuery = function(serializeResult, dependsQuery) {
		let query = {};
		let serializeResultQuery = serializeResult.queries.map((query) => {
			query.checked = false;
			delete query.query;
			return query;
		});


		function initialize() {
			return checkAndMake();
		}

		function checkAndMake() {
			let uncheckedQueryFound = false;
			serializeResultQuery.forEach((dependParent) => {
				if(!dependParent.checked && canWeProceed(dependParent.componentId)) {
					dependParent.checked = true;
					uncheckedQueryFound = true;
					setQuery(dependParent);
				}
			});
			if(uncheckedQueryFound) {
				return checkAndMake();
			} else {
				return finalQuery();
			}
		}

		function finalQuery() {
			let query = {};
			let aggs = null;
			serializeResultQuery.forEach((sub) => {
				if(sub.parentId === 0) {
					if(sub.conjunction !== 'aggs') {
						query = Object.assign(query, sub.query);
					}
					else if(sub.conjunction === 'aggs') {
						aggs = sub.query;
					}
				}
			});
			let fullQuery = null;
			if(query && Object.keys(query).length) {
				fullQuery = {
					body: {
						query: {
							bool: query 
						}
					}
				}
			}
			if(aggs) {
				if(fullQuery) {
					fullQuery.body.aggs = aggs;
				} else {
					fullQuery = {
						body: {
							aggs: aggs
						}
					}
				}
			}
			return fullQuery;
		}

		function canWeProceed(componentId) {
			let children = serializeResultQuery.filter((query) => {
				return !query.checked && query.parentId === componentId;
			});
			let flag = children.length ? false : true;
			return flag;
		}

		function setQuery(depend) {
			let subQuery = [];
			let queryArray = null;
			let getParent = serializeResultQuery.filter((dep) => {
				return dep.componentId === depend.parentId;
			});
			
			if(Object.prototype.toString.call(depend.components) === '[object Array]' ) {
				depend.components.forEach((comp) => {
					if(dependsQuery[comp]) {
						if(queryArray) {
							queryArray.push(dependsQuery[comp]);
						} else {
							queryArray = [];
							queryArray.push(dependsQuery[comp]);
						}
					}
				});
			}
			else if(typeof depend.components === 'string') {
				if(dependsQuery[depend.components]) {
					queryArray = dependsQuery[depend.components];
				}
			}

			if(getParent && getParent.length) {
				subQuery = getParent[0].query ? adjustQuery(getParent[0].query, getParent[0].conjunction, queryArray) : createBoolQuery(getParent[0].conjunction, queryArray);
			} else {
				subQuery = queryArray;
			}
			if(subQuery) {
				serializeResultQuery = serializeResultQuery.map((dep) => {
					if(getParent.length && dep.componentId === getParent[0].componentId) {
						dep.query = subQuery;
					} else if(depend.parentId === 0 && dep.componentId === depend.componentId) {
						dep.query = subQuery;
					}
					return dep;
				});
			}
		}

		function createBoolQuery(conjunction, queryArray) {
			if(!queryArray) {
				return null;
			} else {
				let query = queryArray;
				let operation = getOperation(conjunction);
				if(conjunctions.indexOf(conjunction) > -1) {
					query = {
						[operation]: queryArray
					};
				}
				return query;
			}
		}

		function adjustQuery(originalQuery, conjunction, queryArray) {
			if(!queryArray) {
				return null;
			} else {
				let operation = getOperation(conjunction);
				let originalArray = originalQuery && originalQuery[operation] ? originalQuery[operation] : [];
				return {
					[operation]: originalArray.concat(queryArray)
				};
			}
		}

		function getOperation(conjunction) {
			let operation = null;
			switch(conjunction) {
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
	}
}

export var serializeDepends = new SerializeDepends();