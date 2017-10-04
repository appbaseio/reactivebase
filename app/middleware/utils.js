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

export const pagesValidation = function (props, propName) {
	let err = null;
	if (!(!isNaN(props[propName]) && props[propName] > 2 && props[propName] < 21)) {
		err = new Error("Pages should be between 3 and 20.");
	}
	return err;
};

export const reactiveBaseValidation = (props, propName) => {
	let err = null;
	if (!props.credentials && !props.url) {
		err = new Error("ReactiveBase expects credentials as a prop instead of username:password.");
	}
	return err;
};

export const dateFormat = {
	epoch_millis: "x",
	epoch_seconds: "X",
	date: "YYYY-MM-DD",
	date_time: "YYYY-MM-DDTHH:mm:ss.SSSZZ",
	date_time_no_millis: "YYYY-MM-DDTHH:mm:ssZZ",
	basic_date: "YYYYMMDD",
	basic_date_time: "YYYYMMDDTHHmmss.SSSZ",
	basic_date_time_no_millis: "YYYYMMDDTHHmmssZ",
	basic_time: "HHmmss.SSSZ",
	basic_time_no_millis: "HHmmssZ"
};

export const setupReact = (react, reactAnd) => {
	if (react && react.and) {
		if (typeof react.and === "string") {
			react.and = [react.and];
			react.and = react.and.concat(reactAnd);
		} else if (Array.isArray(react.and)) {
			react.and = react.and.concat(reactAnd);
		} else if (_.isObject(react.and)) {
			react.and = setupReact(react.and, reactAnd);
		}
	} else {
		react.and = reactAnd;
	}
	return react;
};
