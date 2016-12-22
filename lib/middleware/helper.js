'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require('fbemitter'),
    EventEmitter = _require.EventEmitter;

var sensorEmitter = exports.sensorEmitter = new EventEmitter();

var watchForDependencyChange = exports.watchForDependencyChange = function watchForDependencyChange(depends, previousSelectedSensor, cb, channelId) {
	var self = this;
	var selectedSensor = {};
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
};

function selectedSensorFn() {
	var self = this;
	this.selectedSensor = {};
	this.sensorInfo = {};
	this.sortInfo = {};

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

		self.selectedSensor[obj.key] = obj.value;
		if (isExecuteUpdate) {
			sensorEmitter.emit('sensorChange', self.selectedSensor);
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

	return {
		get: get,
		set: set,
		setSensorInfo: setSensorInfo,
		setSortInfo: setSortInfo
	};
};

var selectedSensor = exports.selectedSensor = new selectedSensorFn();