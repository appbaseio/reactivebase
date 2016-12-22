var {EventEmitter} = require('fbemitter');
export var sensorEmitter = new EventEmitter();

export var watchForDependencyChange = function(depends, previousSelectedSensor, cb, channelId) {
	var self = this;
	let selectedSensor = {};
	// check if depend object already exists
	let checkDependExists = function(depend) {
		if(!previousSelectedSensor.hasOwnProperty(depend)) {
			previousSelectedSensor[depend] = '';
		}
	}
	// apply depend changes when new value received
	let applyDependChange = function(depends, depend) {
		if(selectedSensor[depend] && typeof selectedSensor[depend] === 'object') {
			previousSelectedSensor[depend] = JSON.parse(JSON.stringify(selectedSensor[depend]));
		} else {
			previousSelectedSensor[depend] = selectedSensor[depend];
		}
		if(!depends[depend].doNotExecute) {
			cb(depend, channelId);
		}
	}

	// initialize the process
	let init = function() {
		for(let depend in depends) {
			checkDependExists(depend);
			if(typeof selectedSensor[depend] === 'object') {
				if(JSON.stringify(selectedSensor[depend]) !== JSON.stringify(previousSelectedSensor[depend])) {
					applyDependChange(depends, depend);
				}
			} else {
				if(selectedSensor[depend] !== previousSelectedSensor[depend]) {
					applyDependChange(depends, depend);
				}
			}
		}
	}

	sensorEmitter.addListener('sensorChange', function(data) {
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
	let get = function(prop, obj) {
		if(obj) {
			return self[obj][prop];
		}
		else {
			if(prop) {
				return self.selectedSensor[prop];
			} else {
				return self.selectedSensor;
			}
		}
	}

	// Set
	let set = function(obj, isExecuteUpdate=false) {
		self.selectedSensor[obj.key] = obj.value;
		if(isExecuteUpdate) {
			sensorEmitter.emit('sensorChange', self.selectedSensor);
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

	return {
		get: get,
		set: set,
		setSensorInfo: setSensorInfo,
		setSortInfo: setSortInfo
	};
};

export var selectedSensor = new selectedSensorFn();
