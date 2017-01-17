var {EventEmitter} = require('fbemitter');
var $ = require('jquery');
export var sensorEmitter = new EventEmitter();

export var watchForDependencyChange = function(depends, previousSelectedSensor, cb, channelId, paginationCb, sortCb) {
	var self = this;
	let selectedSensor = {};
	let sensorListener, paginationListener;
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

	sensorEmitter.addListener('paginationChange', function(data) {
		if(paginationCb) {
			if(Object.keys(depends).indexOf(data.key) > -1) {
				paginationCb(data.value, channelId);
			}
		}
	});

	sensorEmitter.addListener('sortChange', function(data) {
		if(sortCb) {
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
	let set = function(obj, isExecuteUpdate=false, setMethod="sensorChange") {
		let methodObj;
		switch(setMethod) {
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
		if(isExecuteUpdate) {
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

export var ResponsiveStory = function () {
	function handleResponsive() {
		var height = $(window).height();
		$('.rbc.rbc-resultlist').css({
			maxHeight: height - 15
		});
		$('.rbc.rbc-singlelist, .rbc.rbc-multilist, .rbc.rbc-nestedlist').height(height - 100 - 15);
		$('.rbc-base > .row').css({
			'margin-bottom': 0
		});
	}
	handleResponsive();
	$(window).resize(function() {
		handleResponsive();
	})
}
