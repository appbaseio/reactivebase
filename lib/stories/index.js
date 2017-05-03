/* eslint max-lines: 0 */
import React from "react";
import { storiesOf } from "@kadira/storybook";
import { withKnobs, text, boolean, number, array, select, object } from "@kadira/storybook-addon-knobs";

// importing READMEs first, to be used in playground for each component
import withReadme from "storybook-readme/with-readme";

import SingleListReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/SingleList.md";
import MultiListReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/MultiList.md";
import SingleDropdownListReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/SingleDropdownList.md";
import MultiDropdownListReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/MultiDropdownList.md";

import SingleRangeReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/SingleRange.md";
import MultiRangeReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/MultiRange.md";
import SingleDropdownRangeReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/SingleDropdownRange.md";
import MultiDropdownRangeReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/MultiDropdownRange.md";

import RangeSliderReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/RangeSlider.md";
import NumberBoxReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/NumberBox.md";
import ToggleButtonReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/ToggleButton.md";
import DatePickerReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/DatePicker.md";
import DateRangeReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/DateRange.md";

import TextFieldReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/TextField.md";
import DataSearchReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/DataSearch.md";
import DataControllerReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/DataController.md";

import ReactiveElementReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/ReactiveElement.md";
import ReactiveListReadme from "@appbaseio/reactivemaps-manual/docs/v1.0.0/components/ReactiveList.md";

// importing individual component stories
import SingleListDefault from "./SingleList.stories";
import MultiListDefault from "./MultiList.stories";
import SingleDropdownListDefault from "./SingleDropdownList.stories";
import MultiDropdownListDefault from "./MultiDropdownList.stories";

import SingleRangeDefault from "./SingleRange.stories";
import MultiRangeDefault from "./MultiRange.stories";
import SingleDropdownRangeDefault from "./SingleDropdownRange.stories";
import MultiDropdownRangeDefault from "./MultiDropdownRange.stories";

import RangeSliderDefault from "./RangeSlider.stories";
import NumberBoxDefault from "./NumberBox.stories";
import ToggleButtonDefault from "./ToggleButton.stories";
import DatePickerDefault from "./DatePicker.stories";
import DateRangeDefault from "./DateRange.stories";

import TextFieldDefault from "./TextField.stories";
import DataSearchDefault from "./DataSearch.stories";
import DataSearchHighlight from "./DataSearchHighlight.stories";

import DataControllerDefault from "./DataController.stories";
import PoweredByDefault from "./PoweredBy.stories";

import ReactiveElement from "./ReactiveElement";
import ReactiveListDefault from "./ReactiveList.stories";

var moment = require("moment");

require("../../node_modules/materialize-css/dist/css/materialize.min.css");
require("../../dist/css/style.min.css");
require("./list.css");

function removeFirstLine(str) {
	var number = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

	while (number--) {
		str = str.substring(str.indexOf("\n") + 1);
	}
	return str;
}

storiesOf("SingleList", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(SingleListReadme), function () {
	return React.createElement(SingleListDefault, { showSearch: true, placeholder: "Search City" });
})).add("Without Search", withReadme(removeFirstLine(SingleListReadme), function () {
	return React.createElement(SingleListDefault, { showSearch: false, placeholder: "Search City" });
})).add("Default Selected", withReadme(removeFirstLine(SingleListReadme), function () {
	return React.createElement(SingleListDefault, { showSearch: true, defaultSelected: "San Francisco", placeholder: "Search City" });
})).add("Custom Sort", withReadme(removeFirstLine(SingleListReadme), function () {
	return React.createElement(SingleListDefault, { title: "SingleList: Ascending Sort", showSearch: true, defaultSelected: "London", sortBy: "asc", placeholder: "Search City" });
})).add("With Select All", withReadme(removeFirstLine(SingleListReadme), function () {
	return React.createElement(SingleListDefault, { showSearch: true, selectAllLabel: "All Cities", placeholder: "Search City" });
})).add("Playground", withReadme(removeFirstLine(SingleListReadme), function () {
	return React.createElement(SingleListDefault, {
		title: text("title", "SingleList: City Filter"),
		size: number("size", 100),
		sortBy: select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count"),
		defaultSelected: text("defaultSelected", "San Francisco"),
		showCount: boolean("showCount", true),
		showSearch: boolean("showSearch", true),
		placeholder: text("placeholder", "Search City"),
		selectAllLabel: text("selectAllLabel", "All cities")
	});
}));

storiesOf("MultiList", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(MultiListReadme), function () {
	return React.createElement(MultiListDefault, { showSearch: true, placeholder: "Search City" });
})).add("Without Search", withReadme(removeFirstLine(MultiListReadme), function () {
	return React.createElement(MultiListDefault, { showSearch: false, placeholder: "Search City" });
})).add("Default Selected", withReadme(removeFirstLine(MultiListReadme), function () {
	return React.createElement(MultiListDefault, { showSearch: true, defaultSelected: ["London", "Sydney"], placeholder: "Search City" });
})).add("Custom Sort", withReadme(removeFirstLine(MultiListReadme), function () {
	return React.createElement(MultiListDefault, { title: "MultiList: Ascending Sort", showSearch: true, defaultSelected: ["London"], sortBy: "asc", placeholder: "Search City" });
})).add("With Select All", withReadme(removeFirstLine(MultiListReadme), function () {
	return React.createElement(MultiListDefault, { showSearch: true, selectAllLabel: "All Cities", placeholder: "Search City" });
})).add("Playground", withReadme(removeFirstLine(MultiListReadme), function () {
	return React.createElement(MultiListDefault, {
		title: text("title", "MultiList: City Filter"),
		size: number("size", 10),
		sortBy: select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count"),
		defaultSelected: array("defaultSelected", ["London", "Sydney"]),
		showCount: boolean("showCount", true),
		showSearch: boolean("showSearch", true),
		placeholder: text("placeholder", "Search City"),
		selectAllLabel: text("selectAllLabel", "All cities")
	});
}));

storiesOf("SingleDropdownList", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(SingleDropdownListReadme), function () {
	return React.createElement(SingleDropdownListDefault, null);
})).add("With Select All", withReadme(removeFirstLine(SingleDropdownListReadme), function () {
	return React.createElement(SingleDropdownListDefault, {
		selectAllLabel: "All Cities"
	});
})).add("With Default Selected", withReadme(removeFirstLine(SingleDropdownListReadme), function () {
	return React.createElement(SingleDropdownListDefault, {
		selectAllLabel: "All Cities",
		defaultSelected: "London"
	});
})).add("Playground", withReadme(removeFirstLine(SingleDropdownListReadme), function () {
	return React.createElement(SingleDropdownListDefault, {
		title: text("title", "SingleDropdownList"),
		size: number("size", 100),
		showCount: boolean("showCount", true),
		sortBy: select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count"),
		selectAllLabel: text("selectAllLabel", "All Cities"),
		defaultSelected: text("defaultSelected", "London"),
		placeholder: text("placeholder", "Select a City")
	});
}));

storiesOf("MultiDropdownList", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(MultiDropdownListReadme), function () {
	return React.createElement(MultiDropdownListDefault, null);
})).add("With Placeholder", withReadme(removeFirstLine(MultiDropdownListReadme), function () {
	return React.createElement(MultiDropdownListDefault, {
		placeholder: "Select Cities"
	});
})).add("With Select All", withReadme(removeFirstLine(MultiDropdownListReadme), function () {
	return React.createElement(MultiDropdownListDefault, {
		placeholder: "Select Cities",
		selectAllLabel: "All Cities"
	});
})).add("With Default Selected", withReadme(removeFirstLine(MultiDropdownListReadme), function () {
	return React.createElement(MultiDropdownListDefault, {
		placeholder: "Select Cities",
		size: 100,
		sortBy: "count",
		defaultSelected: ["London", "Melbourne"]
	});
})).add("Playground", withReadme(removeFirstLine(MultiDropdownListReadme), function () {
	return React.createElement(MultiDropdownListDefault, {
		title: text("title", "MultiDropdownList"),
		size: number("size", 100),
		showCount: boolean("showCount", true),
		sortBy: select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count"),
		selectAllLabel: text("selectAllLabel", "All Cities"),
		defaultSelected: array("defaultSelected", ["London", "Melbourne"]),
		placeholder: text("placeholder", "Select Cities")
	});
}));

storiesOf("SingleRange", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(SingleRangeReadme), function () {
	return React.createElement(SingleRangeDefault, null);
})).add("With Default Selected", withReadme(removeFirstLine(SingleRangeReadme), function () {
	return React.createElement(SingleRangeDefault, { defaultSelected: "Cheap" });
})).add("Playground", withReadme(removeFirstLine(SingleRangeReadme), function () {
	return React.createElement(SingleRangeDefault, {
		title: text("title", "SingleRange: Price Filter"),
		defaultSelected: text("defaultSelected", "Cheap")
	});
}));

storiesOf("MultiRange", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(MultiRangeReadme), function () {
	return React.createElement(MultiRangeDefault, null);
})).add("With Default Selected", withReadme(removeFirstLine(MultiRangeReadme), function () {
	return React.createElement(MultiRangeDefault, { defaultSelected: ["Cheap", "Moderate"] });
})).add("Playground", withReadme(removeFirstLine(MultiRangeReadme), function () {
	return React.createElement(MultiRangeDefault, {
		title: text("title", "MultiRange: Price Filter"),
		defaultSelected: array("defaultSelected", ["Cheap", "Moderate"])
	});
}));

storiesOf("SingleDropdownRange", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(SingleDropdownRangeReadme), function () {
	return React.createElement(SingleDropdownRangeDefault, null);
})).add("With Default Selected", withReadme(removeFirstLine(SingleDropdownRangeReadme), function () {
	return React.createElement(SingleDropdownRangeDefault, { defaultSelected: "Cheap" });
})).add("Playground", withReadme(removeFirstLine(SingleDropdownRangeReadme), function () {
	return React.createElement(SingleDropdownRangeDefault, {
		title: text("title", "SingleDropdownRange: Price Filter"),
		defaultSelected: text("defaultSelected", "Cheap")
	});
}));

storiesOf("MultiDropdownRange", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(MultiDropdownRangeReadme), function () {
	return React.createElement(MultiDropdownRangeDefault, null);
})).add("With Default Selected", withReadme(removeFirstLine(MultiDropdownRangeReadme), function () {
	return React.createElement(MultiDropdownRangeDefault, { defaultSelected: ["Cheap", "Moderate"] });
})).add("Playground", withReadme(removeFirstLine(MultiDropdownRangeReadme), function () {
	return React.createElement(MultiDropdownRangeDefault, {
		title: text("title", "MultiDropdownRange: Price Filter"),
		defaultSelected: array("defaultSelected", ["Cheap", "Moderate"])
	});
}));

storiesOf("RangeSlider", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(RangeSliderReadme), function () {
	return React.createElement(RangeSliderDefault, null);
})).add("With Default Selected", withReadme(removeFirstLine(RangeSliderReadme), function () {
	return React.createElement(RangeSliderDefault, {
		defaultSelected: {
			start: 0,
			end: 2
		}
	});
})).add("Without histogram", withReadme(removeFirstLine(RangeSliderReadme), function () {
	return React.createElement(RangeSliderDefault, {
		showHistogram: false
	});
})).add("With Range Labels", withReadme(removeFirstLine(RangeSliderReadme), function () {
	return React.createElement(RangeSliderDefault, {
		defaultSelected: {
			start: 0,
			end: 2
		},
		rangeLabels: {
			start: "Start",
			end: "End"
		}
	});
})).add("Playground", withReadme(removeFirstLine(RangeSliderReadme), function () {
	return React.createElement(RangeSliderDefault, {
		title: text("title", "RangeSlider: Guest RSVPs"),
		range: object("range", {
			start: 0,
			end: 5
		}),
		stepValue: number("stepValue", 1),
		defaultSelected: object("defaultSelected", {
			start: 0,
			end: 2
		}),
		rangeLabels: object("rangeLabels", {
			start: "Start",
			end: "End"
		}),
		showHistogram: boolean("showHistogram", true)
	});
}));

storiesOf("NumberBox", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(NumberBoxReadme), function () {
	return React.createElement(NumberBoxDefault, {
		data: {
			label: "Car Ratings",
			start: 1,
			end: 5
		},
		labelPosition: "left"
	});
})).add("Default Selected", withReadme(removeFirstLine(NumberBoxReadme), function () {
	return React.createElement(NumberBoxDefault, {
		data: {
			label: "Car Ratings",
			start: 1,
			end: 5
		},
		defaultSelected: 2,
		labelPosition: "left"
	});
})).add("Exact query", withReadme(removeFirstLine(NumberBoxReadme), function () {
	return React.createElement(NumberBoxDefault, {
		data: {
			label: "Car Ratings",
			start: 1,
			end: 5
		},
		defaultSelected: 3,
		labelPosition: "left",
		queryFormat: "exact"
	});
})).add("Less than query", withReadme(removeFirstLine(NumberBoxReadme), function () {
	return React.createElement(NumberBoxDefault, {
		data: {
			label: "Car Ratings",
			start: 1,
			end: 5
		},
		defaultSelected: 5,
		labelPosition: "left",
		queryFormat: "lte"
	});
})).add("Playground", withReadme(removeFirstLine(NumberBoxReadme), function () {
	return React.createElement(NumberBoxDefault, {
		defaultSelected: number("defaultSelected", 3),
		data: object("data", {
			start: 1,
			end: 5,
			label: "Car Ratings"
		}),
		labelPosition: select("labelPosition", { bottom: "bottom", top: "top", left: "left", right: "right" }, "right"),
		queryFormat: select("queryFormat", { gte: "gte", lte: "lte", exact: "exact" }, "gte")
	});
}));

storiesOf("ToggleButton", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(ToggleButtonReadme), function () {
	return React.createElement(ToggleButtonDefault, null);
})).add("With Default Selected", withReadme(removeFirstLine(ToggleButtonReadme), function () {
	return React.createElement(ToggleButtonDefault, { defaultSelected: ["Social"] });
})).add("Playground", withReadme(removeFirstLine(ToggleButtonReadme), function () {
	return React.createElement(ToggleButtonDefault, {
		title: text("title", "ToggleButton: Meetup Categories"),
		multiSelect: boolean("multiSelect", true),
		defaultSelected: array("defaultSelected", ["Social", "Travel"])
	});
}));

storiesOf("TextField", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(TextFieldReadme), function () {
	return React.createElement(TextFieldDefault, null);
})).add("DefaultSelected", withReadme(removeFirstLine(TextFieldReadme), function () {
	return React.createElement(TextFieldDefault, { defaultSelected: "nissan" });
})).add("Playground", withReadme(removeFirstLine(TextFieldReadme), function () {
	return React.createElement(TextFieldDefault, {
		title: text("title", "TextField: Car Search"),
		placeholder: text("placeholder", "Type a car name"),
		defaultSelected: text("defaultSelected", "nissan")
	});
}));

storiesOf("DataSearch", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(DataSearchReadme), function () {
	return React.createElement(DataSearchDefault, {
		title: "DataSearch",
		placeholder: "Search Venue"
	});
})).add("Without Autocomplete", withReadme(removeFirstLine(DataSearchReadme), function () {
	return React.createElement(DataSearchDefault, {
		title: "DataSearch",
		placeholder: "Search Venue",
		autocomplete: false
	});
})).add("Playground", withReadme(removeFirstLine(DataSearchReadme), function () {
	return React.createElement(DataSearchDefault, {
		title: text("title", "DataSearch"),
		placeholder: text("placeholder", "Search Venue"),
		autocomplete: boolean("autocomplete", true)
	});
}));

storiesOf("DataSearchHighlight", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(DataSearchReadme), function () {
	return React.createElement(DataSearchHighlight, {
		title: "DataSearch"
	});
}));

storiesOf("DataController", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(DataControllerReadme), function () {
	return React.createElement(DataControllerDefault, null);
})).add("With UI", withReadme(removeFirstLine(DataControllerReadme), function () {
	return React.createElement(DataControllerDefault, {
		title: "DataController",
		visible: true,
		dataLabel: React.createElement(
			"p",
			null,
			"\u2605 A customizable UI widget \u2605"
		)
	});
})).add("Playground", withReadme(removeFirstLine(DataControllerReadme), function () {
	return React.createElement(DataControllerDefault, {
		title: text("title", "DataController"),
		visible: boolean("visible", true),
		dataLabel: text("dataLabel", "★  A customizable UI widget ★"),
		defaultSelected: text("defaultSelected", "default"),
		componentStyle: object("componentStyle", { "padding-bottom": "10px" })
	});
}));

storiesOf("DatePicker", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(DatePickerReadme), function () {
	return React.createElement(DatePickerDefault, null);
})).add("Show more than 1 month", withReadme(removeFirstLine(DatePickerReadme), function () {
	return React.createElement(DatePickerDefault, {
		numberOfMonths: 2
	});
})).add("Default date", withReadme(removeFirstLine(DatePickerReadme), function () {
	return React.createElement(DatePickerDefault, {
		defaultSelected: moment().subtract(1, "day")
	});
})).add("Enable days from today only", withReadme(removeFirstLine(DatePickerReadme), function () {
	return React.createElement(DatePickerDefault, {
		allowAllDates: false
	});
})).add("Using extra prop object", withReadme(removeFirstLine(DatePickerReadme), function () {
	return React.createElement(DatePickerDefault, {
		extra: {
			withFullScreenPortal: true,
			showClearDate: true
		}
	});
})).add("Playground", withReadme(removeFirstLine(DatePickerReadme), function () {
	return React.createElement(DatePickerDefault, {
		title: text("title", "Date Picker"),
		numberOfMonths: number("numberOfMonths", 1),
		allowAllDates: boolean("allowAllDates", true),
		queryFormat: select("queryFormat", { "epoch_millis": "epoch_millis", "epoch_seconds": "epoch_seconds", "date": "date", "date_time": "date_time", "date_time_no_millis": "date_time_no_millis", "basic_date": "basic_date", "basic_date_time": "basic_date_time", "basic_date_time_no_millis": "basic_date_time_no_millis", "basic_time": "basic_time", "basic_time_no_millis": "basic_time_no_millis" }, "epoch_millis")
	});
}));

storiesOf("DateRange", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(DateRangeReadme), function () {
	return React.createElement(DateRangeDefault, null);
})).add("Show more than 1 month", withReadme(removeFirstLine(DateRangeReadme), function () {
	return React.createElement(DateRangeDefault, {
		numberOfMonths: 3
	});
})).add("Default date", withReadme(removeFirstLine(DateRangeReadme), function () {
	return React.createElement(DateRangeDefault, {
		defaultSelected: {
			start: moment().subtract(7, "days"),
			end: moment()
		}
	});
})).add("Enable days from today only", withReadme(removeFirstLine(DateRangeReadme), function () {
	return React.createElement(DateRangeDefault, {
		allowAllDates: false
	});
})).add("Using extra prop object", withReadme(removeFirstLine(DateRangeReadme), function () {
	return React.createElement(DateRangeDefault, {
		extra: {
			withFullScreenPortal: true,
			showClearDate: true
		}
	});
})).add("Playground", withReadme(removeFirstLine(DateRangeReadme), function () {
	return React.createElement(DateRangeDefault, {
		title: text("title", "Date Range"),
		numberOfMonths: number("numberOfMonths", 2),
		allowAllDates: boolean("allowAllDates", true),
		queryFormat: select("queryFormat", { "epoch_millis": "epoch_millis", "epoch_seconds": "epoch_seconds", "date": "date", "date_time": "date_time", "date_time_no_millis": "date_time_no_millis", "basic_date": "basic_date", "basic_date_time": "basic_date_time", "basic_date_time_no_millis": "basic_date_time_no_millis", "basic_time": "basic_time", "basic_time_no_millis": "basic_time_no_millis" }, "epoch_millis")
	});
}));

storiesOf("PoweredBy", module).add("Basic", function () {
	return React.createElement(PoweredByDefault, null);
});

storiesOf("ReactiveElement", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(ReactiveElementReadme, 3), function () {
	return React.createElement(ReactiveElement.Basic, null);
})).add("Stream", withReadme(removeFirstLine(ReactiveElementReadme, 3), function () {
	return React.createElement(ReactiveElement.WithStream, null);
})).add("Theme", withReadme(removeFirstLine(ReactiveElementReadme, 3), function () {
	return React.createElement(ReactiveElement.WithTheme, null);
})).add("Playground", withReadme(removeFirstLine(ReactiveElementReadme, 3), function () {
	return React.createElement(ReactiveElement.Basic, {
		title: text("title", "ReactiveElement"),
		placeholder: text("placeholder", "Select city from the list"),
		from: number("from", 0),
		size: number("size", 5),
		initialLoader: "Loading results..",
		noResults: "No results found! Try a different filter duh..",
		stream: boolean("stream", false),
		showResultStats: boolean("showResultStats", true)
	});
}));

storiesOf("ReactiveList", module).addDecorator(withKnobs).add("Basic", withReadme(removeFirstLine(ReactiveListReadme, 3), function () {
	return React.createElement(ReactiveListDefault, { onAllData: null, stream: false });
})).add("With Custom Markup", withReadme(removeFirstLine(ReactiveListReadme, 3), function () {
	return React.createElement(ReactiveListDefault, { stream: false });
})).add("Without Title", withReadme(removeFirstLine(ReactiveListReadme, 3), function () {
	return React.createElement(ReactiveListDefault, { title: "", stream: false });
})).add("With Streaming Enabled", withReadme(removeFirstLine(ReactiveListReadme, 3), function () {
	return React.createElement(ReactiveListDefault, { title: "Meetups", stream: true });
})).add("With pagination", withReadme(removeFirstLine(ReactiveListReadme, 3), function () {
	return React.createElement(ReactiveListDefault, { pagination: true, title: "Meetups" });
})).add("With pagination at top", withReadme(removeFirstLine(ReactiveListReadme, 3), function () {
	return React.createElement(ReactiveListDefault, { pagination: true, paginationAt: "top", title: "Meetups" });
})).add("With pagination at both", withReadme(removeFirstLine(ReactiveListReadme, 3), function () {
	return React.createElement(ReactiveListDefault, { pagination: true, paginationAt: "both", title: "Meetups" });
})).add("With Sort Options", withReadme(removeFirstLine(ReactiveListReadme, 3), function () {
	return React.createElement(ReactiveListDefault, {
		title: "Meetups",
		stream: false,
		sortOptions: [{
			label: "Most Recent RSVP",
			appbaseField: "mtime",
			sortBy: "desc"
		}, {
			label: "Guests - High to Low",
			appbaseField: "guests",
			sortBy: "desc"
		}, {
			label: "Guests - Low to High",
			appbaseField: "guests",
			sortBy: "asc"
		}]
	});
})).add("With Loader", withReadme(removeFirstLine(ReactiveListReadme, 3), function () {
	return React.createElement(ReactiveListDefault, {
		title: "Meetups",
		requestOnScroll: true,
		stream: false,
		initialLoader: "Loading results.."
	});
})).add("Playground", withReadme(removeFirstLine(ReactiveListReadme, 3), function () {
	return React.createElement(ReactiveListDefault, {
		title: text("title", "ReactiveList: Results"),
		from: number("from", 0),
		size: number("size", 5),
		initialLoader: text("initialLoader", "Loading results.."),
		noResults: text("noResults", "No results found!"),
		showResultStats: boolean("showResultStats", true),
		pagination: boolean("requestOnScroll", true),
		paginationAt: select("paginationAt", { bottom: "bottom", top: "top", both: "both" }, "bottom"),
		stream: boolean("stream", false)
	});
}));