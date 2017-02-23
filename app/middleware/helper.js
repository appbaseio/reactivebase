const { EventEmitter } = require("fbemitter");
const $ = require("jquery");
const _ = require("lodash");

let globalI = 0;
export const sensorEmitter = new EventEmitter();

export const watchForDependencyChange = function (react, previousSelectedSensor, cb, channelId, paginationCb, sortCb) {
	globalI += 1;
	this.random = globalI;
	let selectedSensor = {};
	// check if depend object already exists
	const checkDependExists = function (depend) {
		if (!Object.prototype.hasOwnProperty.call(previousSelectedSensor, depend)) {
			previousSelectedSensor[depend] = "";
		}
	};
	// apply depend changes when new value received
	const applyDependChange = function (currentReact, depend) {
		if (selectedSensor[depend] && typeof selectedSensor[depend] === "object") {
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
		react.forEach((depend) => {
			checkDependExists(depend);
			if (typeof selectedSensor[depend] === "object") {
				const newData = _(selectedSensor[depend]).toPairs().sortBy(0).fromPairs().value();
				const oldData = _(previousSelectedSensor[depend]).toPairs().sortBy(0).fromPairs().value();
				if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
					applyDependChange(react, depend);
				}
			} else if (selectedSensor[depend] !== previousSelectedSensor[depend]) {
				applyDependChange(react, depend);
			}
		});
	};

	this.start = function () {
		const self = this;
		this.sensorListener = sensorEmitter.addListener("sensorChange", (data) => {
			let foundDepend = false;
			for (const single in data) {
				if (react.indexOf(single) > -1) {
					foundDepend = true;
				}
			}
			if (foundDepend) {
				selectedSensor = data;
				self.init();
			}
		});

		this.paginationListener = sensorEmitter.addListener("paginationChange", (data) => {
			if (paginationCb) {
				if (react.indexOf(data.key) > -1) {
					paginationCb(data.value, channelId);
				}
			}
		});

		this.sortListener = sensorEmitter.addListener("sortChange", () => {
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
	const self = this;
	this.sensorInfo = {};
	this.selectedSensor = {};
	this.paginationInfo = {};
	this.selectedPagination = {};
	this.sortInfo = {};
	this.selectedSort = {};

	// Get
	const get = function (prop, obj) {
		if (obj) {
			return self[obj][prop];
		}
		if (prop) {
			return self.selectedSensor[prop];
		}
		return self.selectedSensor;
	};

	// Set
	const set = function (obj, isExecuteUpdate = false, setMethod = "sensorChange") {
		let methodObj;
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
	const setSensorInfo = function (obj) {
		self.sensorInfo[obj.key] = obj.value;
	};

	// Set sort info
	const setSortInfo = function (obj) {
		self.sortInfo[obj.key] = obj.value;
	};

	// Set pagination info
	const setPaginationInfo = function (obj) {
		self.paginationInfo[obj.key] = obj.value;
	};

	return {
		get,
		set,
		setSensorInfo,
		setSortInfo,
		setPaginationInfo
	};
}

export var selectedSensor = new selectedSensorFn();

export var ResponsiveStory = function () {
	function handleResponsive() {
		const height = $(window).height();
		$(".rbc.rbc-reactivelist, .rbc.rbc-reactiveelement").css({
			maxHeight: height - 15 - paginationHeight()
		});
		$(".rbc.rbc-singlelist, .rbc.rbc-multilist, .rbc.rbc-nestedlist").css({
			maxHeight: height - 15
		});
		$(".rbc-base > .row").css({
			"margin-bottom": 0
		});
		$(".rbc-reactivemap .rbc-container").css({
			maxHeight: height
		});
	}

	function paginationHeight() {
		return $(".rbc-pagination").length * 85;
	}
	handleResponsive();
	$(window).resize(() => {
		handleResponsive();
	});
};

export var sizeValidation = function (props, propName) {
	let err = null;
	if (props[propName] < 1 || props[propName] > 1000) {
		err = new Error("Size value is invalid, it should be between 1 and 1000.");
	}
	return err;
};

export var stepValidation = function (props, propName) {
	let err = null;
	if (props[propName] > Math.floor((props.range.end - props.range.start) / 2)) {
		err = new Error(`Step value is invalid, it should be less than or equal to ${Math.floor((props.range.end - props.range.start) / 2)}.`);
	} else if (props[propName] <= 0) {
		err = new Error("Step value is invalid, it should be greater than 0.");
	}
	return err;
};

export var validateThreshold = function (props, propName, componentName) {
	let err = null;
	if (!(!isNaN(props[propName]) && props.end > props.start)) {
		err = new Error("Threshold value validation has failed, end value should be greater than start value.");
	}
	if (componentName === "GeoDistanceDropdown" || componentName === "GeoDistanceSlider") {
		if (props.start <= 0) {
			err = new Error("Threshold value is invalid, it should be greater than 0.");
		}
	}
	return err;
};

export var valueValidation = function (props, propName) {
	let err = null;
	const end = props.data.end ? props.data.end : props.defaultSelected;
	const start = props.data.start ? props.data.start : props.defaultSelected;
	if (!(!isNaN(props[propName]) && end >= props.defaultSelected && start <= props.defaultSelected)) {
		err = new Error("Default value validation has failed, Default value should be between start and end values.");
	}
	return err;
};

export var validation = {
	resultListFrom(props, propName) {
		let err = null;
		if (props[propName] < 0) {
			err = new Error("From value is invalid, it should be greater than or equal to 0.");
		}
		return err;
	}
};

const SerializeDepends = function () {
	const conjunctions = ["and", "or", "not"];

	this.serialize = function (depends) {
		let queries = [];
		const dependsList = [];
		let compId = 0;

		function initialize() {
			queries = checkConjunctions(depends, 0);
			return {
				queries,
				dependsList
			};
		}

		function checkConjunctions(depend, parentId) {
			for (const conjunction in depend) {
				compId++;
				const res = addConjunction(conjunction, parentId, depend[conjunction], compId);
				queries.push(res);
				if (conjunctions.indexOf(conjunction) < 0) {
					addDependList(conjunction);
				}
			}
			return queries;
		}

		function addConjunction(conjunction, parentId, depend, currentCompId) {
			let leaf = true;
			if (conjunctions.indexOf(conjunction) > -1) {
				const dependRes = addLeaf(depend, currentCompId);
				leaf = false;
				queries.push(dependRes);
			}
			return {
				parentId,
				componentId: currentCompId,
				conjunction,
				components: conjunction,
				leaf
			};
		}

		function addLeaf(depend, parentId) {
			compId++;
			const res = {
				parentId,
				componentId: compId,
				leaf: false,
				components: null
			};
			if (Object.prototype.toString.call(depend) === "[object Array]") {
				res.components = depend;
				res.leaf = true;
				addDependList(depend);
			}			else if (typeof depend === "string") {
				res.components = depend;
				res.leaf = true;
				addDependList(depend);
			}			else {
				checkConjunctions(depend, parentId);
			}
			return res;
		}

		function addDependList(depend) {
			if (typeof depend === "string") {
				addDep(depend);
			} else {
				depend.forEach((single) => {
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
		let serializeResultQuery = serializeResult.queries.map((query) => {
			query = query || {};
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
				if (!dependParent.checked && canWeProceed(dependParent.componentId)) {
					dependParent.checked = true;
					uncheckedQueryFound = true;
					setQuery(dependParent);
				}
			});
			if (uncheckedQueryFound) {
				return checkAndMake();
			}
			return finalQuery();
		}

		function finalQuery() {
			let query = {};
			let aggs = null;
			serializeResultQuery.forEach((sub) => {
				if (sub.parentId === 0) {
					if (sub.conjunction !== "aggs") {
						query = Object.assign(query, sub.query);
					}					else if (sub.conjunction === "aggs") {
						aggs = sub.query;
					}
				}
			});
			let fullQuery = null;
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
							aggs
						}
					};
				}
			}
			return fullQuery;
		}

		function canWeProceed(componentId) {
			const children = serializeResultQuery.filter(query => !query.checked && query.parentId === componentId);
			const flag = !children.length;
			return flag;
		}

		function setQuery(depend) {
			let subQuery = [];
			let queryArray = null;
			const getParent = serializeResultQuery.filter(dep => dep.componentId === depend.parentId);

			if (Object.prototype.toString.call(depend.components) === "[object Array]") {
				depend.components.forEach((comp) => {
					if (dependsQuery[comp]) {
						if (queryArray) {
							queryArray.push(dependsQuery[comp]);
						} else {
							queryArray = [];
							queryArray.push(dependsQuery[comp]);
						}
					}
				});
			}			else if (typeof depend.components === "string") {
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
				serializeResultQuery = serializeResultQuery.map((dep) => {
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
			}
			let query = queryArray;
			const operation = getOperation(conjunction);
			if (conjunctions.indexOf(conjunction) > -1) {
				query = {
					[operation]: queryArray
				};
			}
			return query;
		}

		function adjustQuery(originalQuery, conjunction, queryArray) {
			if (!queryArray) {
				return null;
			}
			const operation = getOperation(conjunction);
			const originalArray = originalQuery && originalQuery[operation] ? originalQuery[operation] : [];
			return {
				[operation]: originalArray.concat(queryArray)
			};
		}

		function getOperation(conjunction) {
			let operation = null;
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
			}
			return operation;
		}
		return initialize();
	};
};

export var serializeDepends = new SerializeDepends();

export var prepareResultData = function (data, res) {
	const response = {
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

export var combineStreamData = function (currentData, newData) {
	if (newData) {
		if (newData._deleted) {
			const hits = currentData.filter(hit => hit._id !== newData._id);
			currentData = hits;
		} else {
			const hits = currentData.filter(hit => hit._id !== newData._id);
			currentData = hits;
			currentData.unshift(newData);
		}
	}
	return currentData;
};

export var updateStats = function (total, newData) {
	if (newData) {
		if (newData._deleted) {
			total -= 1;
		} else if (newData._updated) {
			total = total;
		} else {
			total += 1;
		}
	}
	return total;
};
