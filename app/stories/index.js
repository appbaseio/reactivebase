import React from "react";
var moment = require("moment");
import { storiesOf, addDecorator } from "@kadira/storybook";
import { withKnobs, text, boolean, number, array, select, object } from "@kadira/storybook-addon-knobs";
import withReadme from "storybook-readme/with-readme";

import { Appbase } from "appbase-js";

import SingleListDefault from "./SingleList.stories";
import SingleListReadme from "@appbaseio/reactivebase-manual/docs/v1/components/SingleList.md";

import MultiListDefault from "./MultiList.stories";
import MultiListReadme from "@appbaseio/reactivebase-manual/docs/v1/components/MultiList.md";

import SingleRangeDefault from "./SingleRange.stories";
import SingleRangeReadme from "@appbaseio/reactivebase-manual/docs/v1/components/SingleRange.md";

import MultiRangeDefault from "./MultiRange.stories";
import MultiRangeReadme from "@appbaseio/reactivebase-manual/docs/v1/components/MultiRange.md";

import ToggleButtonDefault from "./ToggleButton.stories";
import ToggleButtonReadme from "@appbaseio/reactivebase-manual/docs/v1/components/ToggleButton.md";

import TextFieldDefault from "./TextField.stories";
import TextFieldReadme from "@appbaseio/reactivebase-manual/docs/v1/components/TextField.md";

import DataSearchDefault from "./DataSearch.stories";
import DataSearchReadme from "@appbaseio/reactivebase-manual/docs/v1/components/DataSearch.md";

import RangeSliderDefault from "./RangeSlider.stories";
import RangeSliderReadme from "@appbaseio/reactivebase-manual/docs/v1/components/RangeSlider.md";

import SingleDropdownListDefault from "./SingleDropdownList.stories";
import SingleDropdownListReadme from "@appbaseio/reactivebase-manual/docs/v1/components/SingleDropdownList.md";

import MultiDropdownListDefault from "./MultiDropdownList.stories";
import MultiDropdownListReadme from "@appbaseio/reactivebase-manual/docs/v1/components/MultiDropdownList.md";

import SingleDropdownRangeDefault from "./SingleDropdownRange.stories";
import SingleDropdownRangeReadme from "@appbaseio/reactivebase-manual/docs/v1/components/SingleDropdownRange.md";

import MultiDropdownRangeDefault from "./MultiDropdownRange.stories";
import MultiDropdownRangeReadme from "@appbaseio/reactivebase-manual/docs/v1/components/MultiDropdownRange.md";

import ResultListDefault from "./ResultList.stories";
import ResultListReadme from "@appbaseio/reactivebase-manual/docs/v1/components/ResultList.md";

import PaginatedResultListDefault from "./PaginatedResultList.stories";
import PaginatedResultListReadme from "@appbaseio/reactivebase-manual/docs/v1/components/PaginatedResultList.md";

import DatePickerDefault from "./DatePicker.stories";
import DatePickerReadme from "@appbaseio/reactivebase-manual/docs/v1/components/DatePicker.md";

import DateRangeDefault from "./DateRange.stories";
import DateRangeReadme from "@appbaseio/reactivebase-manual/docs/v1/components/DateRange.md";

import NestedListDefault from "./NestedList.stories";
import NestedListReadme from "@appbaseio/reactivebase-manual/docs/v1/components/NestedList.md";

require ("../../node_modules/materialize-css/dist/css/materialize.min.css");
require ("../../dist/css/vendor.min.css");
require ("../../dist/css/style.min.css");

function removeFirstLine(str) {
	return str.substring(str.indexOf("\n") + 1);
}

storiesOf("SingleList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch={true} placeholder="Search City" />
	)))
	.add("Without Search", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch={false} placeholder="Search City" />
	)))
	.add("Default Selected", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch={true} defaultSelected="San Francisco" placeholder="Search City" />
	)))
	.add("Custom Sort", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault title="SingleList: Ascending Sort" showSearch={true} defaultSelected="London" sortBy="asc" placeholder="Search City" />
	)))
	.add("With Select All", withReadme(removeFirstLine(MultiListReadme), () => (
		<SingleListDefault showSearch={true} selectAllLabel="All Cities" placeholder="Search City" />
	)))
	.add("Playground", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault
			title={text("title", "SingleList: City Filter")}
			size={number("size", 100)}
			sortBy={select("sortBy", {asc: "asc", desc: "desc", count: "count"}, "count")}
			defaultSelected={text("defaultSelected", "San Francisco")}
			showCount={boolean("showCount", true)}
			showSearch={boolean("showSearch", true)}
			placeholder={text("placeholder", "Search City")}
			selectAllLabel={text("selectAllLabel", "All cities")}
		/>
	)));

storiesOf("MultiList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch={true} placeholder="Search City" />
	)))
	.add("Without Search", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch={false} placeholder="Search City" />
	)))
	.add("Default Selected", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch={true} defaultSelected={["London", "Sydney"]} placeholder="Search City" />
	)))
	.add("Custom Sort", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault title="MultiList: Ascending Sort" showSearch={true} defaultSelected={["London"]} sortBy="asc" placeholder="Search City" />
	)))
	.add("With Select All", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch={true} selectAllLabel="All Cities" placeholder="Search City" />
	)))
	.add("Playground", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault
			title={text("title", "MultiList: City Filter")}
			size={number("size", 10)}
			sortBy={select("sortBy", {asc: "asc", desc: "desc", count: "count"}, "count")}
			defaultSelected={array("defaultSelected", ["London", "Sydney"])}
			showCount={boolean("showCount", true)}
			showSearch={boolean("showSearch", true)}
			placeholder={text("placeholder", "Search City")}
			selectAllLabel={text("selectAllLabel", "All cities")}
		/>
	)));

storiesOf("SingleDropdownList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault />
	)))
	.add("With Select All", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault
			selectAllLabel="All Cities"
		/>
	)))
	.add("With Default Selected", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault
			selectAllLabel="All Cities"
			defaultSelected="London"
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault
			title={text("title", "SingleDropdownList")}
			size={number("size", 100)}
			sortBy={select("sortBy", {asc: "asc", desc: "desc", count: "count"}, "count")}
			selectAllLabel={text("selectAllLabel", "All Cities")}
			defaultSelected={text("defaultSelected", "London")}
			placeholder={text("placeholder", "Select a City")}
			/>
	)));

storiesOf("MultiDropdownList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault />
	)))
	.add("With Placeholder", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			placeholder="Select Cities"
		/>
	)))
	.add("With Select All", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			placeholder="Select Cities"
			selectAllLabel="All Cities"
		/>
	)))
	.add("With Default Selected", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			placeholder="Select Cities"
			size={100}
			sortBy="count"
			defaultSelected={["London", "Melbourne"]}
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			title={text("title", "MultiDropdownList")}
			size={number("size", 100)}
			sortBy={select("sortBy", {asc: "asc", desc: "desc", count: "count"}, "count")}
			selectAllLabel={text("selectAllLabel", "All Cities")}
			defaultSelected={array("defaultSelected", ["London", "Melbourne"])}
			placeholder={text("placeholder", "Select Cities")}
		/>
	)));

storiesOf("NestedList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(NestedListReadme), () => (
		<NestedListDefault />
	)))
	.add("With Title", withReadme(removeFirstLine(NestedListReadme), () => (
		<NestedListDefault
			title={text("title", "Car Category")} />
	)))
	.add("Default selection", withReadme(removeFirstLine(NestedListReadme), () => (
		<NestedListDefault
			defaultSelected={["bmw", "x series"]} />
	))).add("Playground", withReadme(removeFirstLine(NestedListReadme), () => (
		<NestedListDefault
			title={text("title", "NestedList: Car Filter")}
			size={number("size", 100)}
			sortBy={select("sortBy", {asc: "asc", desc: "desc", count: "count"}, "count")}
			defaultSelected={array("defaultSelected", ["bmw", "x series"])}
			showCount={boolean("showCount", true)}
			showSearch={boolean("showSearch", true)}
			placeholder={text("placeholder", "Search Cars")}
		/>
	)));

storiesOf("SingleRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault defaultSelected="Cheap" />
	)))
	.add("Playground", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault
			title={text("title", "SingleRange: Price Filter")}
			defaultSelected={text("defaultSelected", "Cheap")} />
	)));

storiesOf("MultiRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault defaultSelected={["Cheap", "Moderate"]} />
	)))
	.add("Playground", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault
			title={text("title", "MultiRange: Price Filter")}
			defaultSelected={array("defaultSelected", ["Cheap", "Moderate"])}
			showTags={boolean("showTags", "false")} />
	)));

storiesOf("SingleDropdownRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault defaultSelected="Cheap" />
	)))
	.add("Playground", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault
			title={text("title", "SingleDropdownRange: Price Filter")}
			defaultSelected={text("defaultSelected", "Cheap")} />
	)));

storiesOf("MultiDropdownRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault defaultSelected={["Cheap", "Moderate"]} />
	)))
	.add("Playground", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault
			title={text("title", "MultiDropdownRange: Price Filter")}
			defaultSelected={array("defaultSelected", ["Cheap", "Moderate"])} />
	)));

storiesOf("ToggleButton", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault defaultSelected={["Social"]} />
	)))
	.add("Playground", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault
			title={text("title", "ToggleButton: Meetup Categories")}
			multiSelect={boolean("multiSelect", true)}
			defaultSelected={array("defaultSelected", ["Social", "Travel"])}
		/>
	)));

storiesOf("RangeSlider", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			defaultSelected={
				{
					"start": 0,
					"end": 2
				}
			}
		/>
	)))
	.add("With Range Labels", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			defaultSelected={
				{
					"start": 0,
					"end": 2
				}
			}
			rangeLabels={
				{
					"start": "Start",
					"end": "End"
				}
			}
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			title={text("paginationAt", "RangeSlider: Guest RSVPs")}
			range={object("range", {
				"start": 0,
				"end": 5
			})}
			stepValue={number("stepValue", 1)}
			defaultSelected={object("defaultSelected", {
				"start": 0,
				"end": 2
			})}
			rangeLabels={object("rangeLabels", {
				"start": 'Start',
				"end": 'End'
			})}
		/>
	)));

storiesOf("TextField", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault />
	)))
	.add("Playground", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault
			title={text("title", "TextField: Car Search")}
			placeholder={text("placeholder", "Type a car name")} />
	)));

storiesOf("DataSearch", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venue" />
	)))
	.add("Without Autocomplete", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venue"
			autocomplete={false} />
	)))
	.add("Playground", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title={text("title", "DataSearch")}
			placeholder={text("placeholder", "Search Venue")}
			autocomplete={boolean("autocomplete", true)} />
	)));

storiesOf("DatePicker", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault />
	)))
	.add("Show more than 1 month", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			numberOfMonths={2}
		/>
	)))
	.add("Default date", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			date={moment()}
		/>
	)))
	.add("Initial Focus", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault />
	)))
	.add("Enable days from today only", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			allowAllDates={false}
		/>
	)))
	.add("React-dates props", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			extra = {{
				"withFullScreenPortal": true,
				"showClearDate": true
			}}
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			title={text("title", "Date Picker")}
			numberOfMonths={number("Number of months", 1)}
			allowAllDates={boolean("allowAllDates: Enable days from today only", true)}
		/>
	)));

storiesOf("DateRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault />
	)))
	.add("Show more than 1 month", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			numberOfMonths={3}
		/>
	)))
	.add("Default date", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			startDate={moment()}
			endDate={moment().add(5, "days")}
		/>
	)))
	.add("Enable days from today only", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			allowAllDates={false}
		/>
	)))
	.add("React-dates props", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			extra = {{
				"withFullScreenPortal": true,
				"showClearDate": true
			}}
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			title={text("title", "Date Range")}
			numberOfMonths={number("Number of months", 2)}
			allowAllDates={boolean("allowAllDates: Enable days from today only", true)}
		/>
	)));

storiesOf("ResultList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(ResultListReadme), () => (
		<ResultListDefault requestOnScroll={true} stream={false} />
	)))
	.add("With Title", withReadme(removeFirstLine(ResultListReadme), () => (
		<ResultListDefault title="Meetups" requestOnScroll={true} stream={false} />
	)))
	.add("With Streaming", withReadme(removeFirstLine(ResultListReadme), () => (
		<ResultListDefault title="Meetups" stream={true} />
	)))
	.add("With Sort Options", withReadme(removeFirstLine(ResultListReadme), () => (
		<ResultListDefault
			title="Meetups"
			requestOnScroll={true}
			stream={false}
			sortOptions={[
				{
					label: "Most Recent RSVP",
					appbaseField: "mtime",
					sortBy: "desc"
				},
				{
					label: "Guests - High to Low",
					appbaseField: "guests",
					sortBy: "desc"
				},
				{
					label: "Guests - Low to High",
					appbaseField: "guests",
					sortBy: "asc"
				}
			]}
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(ResultListReadme), () => (
		<ResultListDefault
			title={text("title", "ResultList: Results")}
			from={number("from", 0)}
			size={number("size", 5)}
			requestOnScroll={boolean("requestOnScroll", true)}
			stream={boolean("stream", false)} />
	)));

storiesOf("PaginatedResultList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(PaginatedResultListReadme), () => (
		<PaginatedResultListDefault/>
	)))
	.add("Without on data", withReadme(removeFirstLine(PaginatedResultListReadme), () => (
		<PaginatedResultListDefault
			onData={null}
		/>
	)))
	.add("With Sort Options", withReadme(removeFirstLine(PaginatedResultListReadme), () => (
		<PaginatedResultListDefault
			sortOptions={[
				{
					label: "Most Recent RSVP",
					appbaseField: "mtime",
					sortBy: "desc"
				},
				{
					label: "Guests - High to Low",
					appbaseField: "guests",
					sortBy: "desc"
				},
				{
					label: "Guests - Low to High",
					appbaseField: "guests",
					sortBy: "asc"
				}
			]}
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(PaginatedResultListReadme), () => (
		<PaginatedResultListDefault
			title={text("title", "PaginatedResultList: Playground")}
			from={number("from", 0)}
			size={number("size", 5)}
			sortBy={select("sortBy", {"asc": "asc", "desc": "desc", "default": "default"}, "default")}
			paginationAt={select("paginationAt", {"bottom": "bottom", "top": "top", "both": "both"}, "bottom")}
		/>
	)));
