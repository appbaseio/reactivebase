const $ = require("jquery");

export const ResponsiveStory = function () {
	const paginationHeight = () => {
		return $(".rbc-pagination").length * 85;
	}

	const getHeight = item => item.height() ? item.height() : 0;

	const handleResponsive = () => {
		var height = $(window).height();
		const resultHeight = height - 15;
		$(".rbc.rbc-reactivelist, .rbc.rbc-reactiveelement").css({
			maxHeight: resultHeight
		});
		const $component = [$(".rbc.rbc-singlelist"), $(".rbc.rbc-multilist"), $(".rbc.rbc-nestedlist"), $(".rbc.rbc-tagcloud")];
		$component.forEach((item) => {
			if(item.length) {
				const itemHeader = getHeight(item.find(".rbc-title")) + getHeight(item.find(".rbc-search-container"))
				item.find(".rbc-list-container").css({maxHeight: height - itemHeader - 35})
			}
		})
		$(".rbc-base > .row").css({
			"margin-bottom": 0
		});
		$(".rbc-reactivemap .rbc-container").css({
			maxHeight: height
		});
	}

	handleResponsive();

	$(window).resize(() => {
		handleResponsive();
	});
};

export const sizeValidation = function (props, propName) {
	let err = null;
	if (props[propName] < 1 || props[propName] > 1000) {
		err = new Error("Size value is invalid, it should be between 1 and 1000.");
	}
	return err;
};

export const stepValidation = function (props, propName) {
	let err = null;
	if (props[propName] > Math.floor((props.range.end - props.range.start) / 2)) {
		err = new Error(`Step value is invalid, it should be less than or equal to ${Math.floor((props.range.end - props.range.start) / 2)}.`);
	} else if (props[propName] <= 0) {
		err = new Error("Step value is invalid, it should be greater than 0.");
	}
	return err;
};

export const validateThreshold = function (props, propName, componentName) {
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

export const valueValidation = function (props, propName) {
	let err = null;
	const end = props.data.end ? props.data.end : props.defaultSelected;
	const start = props.data.start ? props.data.start : props.defaultSelected;
	if (!(!isNaN(props[propName]) && end >= props.defaultSelected && start <= props.defaultSelected)) {
		err = new Error("Default value validation has failed, Default value should be between start and end values.");
	}
	return err;
};

export const validation = {
	resultListFrom(props, propName) {
		let err = null;
		if (props[propName] < 0) {
			err = new Error("From value is invalid, it should be greater than or equal to 0.");
		}
		return err;
	}
};

export const reactiveBaseValidation = (props, propName) => {
	let err = null;
	if(!props.credentials) {
		err = new Error("ReactiveBase expects credentials as a prop instead of username:password.");
	}
	return err;
}