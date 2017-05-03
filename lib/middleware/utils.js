"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var $ = require("jquery");

var ResponsiveStory = exports.ResponsiveStory = function ResponsiveStory() {
	var paginationHeight = function paginationHeight() {
		return $(".rbc-pagination").length * 85;
	};

	var getHeight = function getHeight(item) {
		return item.height() ? item.height() : 0;
	};

	var handleResponsive = function handleResponsive() {
		var height = $(window).height();
		var resultHeight = height - 15;
		$(".rbc.rbc-reactivelist, .rbc.rbc-reactiveelement").css({
			maxHeight: resultHeight
		});
		var $component = [$(".rbc.rbc-singlelist"), $(".rbc.rbc-multilist"), $(".rbc.rbc-nestedlist"), $(".rbc.rbc-tagcloud")];
		$component.forEach(function (item) {
			if (item.length) {
				var itemHeader = getHeight(item.find(".rbc-title")) + getHeight(item.find(".rbc-search-container"));
				item.find(".rbc-list-container").css({ maxHeight: height - itemHeader - 35 });
			}
		});
		$(".rbc-base > .row").css({
			"margin-bottom": 0
		});
		$(".rbc-reactivemap .rbc-container").css({
			maxHeight: height
		});
	};

	handleResponsive();

	$(window).resize(function () {
		handleResponsive();
	});
};

var sizeValidation = exports.sizeValidation = function sizeValidation(props, propName) {
	var err = null;
	if (props[propName] < 1 || props[propName] > 1000) {
		err = new Error("Size value is invalid, it should be between 1 and 1000.");
	}
	return err;
};

var stepValidation = exports.stepValidation = function stepValidation(props, propName) {
	var err = null;
	if (props[propName] > Math.floor((props.range.end - props.range.start) / 2)) {
		err = new Error("Step value is invalid, it should be less than or equal to " + Math.floor((props.range.end - props.range.start) / 2) + ".");
	} else if (props[propName] <= 0) {
		err = new Error("Step value is invalid, it should be greater than 0.");
	}
	return err;
};

var validateThreshold = exports.validateThreshold = function validateThreshold(props, propName, componentName) {
	var err = null;
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

var valueValidation = exports.valueValidation = function valueValidation(props, propName) {
	var err = null;
	var end = props.data.end ? props.data.end : props.defaultSelected;
	var start = props.data.start ? props.data.start : props.defaultSelected;
	if (!(!isNaN(props[propName]) && end >= props.defaultSelected && start <= props.defaultSelected)) {
		err = new Error("Default value validation has failed, Default value should be between start and end values.");
	}
	return err;
};

var validation = exports.validation = {
	resultListFrom: function resultListFrom(props, propName) {
		var err = null;
		if (props[propName] < 0) {
			err = new Error("From value is invalid, it should be greater than or equal to 0.");
		}
		return err;
	}
};

var reactiveBaseValidation = exports.reactiveBaseValidation = function reactiveBaseValidation(props, propName) {
	var err = null;
	if (!props.credentials) {
		err = new Error("ReactiveBase expects credentials as a prop instead of username:password.");
	}
	return err;
};

var dateFormat = exports.dateFormat = {
	"epoch_millis": "x",
	"epoch_seconds": "X",
	"date": "YYYY-MM-DD",
	"date_time": "YYYY-MM-DDTHH:mm:ss.SSSZZ",
	"date_time_no_millis": "YYYY-MM-DDTHH:mm:ssZZ",
	"basic_date": "YYYYMMDD",
	"basic_date_time": "YYYYMMDDTHHmmss.SSSZ",
	"basic_date_time_no_millis": "YYYYMMDDTHHmmssZ",
	"basic_time": "HHmmss.SSSZ",
	"basic_time_no_millis": "HHmmssZ"
};