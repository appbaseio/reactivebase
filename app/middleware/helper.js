/* eslint max-lines: 0 */
import { EventEmitter } from "fbemitter";
import _ from "lodash";

let globalI = 0;
export const sensorEmitter = new EventEmitter();

export const WatchForDependencyChange = function (react, previousSelectedSensor, cb, channelId, paginationCb, sortCb) {
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
	const applyDependChange = function (currentReact, depend, rbcInitialize) {
		if (selectedSensor[depend] && typeof selectedSensor[depend] === "object") {
			previousSelectedSensor[depend] = JSON.parse(JSON.stringify(selectedSensor[depend]));
		} else {
			previousSelectedSensor[depend] = selectedSensor[depend];
		}
		if (!rbcInitialize) {
			cb(depend, channelId);
		}
	};

	// initialize the process
	this.init = function (rbcInitialize=false) {
		react.forEach((depend) => {
			if (!(depend.indexOf("channel-options-") > -1 || depend.indexOf("aggs") > -1)) {
				checkDependExists(depend);
				if (typeof selectedSensor[depend] === "object") {
					if (!_.isEqual(selectedSensor[depend], previousSelectedSensor[depend])) {
						applyDependChange(react, depend, rbcInitialize);
					}
				} else if (selectedSensor[depend] !== previousSelectedSensor[depend]) {
					applyDependChange(react, depend, rbcInitialize);
				}
			}
		});
	};

	this.start = function () {
		const self = this;
		this.sensorListener = sensorEmitter.addListener("sensorChange", (data) => {
			let foundDepend = false;
			const dataValue = data.rbcInitialize ? data.value : data;
			Object.keys(dataValue).forEach((item) => {
				if (item.indexOf("channel-options-") < 0 && react.indexOf(item) > -1) {
					foundDepend = true;
				}
			});

			if (foundDepend) {
				selectedSensor = data;
				self.init(data.rbcInitialize);
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

function SelectedSensorFn() {
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
		if(obj.value && obj.value.defaultSelected) {
			self.selectedSensor[obj.key] = obj.value.defaultSelected;
		}
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

export const selectedSensor = new SelectedSensorFn();

const SerializeDepends = function () {
	const conjunctions = ["and", "or", "not"];

	this.serialize = function (depends) {
		let queries = [];
		const dependsList = [];
		let compId = 0;

		function addDependList(depend) {
			function addDep(dep) {
				if (dependsList.indexOf(dep) < 0) {
					dependsList.push(dep);
				}
			}

			if (typeof depend === "string") {
				addDep(depend);
			} else {
				depend.forEach((single) => {
					addDep(single);
				});
			}
		}

		function checkConjunctions(depend, parentId) {
			Object.keys(depend).forEach((conjunction) => {
				compId += 1;
				const res = addConjunction(conjunction, parentId, depend[conjunction], compId);
				queries.push(res);
				if (conjunctions.indexOf(conjunction) < 0) {
					addDependList(conjunction);
				}
			});
			return queries;
		}

		function addLeaf(depend, parentId) {
			compId += 1;
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
			} else {
				checkConjunctions(depend, parentId);
			}
			return res;
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

		function initialize() {
			queries = checkConjunctions(depends, 0);
			return {
				queries,
				dependsList
			};
		}

		return initialize();
	};

	this.createQuery = function (serializeResult, dependsQuery) {
		let serializeResultQuery = serializeResult.queries.map((query) => {
			query.checked = false;
			delete query.query;
			return query;
		});
		

		function setQuery(depend) {
			let subQuery = [];
			let queryArray = null;
			const getParent = serializeResultQuery.filter(dep => dep.componentId === depend.parentId);
			if (_.isArray(depend.components)) {
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

		function canWeProceed(componentId) {
			const children = serializeResultQuery.filter(query => !query.checked && query.parentId === componentId);
			const flag = !children.length;
			return flag;
		}

		function mixQuery() {
			serializeResultQuery.forEach((sub) => {
				setnewquery(sub);
			});
		}

		function setnewquery(sub) {
			if(!sub.query && sub.components) {
				sub.query = [];
				const child = serializeResultQuery.filter(item => item.parentId === sub.componentId);
				child.forEach((sub2, index2) => {
					const semiquery = setnewquery(sub2);
					if(semiquery) {
						if(_.isArray(semiquery)) {
							if(semiquery.length) {
								sub.query.push(semiquery);
							}
						} else {
							sub.query.push(semiquery);
						}
					}
					if(index2 === child.length -1 && sub.query.length && sub.conjunction && sub.conjunction !== "aggs") {
						sub.query = createBoolQuery(sub.conjunction, sub.query);
					}
				});
			} else {
				return sub.query;
			}
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
							aggs
						}
					};
				}
			}
			return fullQuery;
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
			mixQuery();
			return finalQuery();
		}

		function initialize() {
			return checkAndMake();
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
				default: operation = "must";
			}
			return operation;
		}

		function createBoolQuery(conjunction, queryArray) {
			if (!queryArray) {
				return null;
			}
			let query = queryArray;
			const operation = getOperation(conjunction);
			if (conjunctions.indexOf(conjunction) > -1) {
				query = {
					bool: {
						[operation]: queryArray
					}
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

		return initialize();
	};
};

export const serializeDepends = new SerializeDepends();

export const prepareResultData = function (data, res) {
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

export const combineStreamData = function (currentData, newData) {
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

export const updateStats = function (total, newData) {
	if (newData) {
		if (newData._deleted) {
			total -= 1;
		} else if (!newData._updated) {
			total += 1;
		}
	}
	return total;
};

export const RecactivebaseComponents = [];

export * from "./utils";

export * from "./URLParams";
