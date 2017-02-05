'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require('fbemitter'),
    EventEmitter = _require.EventEmitter;

var $ = require('jquery');
var globalI = 0;
var sensorEmitter = exports.sensorEmitter = new EventEmitter();

var watchForDependencyChange = exports.watchForDependencyChange = function watchForDependencyChange(actuate, previousSelectedSensor, cb, channelId, paginationCb, sortCb) {
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
	var applyDependChange = function applyDependChange(actuate, depend) {
		if (selectedSensor[depend] && _typeof(selectedSensor[depend]) === 'object') {
			previousSelectedSensor[depend] = JSON.parse(JSON.stringify(selectedSensor[depend]));
		} else {
			previousSelectedSensor[depend] = selectedSensor[depend];
		}
		if (!actuate[depend].doNotExecute) {
			cb(depend, channelId);
		}
	};

	// initialize the process
	this.init = function () {
		for (var depend in actuate) {
			checkDependExists(depend);
			if (_typeof(selectedSensor[depend]) === 'object') {
				if (JSON.stringify(selectedSensor[depend]) !== JSON.stringify(previousSelectedSensor[depend])) {
					applyDependChange(actuate, depend);
				}
			} else {
				if (selectedSensor[depend] !== previousSelectedSensor[depend]) {
					applyDependChange(actuate, depend);
				}
			}
		}
	};

	this.start = function () {
		var self = this;
		this.sensorListener = sensorEmitter.addListener('sensorChange', function (data) {
			selectedSensor = data;
			self.init();
		});

		this.paginationListener = sensorEmitter.addListener('paginationChange', function (data) {
			if (paginationCb) {
				if (Object.keys(actuate).indexOf(data.key) > -1) {
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
		$('.rbc.rbc-resultlist').css({
			maxHeight: height - 15 - paginationHeight()
		});
		$('.rbc.rbc-singlelist, .rbc.rbc-multilist, .rbc.rbc-nestedlist').height(height - 100 - 15);
		$('.rbc-base > .row').css({
			'margin-bottom': 0
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
		return new Error('Threshold value validation is failed, end value should be greater than start value.');
	}
};

var validation = exports.validation = {
	resultListFrom: function resultListFrom(props, propName, componentName) {
		if (props[propName] < 0) {
			return new Error('From value is invalid, it should be greater than or equal to 0.');
		}
	}
};