var { EventEmitter } = require('fbemitter');
var $ = require('jquery');
var globalI = 0;
export var sensorEmitter = new EventEmitter();

export var watchForDependencyChange = function(depends, previousSelectedSensor, cb, channelId, paginationCb, sortCb) {
	var self = this;
	globalI += 1;
	this.random = globalI;
	console.log('Created - ', self.random);
	let selectedSensor = {};
	let sensorListener, paginationListener;
	// check if depend object already exists
	let checkDependExists = function(depend) {
			if (!previousSelectedSensor.hasOwnProperty(depend)) {
				previousSelectedSensor[depend] = '';
			}
		}
		// apply depend changes when new value received
	let applyDependChange = function(depends, depend) {
		if (selectedSensor[depend] && typeof selectedSensor[depend] === 'object') {
			previousSelectedSensor[depend] = JSON.parse(JSON.stringify(selectedSensor[depend]));
		} else {
			previousSelectedSensor[depend] = selectedSensor[depend];
		}
		if (!depends[depend].doNotExecute) {
			cb(depend, channelId);
		}
	}

	// initialize the process
	this.init = function() {
		for (let depend in depends) {
			checkDependExists(depend);
			if (typeof selectedSensor[depend] === 'object') {
				if (JSON.stringify(selectedSensor[depend]) !== JSON.stringify(previousSelectedSensor[depend])) {
					applyDependChange(depends, depend);
				}
			} else {
				if (selectedSensor[depend] !== previousSelectedSensor[depend]) {
					applyDependChange(depends, depend);
				}
			}
		}
	}

	this.start = function() {
		var self = this;
		this.sensorListener = sensorEmitter.addListener('sensorChange', function(data) {
			selectedSensor = data;
			console.log('Listening - ', self.random);
			self.init();
		});

		this.paginationListener = sensorEmitter.addListener('paginationChange', function(data) {
			if (paginationCb) {
				if (Object.keys(depends).indexOf(data.key) > -1) {
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
		console.log('Stopped - ', this.random);
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
		$('.rbc.rbc-singlelist, .rbc.rbc-multilist, .rbc.rbc-nestedlist').height(height - 100 - 15);
		$('.rbc-base > .row').css({
			'margin-bottom': 0
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
	if (props[propName] <= 0 || props[propName] >= 1000) {
		return new Error('Size value is invalid, it should be between 0 and 1000.');
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
		return new Error('Threshold value validation is failed, end value should be greater than start value.');
	}
}

export var validation = {
	resultListFrom: function(props, propName, componentName) {
		if (props[propName] < 0) {
			return new Error('From value is invalid, it should be greater than or equal to 0.');
		}
	}
}
