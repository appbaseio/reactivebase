'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require('fbemitter'),
    EventEmitter = _require.EventEmitter;

var sensorEmitter = exports.sensorEmitter = new EventEmitter();

var watchForDependencyChange = exports.watchForDependencyChange = function watchForDependencyChange(depends, previousSelectedSensor, cb, channelId, paginationCb, sortCb) {
	var self = this;
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
	var applyDependChange = function applyDependChange(depends, depend) {
		if (selectedSensor[depend] && _typeof(selectedSensor[depend]) === 'object') {
			previousSelectedSensor[depend] = JSON.parse(JSON.stringify(selectedSensor[depend]));
		} else {
			previousSelectedSensor[depend] = selectedSensor[depend];
		}
		if (!depends[depend].doNotExecute) {
			cb(depend, channelId);
		}
	};

	// initialize the process
	var init = function init() {
		for (var depend in depends) {
			checkDependExists(depend);
			if (_typeof(selectedSensor[depend]) === 'object') {
				if (JSON.stringify(selectedSensor[depend]) !== JSON.stringify(previousSelectedSensor[depend])) {
					applyDependChange(depends, depend);
				}
			} else {
				if (selectedSensor[depend] !== previousSelectedSensor[depend]) {
					applyDependChange(depends, depend);
				}
			}
		}
	};

	sensorEmitter.addListener('sensorChange', function (data) {
		selectedSensor = data;
		init();
	});

	sensorEmitter.addListener('paginationChange', function (data) {
		if (paginationCb) {
			if (Object.keys(depends).indexOf(data.key) > -1) {
				paginationCb(data.value, channelId);
			}
		}
	});

	sensorEmitter.addListener('sortChange', function (data) {
		if (sortCb) {
			sortCb(channelId);
		}
	});
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