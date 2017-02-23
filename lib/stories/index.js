"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _storybook = require("@kadira/storybook");

var _storybookAddonKnobs = require("@kadira/storybook-addon-knobs");

var _withReadme = require("storybook-readme/with-readme");

var _withReadme2 = _interopRequireDefault(_withReadme);

var _SingleList = require("@appbaseio/reactivemaps-manual/docs/v1/components/SingleList.md");

var _SingleList2 = _interopRequireDefault(_SingleList);

var _MultiList = require("@appbaseio/reactivemaps-manual/docs/v1/components/MultiList.md");

var _MultiList2 = _interopRequireDefault(_MultiList);

var _SingleDropdownList = require("@appbaseio/reactivemaps-manual/docs/v1/components/SingleDropdownList.md");

var _SingleDropdownList2 = _interopRequireDefault(_SingleDropdownList);

var _MultiDropdownList = require("@appbaseio/reactivemaps-manual/docs/v1/components/MultiDropdownList.md");

var _MultiDropdownList2 = _interopRequireDefault(_MultiDropdownList);

var _NestedList = require("@appbaseio/reactivemaps-manual/docs/v1/components/NestedList.md");

var _NestedList2 = _interopRequireDefault(_NestedList);

var _SingleRange = require("@appbaseio/reactivemaps-manual/docs/v1/components/SingleRange.md");

var _SingleRange2 = _interopRequireDefault(_SingleRange);

var _MultiRange = require("@appbaseio/reactivemaps-manual/docs/v1/components/MultiRange.md");

var _MultiRange2 = _interopRequireDefault(_MultiRange);

var _SingleDropdownRange = require("@appbaseio/reactivemaps-manual/docs/v1/components/SingleDropdownRange.md");

var _SingleDropdownRange2 = _interopRequireDefault(_SingleDropdownRange);

var _MultiDropdownRange = require("@appbaseio/reactivemaps-manual/docs/v1/components/MultiDropdownRange.md");

var _MultiDropdownRange2 = _interopRequireDefault(_MultiDropdownRange);

var _RangeSlider = require("@appbaseio/reactivemaps-manual/docs/v1/components/RangeSlider.md");

var _RangeSlider2 = _interopRequireDefault(_RangeSlider);

var _NumberBox = require("@appbaseio/reactivemaps-manual/docs/v1/components/NumberBox.md");

var _NumberBox2 = _interopRequireDefault(_NumberBox);

var _ToggleButton = require("@appbaseio/reactivemaps-manual/docs/v1/components/ToggleButton.md");

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _DatePicker = require("@appbaseio/reactivemaps-manual/docs/v1/components/DatePicker.md");

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _DateRange = require("@appbaseio/reactivemaps-manual/docs/v1/components/DateRange.md");

var _DateRange2 = _interopRequireDefault(_DateRange);

var _TextField = require("@appbaseio/reactivemaps-manual/docs/v1/components/TextField.md");

var _TextField2 = _interopRequireDefault(_TextField);

var _DataSearch = require("@appbaseio/reactivemaps-manual/docs/v1/components/DataSearch.md");

var _DataSearch2 = _interopRequireDefault(_DataSearch);

var _ResultList = require("@appbaseio/reactivemaps-manual/docs/v1/components/ResultList.md");

var _ResultList2 = _interopRequireDefault(_ResultList);

var _PaginatedResultList = require("@appbaseio/reactivemaps-manual/docs/v1/components/PaginatedResultList.md");

var _PaginatedResultList2 = _interopRequireDefault(_PaginatedResultList);

var _SingleList3 = require("./SingleList.stories");

var _SingleList4 = _interopRequireDefault(_SingleList3);

var _MultiList3 = require("./MultiList.stories");

var _MultiList4 = _interopRequireDefault(_MultiList3);

var _SingleDropdownList3 = require("./SingleDropdownList.stories");

var _SingleDropdownList4 = _interopRequireDefault(_SingleDropdownList3);

var _MultiDropdownList3 = require("./MultiDropdownList.stories");

var _MultiDropdownList4 = _interopRequireDefault(_MultiDropdownList3);

var _NestedList3 = require("./NestedList.stories");

var _NestedList4 = _interopRequireDefault(_NestedList3);

var _SingleRange3 = require("./SingleRange.stories");

var _SingleRange4 = _interopRequireDefault(_SingleRange3);

var _MultiRange3 = require("./MultiRange.stories");

var _MultiRange4 = _interopRequireDefault(_MultiRange3);

var _SingleDropdownRange3 = require("./SingleDropdownRange.stories");

var _SingleDropdownRange4 = _interopRequireDefault(_SingleDropdownRange3);

var _MultiDropdownRange3 = require("./MultiDropdownRange.stories");

var _MultiDropdownRange4 = _interopRequireDefault(_MultiDropdownRange3);

var _RangeSlider3 = require("./RangeSlider.stories");

var _RangeSlider4 = _interopRequireDefault(_RangeSlider3);

var _NumberBox3 = require("./NumberBox.stories");

var _NumberBox4 = _interopRequireDefault(_NumberBox3);

var _ToggleButton3 = require("./ToggleButton.stories");

var _ToggleButton4 = _interopRequireDefault(_ToggleButton3);

var _DatePicker3 = require("./DatePicker.stories");

var _DatePicker4 = _interopRequireDefault(_DatePicker3);

var _DateRange3 = require("./DateRange.stories");

var _DateRange4 = _interopRequireDefault(_DateRange3);

var _TextField3 = require("./TextField.stories");

var _TextField4 = _interopRequireDefault(_TextField3);

var _DataSearch3 = require("./DataSearch.stories");

var _DataSearch4 = _interopRequireDefault(_DataSearch3);

var _DataController = require("./DataController.stories");

var _DataController2 = _interopRequireDefault(_DataController);

var _PoweredBy = require("./PoweredBy.stories");

var _PoweredBy2 = _interopRequireDefault(_PoweredBy);

var _ReactiveElement = require("./ReactiveElement");

var _ReactiveElement2 = _interopRequireDefault(_ReactiveElement);

var _ReactiveList = require("./ReactiveList.stories");

var _ReactiveList2 = _interopRequireDefault(_ReactiveList);

var _ReactivePaginatedList = require("./ReactivePaginatedList.stories");

var _ReactivePaginatedList2 = _interopRequireDefault(_ReactivePaginatedList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// importing READMEs first, to be used in playground for each component
var moment = require("moment");

// importing individual component stories
/*eslint max-lines: 0*/


require("../../node_modules/materialize-css/dist/css/materialize.min.css");
require("../../dist/css/style.min.css");

function removeFirstLine(str) {
	return str.substring(str.indexOf("\n") + 1);
}

(0, _storybook.storiesOf)("SingleList", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_SingleList4.default, { showSearch: true, placeholder: "Search City" });
})).add("Without Search", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_SingleList4.default, { showSearch: false, placeholder: "Search City" });
})).add("Default Selected", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_SingleList4.default, { showSearch: true, defaultSelected: "San Francisco", placeholder: "Search City" });
})).add("Custom Sort", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_SingleList4.default, { title: "SingleList: Ascending Sort", showSearch: true, defaultSelected: "London", sortBy: "asc", placeholder: "Search City" });
})).add("With Select All", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_SingleList4.default, { showSearch: true, selectAllLabel: "All Cities", placeholder: "Search City" });
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_SingleList2.default), function () {
	return _react2.default.createElement(_SingleList4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "SingleList: City Filter"),
		size: (0, _storybookAddonKnobs.number)("size", 100),
		sortBy: (0, _storybookAddonKnobs.select)("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count"),
		defaultSelected: (0, _storybookAddonKnobs.text)("defaultSelected", "San Francisco"),
		showCount: (0, _storybookAddonKnobs.boolean)("showCount", true),
		showSearch: (0, _storybookAddonKnobs.boolean)("showSearch", true),
		placeholder: (0, _storybookAddonKnobs.text)("placeholder", "Search City"),
		selectAllLabel: (0, _storybookAddonKnobs.text)("selectAllLabel", "All cities")
	});
}));

(0, _storybook.storiesOf)("MultiList", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_MultiList2.default), function () {
	return _react2.default.createElement(_MultiList4.default, { showSearch: true, placeholder: "Search City" });
})).add("Without Search", (0, _withReadme2.default)(removeFirstLine(_MultiList2.default), function () {
	return _react2.default.createElement(_MultiList4.default, { showSearch: false, placeholder: "Search City" });
})).add("Default Selected", (0, _withReadme2.default)(removeFirstLine(_MultiList2.default), function () {
	return _react2.default.createElement(_MultiList4.default, { showSearch: true, defaultSelected: ["London", "Sydney"], placeholder: "Search City" });
})).add("Custom Sort", (0, _withReadme2.default)(removeFirstLine(_MultiList2.default), function () {
	return _react2.default.createElement(_MultiList4.default, { title: "MultiList: Ascending Sort", showSearch: true, defaultSelected: ["London"], sortBy: "asc", placeholder: "Search City" });
})).add("With Select All", (0, _withReadme2.default)(removeFirstLine(_MultiList2.default), function () {
	return _react2.default.createElement(_MultiList4.default, { showSearch: true, selectAllLabel: "All Cities", placeholder: "Search City" });
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_MultiList2.default), function () {
	return _react2.default.createElement(_MultiList4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "MultiList: City Filter"),
		size: (0, _storybookAddonKnobs.number)("size", 10),
		sortBy: (0, _storybookAddonKnobs.select)("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count"),
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["London", "Sydney"]),
		showCount: (0, _storybookAddonKnobs.boolean)("showCount", true),
		showSearch: (0, _storybookAddonKnobs.boolean)("showSearch", true),
		placeholder: (0, _storybookAddonKnobs.text)("placeholder", "Search City"),
		selectAllLabel: (0, _storybookAddonKnobs.text)("selectAllLabel", "All cities")
	});
}));

(0, _storybook.storiesOf)("SingleDropdownList", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_SingleDropdownList2.default), function () {
	return _react2.default.createElement(_SingleDropdownList4.default, null);
})).add("With Select All", (0, _withReadme2.default)(removeFirstLine(_SingleDropdownList2.default), function () {
	return _react2.default.createElement(_SingleDropdownList4.default, {
		selectAllLabel: "All Cities"
	});
})).add("With Default Selected", (0, _withReadme2.default)(removeFirstLine(_SingleDropdownList2.default), function () {
	return _react2.default.createElement(_SingleDropdownList4.default, {
		selectAllLabel: "All Cities",
		defaultSelected: "London"
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_SingleDropdownList2.default), function () {
	return _react2.default.createElement(_SingleDropdownList4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "SingleDropdownList"),
		size: (0, _storybookAddonKnobs.number)("size", 100),
		showCount: (0, _storybookAddonKnobs.boolean)("showCount", true),
		sortBy: (0, _storybookAddonKnobs.select)("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count"),
		selectAllLabel: (0, _storybookAddonKnobs.text)("selectAllLabel", "All Cities"),
		defaultSelected: (0, _storybookAddonKnobs.text)("defaultSelected", "London"),
		placeholder: (0, _storybookAddonKnobs.text)("placeholder", "Select a City")
	});
}));

(0, _storybook.storiesOf)("MultiDropdownList", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_MultiDropdownList2.default), function () {
	return _react2.default.createElement(_MultiDropdownList4.default, null);
})).add("With Placeholder", (0, _withReadme2.default)(removeFirstLine(_MultiDropdownList2.default), function () {
	return _react2.default.createElement(_MultiDropdownList4.default, {
		placeholder: "Select Cities"
	});
})).add("With Select All", (0, _withReadme2.default)(removeFirstLine(_MultiDropdownList2.default), function () {
	return _react2.default.createElement(_MultiDropdownList4.default, {
		placeholder: "Select Cities",
		selectAllLabel: "All Cities"
	});
})).add("With Default Selected", (0, _withReadme2.default)(removeFirstLine(_MultiDropdownList2.default), function () {
	return _react2.default.createElement(_MultiDropdownList4.default, {
		placeholder: "Select Cities",
		size: 100,
		sortBy: "count",
		defaultSelected: ["London", "Melbourne"]
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_MultiDropdownList2.default), function () {
	return _react2.default.createElement(_MultiDropdownList4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "MultiDropdownList"),
		size: (0, _storybookAddonKnobs.number)("size", 100),
		showCount: (0, _storybookAddonKnobs.boolean)("showCount", true),
		sortBy: (0, _storybookAddonKnobs.select)("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count"),
		selectAllLabel: (0, _storybookAddonKnobs.text)("selectAllLabel", "All Cities"),
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["London", "Melbourne"]),
		placeholder: (0, _storybookAddonKnobs.text)("placeholder", "Select Cities")
	});
}));

(0, _storybook.storiesOf)("NestedList", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_NestedList4.default, null);
})).add("With Title", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_NestedList4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "Car Category")
	});
})).add("Default selection", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_NestedList4.default, {
		defaultSelected: ["bmw", "x series"]
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_NestedList2.default), function () {
	return _react2.default.createElement(_NestedList4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "NestedList: Car Filter"),
		size: (0, _storybookAddonKnobs.number)("size", 100),
		sortBy: (0, _storybookAddonKnobs.select)("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count"),
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["bmw", "x series"]),
		showCount: (0, _storybookAddonKnobs.boolean)("showCount", true),
		showSearch: (0, _storybookAddonKnobs.boolean)("showSearch", true),
		placeholder: (0, _storybookAddonKnobs.text)("placeholder", "Search Cars")
	});
}));

(0, _storybook.storiesOf)("SingleRange", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_SingleRange2.default), function () {
	return _react2.default.createElement(_SingleRange4.default, null);
})).add("With Default Selected", (0, _withReadme2.default)(removeFirstLine(_SingleRange2.default), function () {
	return _react2.default.createElement(_SingleRange4.default, { defaultSelected: "Cheap" });
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_SingleRange2.default), function () {
	return _react2.default.createElement(_SingleRange4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "SingleRange: Price Filter"),
		defaultSelected: (0, _storybookAddonKnobs.text)("defaultSelected", "Cheap")
	});
}));

(0, _storybook.storiesOf)("MultiRange", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_MultiRange2.default), function () {
	return _react2.default.createElement(_MultiRange4.default, null);
})).add("With Default Selected", (0, _withReadme2.default)(removeFirstLine(_MultiRange2.default), function () {
	return _react2.default.createElement(_MultiRange4.default, { defaultSelected: ["Cheap", "Moderate"] });
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_MultiRange2.default), function () {
	return _react2.default.createElement(_MultiRange4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "MultiRange: Price Filter"),
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["Cheap", "Moderate"])
	});
}));

(0, _storybook.storiesOf)("SingleDropdownRange", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_SingleDropdownRange2.default), function () {
	return _react2.default.createElement(_SingleDropdownRange4.default, null);
})).add("With Default Selected", (0, _withReadme2.default)(removeFirstLine(_SingleDropdownRange2.default), function () {
	return _react2.default.createElement(_SingleDropdownRange4.default, { defaultSelected: "Cheap" });
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_SingleDropdownRange2.default), function () {
	return _react2.default.createElement(_SingleDropdownRange4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "SingleDropdownRange: Price Filter"),
		defaultSelected: (0, _storybookAddonKnobs.text)("defaultSelected", "Cheap")
	});
}));

(0, _storybook.storiesOf)("MultiDropdownRange", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_MultiDropdownRange2.default), function () {
	return _react2.default.createElement(_MultiDropdownRange4.default, null);
})).add("With Default Selected", (0, _withReadme2.default)(removeFirstLine(_MultiDropdownRange2.default), function () {
	return _react2.default.createElement(_MultiDropdownRange4.default, { defaultSelected: ["Cheap", "Moderate"] });
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_MultiDropdownRange2.default), function () {
	return _react2.default.createElement(_MultiDropdownRange4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "MultiDropdownRange: Price Filter"),
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["Cheap", "Moderate"])
	});
}));

(0, _storybook.storiesOf)("RangeSlider", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_RangeSlider2.default), function () {
	return _react2.default.createElement(_RangeSlider4.default, null);
})).add("With Default Selected", (0, _withReadme2.default)(removeFirstLine(_RangeSlider2.default), function () {
	return _react2.default.createElement(_RangeSlider4.default, {
		defaultSelected: {
			start: 0,
			end: 2
		}
	});
})).add("Without histogram", (0, _withReadme2.default)(removeFirstLine(_RangeSlider2.default), function () {
	return _react2.default.createElement(_RangeSlider4.default, {
		showHistogram: false
	});
})).add("With Range Labels", (0, _withReadme2.default)(removeFirstLine(_RangeSlider2.default), function () {
	return _react2.default.createElement(_RangeSlider4.default, {
		defaultSelected: {
			start: 0,
			end: 2
		},
		rangeLabels: {
			start: "Start",
			end: "End"
		}
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_RangeSlider2.default), function () {
	return _react2.default.createElement(_RangeSlider4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "RangeSlider: Guest RSVPs"),
		range: (0, _storybookAddonKnobs.object)("range", {
			start: 0,
			end: 5
		}),
		stepValue: (0, _storybookAddonKnobs.number)("stepValue", 1),
		defaultSelected: (0, _storybookAddonKnobs.object)("defaultSelected", {
			start: 0,
			end: 2
		}),
		rangeLabels: (0, _storybookAddonKnobs.object)("rangeLabels", {
			start: "Start",
			end: "End"
		}),
		showHistogram: (0, _storybookAddonKnobs.boolean)("showHistogram", true)
	});
}));

(0, _storybook.storiesOf)("NumberBox", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_NumberBox2.default), function () {
	return _react2.default.createElement(_NumberBox4.default, {
		defaultSelected: 3,
		data: {
			label: "Car Ratings",
			start: 1,
			end: 5
		},
		labelPosition: "left"
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_NumberBox2.default), function () {
	return _react2.default.createElement(_NumberBox4.default, {
		defaultSelected: (0, _storybookAddonKnobs.number)("defaultSelected", 3),
		data: (0, _storybookAddonKnobs.object)("data", {
			start: 1,
			end: 5,
			label: "Car Ratings"
		}),
		labelPosition: (0, _storybookAddonKnobs.select)("labelPosition", { bottom: "bottom", top: "top", left: "left", right: "right" }, "right")
	});
}));

(0, _storybook.storiesOf)("ToggleButton", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_ToggleButton2.default), function () {
	return _react2.default.createElement(_ToggleButton4.default, null);
})).add("With Default Selected", (0, _withReadme2.default)(removeFirstLine(_ToggleButton2.default), function () {
	return _react2.default.createElement(_ToggleButton4.default, { defaultSelected: ["Social"] });
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_ToggleButton2.default), function () {
	return _react2.default.createElement(_ToggleButton4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "ToggleButton: Meetup Categories"),
		multiSelect: (0, _storybookAddonKnobs.boolean)("multiSelect", true),
		defaultSelected: (0, _storybookAddonKnobs.array)("defaultSelected", ["Social", "Travel"])
	});
}));

(0, _storybook.storiesOf)("TextField", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_TextField2.default), function () {
	return _react2.default.createElement(_TextField4.default, null);
})).add("DefaultSelected", (0, _withReadme2.default)(removeFirstLine(_TextField2.default), function () {
	return _react2.default.createElement(_TextField4.default, { defaultSelected: "nissan" });
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_TextField2.default), function () {
	return _react2.default.createElement(_TextField4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "TextField: Car Search"),
		placeholder: (0, _storybookAddonKnobs.text)("placeholder", "Type a car name"),
		defaultSelected: (0, _storybookAddonKnobs.text)("defaultSelected", "nissan")
	});
}));

(0, _storybook.storiesOf)("DataSearch", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_DataSearch2.default), function () {
	return _react2.default.createElement(_DataSearch4.default, {
		title: "DataSearch",
		placeholder: "Search Venue"
	});
})).add("Without Autocomplete", (0, _withReadme2.default)(removeFirstLine(_DataSearch2.default), function () {
	return _react2.default.createElement(_DataSearch4.default, {
		title: "DataSearch",
		placeholder: "Search Venue",
		autocomplete: false
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_DataSearch2.default), function () {
	return _react2.default.createElement(_DataSearch4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "DataSearch"),
		placeholder: (0, _storybookAddonKnobs.text)("placeholder", "Search Venue"),
		autocomplete: (0, _storybookAddonKnobs.boolean)("autocomplete", true)
	});
}));

(0, _storybook.storiesOf)("DataController", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_DataSearch2.default), function () {
	return _react2.default.createElement(_DataController2.default, null);
})).add("With UI", (0, _withReadme2.default)(removeFirstLine(_DataSearch2.default), function () {
	return _react2.default.createElement(_DataController2.default, {
		title: "DataController",
		showUI: true
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_DataSearch2.default), function () {
	return _react2.default.createElement(_DataController2.default, {
		title: (0, _storybookAddonKnobs.text)("title", "DataController"),
		dataLabel: (0, _storybookAddonKnobs.text)("dataLabel", "matchall"),
		showUI: (0, _storybookAddonKnobs.boolean)("showUI", true)
	});
}));

(0, _storybook.storiesOf)("DatePicker", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_DatePicker2.default), function () {
	return _react2.default.createElement(_DatePicker4.default, null);
})).add("Show more than 1 month", (0, _withReadme2.default)(removeFirstLine(_DatePicker2.default), function () {
	return _react2.default.createElement(_DatePicker4.default, {
		numberOfMonths: 2
	});
})).add("Default date", (0, _withReadme2.default)(removeFirstLine(_DatePicker2.default), function () {
	return _react2.default.createElement(_DatePicker4.default, {
		defaultSelected: moment().subtract(1, "days")
	});
})).add("Enable days from today only", (0, _withReadme2.default)(removeFirstLine(_DatePicker2.default), function () {
	return _react2.default.createElement(_DatePicker4.default, {
		allowAllDates: false
	});
})).add("Using extra prop object", (0, _withReadme2.default)(removeFirstLine(_DatePicker2.default), function () {
	return _react2.default.createElement(_DatePicker4.default, {
		extra: {
			withFullScreenPortal: true,
			showClearDate: true
		}
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_DatePicker2.default), function () {
	return _react2.default.createElement(_DatePicker4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "Date Picker"),
		numberOfMonths: (0, _storybookAddonKnobs.number)("Number of months", 1),
		allowAllDates: (0, _storybookAddonKnobs.boolean)("allowAllDates: Enable days from today only", true)
	});
}));

(0, _storybook.storiesOf)("DateRange", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_DateRange2.default), function () {
	return _react2.default.createElement(_DateRange4.default, null);
})).add("Show more than 1 month", (0, _withReadme2.default)(removeFirstLine(_DateRange2.default), function () {
	return _react2.default.createElement(_DateRange4.default, {
		numberOfMonths: 3
	});
})).add("Default date", (0, _withReadme2.default)(removeFirstLine(_DateRange2.default), function () {
	return _react2.default.createElement(_DateRange4.default, {
		defaultSelected: {
			start: moment().subtract(7, "days"),
			end: moment()
		}
	});
})).add("Enable days from today only", (0, _withReadme2.default)(removeFirstLine(_DateRange2.default), function () {
	return _react2.default.createElement(_DateRange4.default, {
		allowAllDates: false
	});
})).add("Using extra prop object", (0, _withReadme2.default)(removeFirstLine(_DateRange2.default), function () {
	return _react2.default.createElement(_DateRange4.default, {
		extra: {
			withFullScreenPortal: true,
			showClearDate: true
		}
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_DateRange2.default), function () {
	return _react2.default.createElement(_DateRange4.default, {
		title: (0, _storybookAddonKnobs.text)("title", "Date Range"),
		numberOfMonths: (0, _storybookAddonKnobs.number)("Number of months", 2),
		allowAllDates: (0, _storybookAddonKnobs.boolean)("allowAllDates: Enable days from today only", true)
	});
}));

(0, _storybook.storiesOf)("PoweredBy", module).add("Basic", function () {
	return _react2.default.createElement(_PoweredBy2.default, null);
});

(0, _storybook.storiesOf)("ReactiveElement", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveElement2.default.Basic, null);
})).add("Stream", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveElement2.default.WithStream, null);
})).add("Theme", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveElement2.default.WithTheme, null);
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveElement2.default.Basic, {
		title: (0, _storybookAddonKnobs.text)("title", "ReactiveElement"),
		placeholder: (0, _storybookAddonKnobs.text)("placeholder", "Select city from the list"),
		from: (0, _storybookAddonKnobs.number)("from", 0),
		size: (0, _storybookAddonKnobs.number)("size", 5),
		initialLoader: "Loading results..",
		noResults: "No results found! Try a different filter duh..",
		stream: (0, _storybookAddonKnobs.boolean)("stream", false),
		showResultStats: (0, _storybookAddonKnobs.boolean)("showResultStats", true)
	});
}));

(0, _storybook.storiesOf)("ReactiveList", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveList2.default, { onData: null, requestOnScroll: true, stream: false });
})).add("With Custom Markup", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveList2.default, { requestOnScroll: true, stream: false });
})).add("Without Title", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveList2.default, { title: "", requestOnScroll: true, stream: false });
})).add("With Streaming Enabled", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveList2.default, { title: "Meetups", stream: true });
})).add("With Sort Options", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveList2.default, {
		title: "Meetups",
		requestOnScroll: true,
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
})).add("With Loader", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveList2.default, {
		title: "Meetups",
		requestOnScroll: true,
		stream: false,
		initialLoader: "Loading results.."
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactiveList2.default, {
		title: (0, _storybookAddonKnobs.text)("title", "ReactiveList: Results"),
		from: (0, _storybookAddonKnobs.number)("from", 0),
		size: (0, _storybookAddonKnobs.number)("size", 5),
		initialLoader: (0, _storybookAddonKnobs.text)("initialLoader", "Loading results.."),
		noResults: (0, _storybookAddonKnobs.text)("noResults", "No results found!"),
		showResultStats: (0, _storybookAddonKnobs.boolean)("showResultStats", true),
		requestOnScroll: (0, _storybookAddonKnobs.boolean)("requestOnScroll", true),
		stream: (0, _storybookAddonKnobs.boolean)("stream", false)
	});
}));

(0, _storybook.storiesOf)("ReactivePaginatedList", module).addDecorator(_storybookAddonKnobs.withKnobs).add("Basic", (0, _withReadme2.default)(removeFirstLine(_PaginatedResultList2.default), function () {
	return _react2.default.createElement(_ReactivePaginatedList2.default, {
		onData: null
	});
})).add("With Custom Markup", (0, _withReadme2.default)(removeFirstLine(_PaginatedResultList2.default), function () {
	return _react2.default.createElement(_ReactivePaginatedList2.default, null);
})).add("With Sort Options", (0, _withReadme2.default)(removeFirstLine(_PaginatedResultList2.default), function () {
	return _react2.default.createElement(_ReactivePaginatedList2.default, {
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
})).add("With Loader", (0, _withReadme2.default)(removeFirstLine(_ResultList2.default), function () {
	return _react2.default.createElement(_ReactivePaginatedList2.default, {
		title: "Meetups",
		stream: false,
		initialLoader: "Loading results.."
	});
})).add("Playground", (0, _withReadme2.default)(removeFirstLine(_PaginatedResultList2.default), function () {
	return _react2.default.createElement(_ReactivePaginatedList2.default, {
		title: (0, _storybookAddonKnobs.text)("title", "ReactivePaginatedList: Playground"),
		from: (0, _storybookAddonKnobs.number)("from", 0),
		size: (0, _storybookAddonKnobs.number)("size", 5),
		sortBy: (0, _storybookAddonKnobs.select)("sortBy", { asc: "asc", desc: "desc", default: "default" }, "default"),
		paginationAt: (0, _storybookAddonKnobs.select)("paginationAt", { bottom: "bottom", top: "top", both: "both" }, "bottom")
	});
}));