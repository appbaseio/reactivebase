/* eslint max-lines: 0 */
import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, number, array, select, object } from "@storybook/addon-knobs";

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
import SingleDataListDefault from "./SingleDataList.stories";
import MultiDataListDefault from "./MultiDataList.stories";

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

const moment = require("moment");

require("../../node_modules/materialize-css/dist/css/materialize.min.css");
require("../../dist/css/style.min.css");
require("./list.css");

function removeFirstLine(str, number = 1) {
	while (number--) {
		str = str.substring(str.indexOf("\n") + 1);
	}
	return str;
}

storiesOf("SingleList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch placeholder="Search City" showFilter={false} />
	)))
	.add("With title", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch placeholder="Search City" showFilter={false} title={text("title", "Cities")} />
	)))
	.add("With size", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch placeholder="Search City" showFilter={false} size={number("size", 10)} />
	)))
	.add("Without count", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch placeholder="Search City" showFilter={false} showCount={boolean("showCount", false)} />
	)))
	.add("Without Search", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch={boolean("showSearch", false)} placeholder="Search City" showFilter={false} />
	)))
	.add("With filter", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch placeholder="Search City" showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "City filter")} />
	)))
	.add("Wihout radio buttons", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch placeholder="Search City" showFilter={false} showRadio={boolean("showRadio", false)} />
	)))
	.add("Default Selected", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch defaultSelected={text("defaultSelected", "London")} placeholder="Search City" showFilter={false} />
	)))
	.add("Custom Sort", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault title="SingleList: Custom Sort" showSearch defaultSelected="London" sortBy={select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "asc")} placeholder="Search City" showFilter={false} />
	)))
	.add("With Select All", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch selectAllLabel={text("selectAllLabel", "All Cities")} placeholder="Search City" showFilter={false} />
	)))
	.add("Playground", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault
			title={text("title", "SingleList: City Filter")}
			size={number("size", 100)}
			sortBy={select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count")}
			defaultSelected={text("defaultSelected", "San Francisco")}
			showCount={boolean("showCount", true)}
			showSearch={boolean("showSearch", true)}
			placeholder={text("placeholder", "Search City")}
			selectAllLabel={text("selectAllLabel", "All cities")}
			showRadio={boolean("showRadio", true)}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "City filter")}
		/>
	)));

storiesOf("MultiList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch placeholder="Search City" showFilter={false} />
	)))
	.add("With title", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch placeholder="Search City" showFilter={false} title={text("title", "MultiList: City Filter")} />
	)))
	.add("With size", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch placeholder="Search City" showFilter={false} size={number("size", 10)} />
	)))
	.add("With filter", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch placeholder="Search City" showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "City filter")} />
	)))
	.add("With queryFormat", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch placeholder="Search City" queryFormat={select("queryFormat", { and: "and", or: "or" }, "and")} />
	)))
	.add("Wihout count", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch placeholder="Search City" showFilter={false} showCount={boolean("showCount", false)} />
	)))
	.add("Without Search", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch={boolean("showSearch", false)} placeholder="Search City" showFilter={false} />
	)))
	.add("Without checkbox", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch placeholder="Search City" showFilter={false} showCheckbox={boolean("showCheckbox", false)} />
	)))
	.add("Default Selected", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch defaultSelected={array("defaultSelected", ["London", "Sydney"])} placeholder="Search City" showFilter={false} />
	)))
	.add("Custom Sort", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault title="MultiList: Custom Sort" showSearch defaultSelected={["London"]} sortBy={select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "asc")} placeholder="Search City" showFilter={false} />
	)))
	.add("With Select All", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch selectAllLabel={text("selectAllLabel", "All Cities")} placeholder="Search City" showFilter={false} />
	)))
	.add("Playground", withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault
			title={text("title", "MultiList: City Filter")}
			size={number("size", 10)}
			sortBy={select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count")}
			defaultSelected={array("defaultSelected", ["London", "Sydney"])}
			showCount={boolean("showCount", true)}
			showSearch={boolean("showSearch", true)}
			showCheckbox={boolean("showCheckbox", true)}
			placeholder={text("placeholder", "Search City")}
			selectAllLabel={text("selectAllLabel", "All cities")}
			queryFormat={select("queryFormat", { and: "and", or: "or" }, "or")}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "City filter")}
		/>
	)));

storiesOf("SingleDropdownList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault showFilter={false} />
	)))
	.add("With title", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault showFilter={false} title={text("title", "City list")} />
	)))
	.add("With size", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault showFilter={false} size={number("size", 10)} />
	)))
	.add("With filter", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "City filter")} />
	)))
	.add("With custom sort", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault showFilter={false} sortBy={select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "asc")} />
	)))
	.add("Without count", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault showFilter={false} showCount={boolean("showCount", false)} />
	)))
	.add("With Select All", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault
			selectAllLabel={text("selectAllLabel", "All Cities")}
			showFilter={false}
		/>
	)))
	.add("With Default Selected", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault
			selectAllLabel="All Cities"
			defaultSelected={text("defaultSelected", "London")}
			showFilter={false}
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault
			title={text("title", "SingleDropdownList")}
			size={number("size", 100)}
			showCount={boolean("showCount", true)}
			sortBy={select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count")}
			selectAllLabel={text("selectAllLabel", "All Cities")}
			defaultSelected={text("defaultSelected", "London")}
			placeholder={text("placeholder", "Select a City")}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "City filter")}
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
	.add("Without showCount", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault showCount={boolean("showCount", false)} />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			placeholder="Select Cities"
			size={100}
			sortBy="count"
			defaultSelected={["London", "Melbourne"]}
		/>
	)))
	.add("With queryFormat as and", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			placeholder="Select Cities"
			size={100}
			sortBy="count"
			defaultSelected={["London"]}
			queryFormat="and"
		/>
	)))
	.add("With queryFormat as or", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			placeholder="Select Cities"
			size={100}
			sortBy="count"
			defaultSelected={["London", "Melbourne"]}
			queryFormat="or"
		/>
	)))
	.add("With filterLabel", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			placeholder="Select Cities"
			size={100}
			sortBy="count"
			defaultSelected={["London", "Melbourne"]}
			queryFormat="or"
			filterLabel="Custom Filter Name"
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			title={text("title", "MultiDropdownList")}
			size={number("size", 100)}
			showCount={boolean("showCount", true)}
			sortBy={select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "count")}
			queryFormat={select("queryFormat", { and: "and", or: "or" }, "and")}
			selectAllLabel={text("selectAllLabel", "All Cities")}
			defaultSelected={array("defaultSelected", ["London", "Melbourne"])}
			placeholder={text("placeholder", "Select Cities")}
		/>
	)));

storiesOf("SingleDataList", module)
	.add("Basic", () => (
		<SingleDataListDefault />
	))
	.add("With defaultSelected", () => (
		<SingleDataListDefault defaultSelected={"Social"} />
	))
	.add("Without Radio", () => (
		<SingleDataListDefault showRadio={false} />
	))
	.add("With filterLabel", () => (
		<SingleDataListDefault defaultSelected={"Social"} filterLabel="Custom Filter Name" />
	));

storiesOf("MultiDataList", module)
	.add("Basic", () => (
		<MultiDataListDefault />
	))
	.add("With defaultSelected", () => (
		<MultiDataListDefault defaultSelected={["Social", "Travel"]} />
	))
	.add("Without Checkbox", () => (
		<MultiDataListDefault showCheckbox={false} />
	))
	.add("With filterLabel", () => (
		<MultiDataListDefault defaultSelected={["Social", "Travel"]} filterLabel="Custom Filter Name" />
	));

storiesOf("SingleRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault defaultSelected="Cheap" />
	)))
	.add("Without Radio", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault showRadio={false} />
	)))
	.add("With filterLabel", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault filterLabel="Custom Filter Name" />
	)))
	.add("Playground", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault
			title={text("title", "SingleRange: Price Filter")}
			defaultSelected={text("defaultSelected", "Cheap")}
			showRadio={boolean("showRadio", true)}
		/>
	)));

storiesOf("MultiRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault defaultSelected={["Cheap", "Moderate"]} />
	)))
	.add("Without Checkbox", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault showCheckbox={false} />
	)))
	.add("With filterLabel", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault filterLabel="Custom Filter Name" />
	)))
	.add("Playground", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault
			title={text("title", "MultiRange: Price Filter")}
			defaultSelected={array("defaultSelected", ["Cheap", "Moderate"])}
			showCheckbox={boolean("showCheckbox", true)}
		/>
	)));

storiesOf("SingleDropdownRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault defaultSelected="Cheap" />
	)))
	.add("With filterLabel", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault defaultSelected="Cheap" filterLabel="Custom Filter Name" />
	)))
	.add("Playground", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault
			title={text("title", "SingleDropdownRange: Price Filter")}
			defaultSelected={text("defaultSelected", "Cheap")}
		/>
	)));

storiesOf("MultiDropdownRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault defaultSelected={["Cheap", "Moderate"]} />
	)))
	.add("With filterLabel", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault defaultSelected={["Cheap", "Moderate"]} filterLabel="Custom Filter Name" />
	)))
	.add("Playground", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault
			title={text("title", "MultiDropdownRange: Price Filter")}
			defaultSelected={array("defaultSelected", ["Cheap", "Moderate"])}
		/>
	)));

storiesOf("RangeSlider", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			defaultSelected={{
				start: 0,
				end: 2
			}}
		/>
	)))
	.add("Without histogram", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			showHistogram={false}
		/>
	)))
	.add("With Range Labels", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			defaultSelected={{
				start: 0,
				end: 2
			}}
			rangeLabels={{
				start: "Start",
				end: "End"
			}}
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			title={text("title", "RangeSlider: Guest RSVPs")}
			range={object("range", {
				start: 0,
				end: 5
			})}
			stepValue={number("stepValue", 1)}
			defaultSelected={object("defaultSelected", {
				start: 0,
				end: 2
			})}
			rangeLabels={object("rangeLabels", {
				start: "Start",
				end: "End"
			})}
			showHistogram={boolean("showHistogram", true)}
		/>
	)));

storiesOf("NumberBox", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			data={{
				label: "Car Ratings",
				start: 1,
				end: 5
			}}
			labelPosition="left"
		/>
	)))
	.add("Default Selected", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			data={{
				label: "Car Ratings",
				start: 1,
				end: 5
			}}
			defaultSelected={2}
			labelPosition="left"
		/>
	)))
	.add("Exact query", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			data={{
				label: "Car Ratings",
				start: 1,
				end: 5
			}}
			defaultSelected={3}
			labelPosition="left"
			queryFormat="exact"
		/>
	)))
	.add("Less than query", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			data={{
				label: "Car Ratings",
				start: 1,
				end: 5
			}}
			defaultSelected={5}
			labelPosition="left"
			queryFormat="lte"
		/>
	)))
	.add("With filterLabel", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			data={{
				label: "Car Ratings",
				start: 1,
				end: 5
			}}
			defaultSelected={5}
			labelPosition="left"
			filterLabel="Custom Filter Name"
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			defaultSelected={number("defaultSelected", 3)}
			data={object("data", {
				start: 1,
				end: 5,
				label: "Car Ratings"
			})}
			labelPosition={select("labelPosition", { bottom: "bottom", top: "top", left: "left", right: "right" }, "right")}
			queryFormat={select("queryFormat", { gte: "gte", lte: "lte", exact: "exact"}, "gte")}
		/>
	)));

storiesOf("ToggleButton", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault defaultSelected={["Social"]} />
	)))
	.add("With filterLabel", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault defaultSelected={["Social"]} filterLabel="Custom Filter Name" />
	)))
	.add("Playground", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault
			title={text("title", "ToggleButton: Meetup Categories")}
			multiSelect={boolean("multiSelect", true)}
			defaultSelected={array("defaultSelected", ["Social", "Travel"])}
		/>
	)));

storiesOf("TextField", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault />
	)))
	.add("DefaultSelected", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault defaultSelected="nissan" />
	)))
	.add("With filterLabel", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault defaultSelected="nissan" filterLabel="Custom Filter Name" />
	)))
	.add("Playground", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault
			title={text("title", "TextField: Car Search")}
			placeholder={text("placeholder", "Type a car name")}
			defaultSelected={text("defaultSelected", "nissan")}
		/>
	)));

storiesOf("DataSearch", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venue"
		/>
	)))
	.add("Without Autocomplete", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venue"
			autoSuggest={false}
		/>
	)))
	.add("With Weights", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venue"
			weights={[1, 3]}
		/>
	)))
	.add("With filterLabel", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venue"
			weights={[1, 3]}
			filterLabel="Custom Filter Name"
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title={text("title", "DataSearch")}
			placeholder={text("placeholder", "Search Venue")}
			autoSuggest={boolean("autoSuggest", true)}
			weights={array("weights", [1,3])}
		/>
	)));

storiesOf("DataSearchHighlight", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchHighlight
			title="DataSearch"
		/>
	)))
	.add("With filterLabel", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchHighlight
			title="DataSearch"
			filterLabel="Custom Filter Name"
		/>
	)));

storiesOf("DataController", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(DataControllerReadme), () => (
		<DataControllerDefault />
	)))
	.add("With UI", withReadme(removeFirstLine(DataControllerReadme), () => (
		<DataControllerDefault
			title="DataController"
			visible={true}
			dataLabel={
				<p>★ A customizable UI widget ★</p>
			}
		/>
	)))
	.add("With filterLabel", withReadme(removeFirstLine(DataControllerReadme), () => (
		<DataControllerDefault
			title="DataController"
			visible={true}
			dataLabel={
				<p>★ A customizable UI widget ★</p>
			}
			filterLabel="Custom Filter Name"
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(DataControllerReadme), () => (
		<DataControllerDefault
			title={text("title", "DataController")}
			visible={boolean("visible", true)}
			dataLabel={text("dataLabel", "★  A customizable UI widget ★")}
			defaultSelected={text("defaultSelected", "default")}
			componentStyle={object("componentStyle", { "padding-bottom": "10px" })}
		/>
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
			defaultSelected={moment().subtract(1, "day")}
		/>
	)))
	.add("Enable days from today only", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			allowAllDates={false}
		/>
	)))
	.add("Using extra prop object", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			extra={{
				withFullScreenPortal: true,
				showClearDate: true
			}}
		/>
	)))
	.add("With filterLabel", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			allowAllDates={false}
			filterLabel="Custom Filter Name"
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			title={text("title", "Date Picker")}
			numberOfMonths={number("numberOfMonths", 1)}
			allowAllDates={boolean("allowAllDates", true)}
			queryFormat={select("queryFormat", {"epoch_millis":"epoch_millis","epoch_seconds":"epoch_seconds","date":"date","date_time":"date_time","date_time_no_millis":"date_time_no_millis","basic_date":"basic_date","basic_date_time":"basic_date_time","basic_date_time_no_millis":"basic_date_time_no_millis","basic_time":"basic_time","basic_time_no_millis":"basic_time_no_millis"}, "epoch_millis")}
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
			defaultSelected={{
				start: moment().subtract(7, "days"),
				end: moment()
			}}
		/>
	)))
	.add("Enable days from today only", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			allowAllDates={false}
		/>
	)))
	.add("Using extra prop object", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			extra={{
				withFullScreenPortal: true,
				showClearDate: true
			}}
		/>
	)))
	.add("With filterLabel", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			allowAllDates={false}
			filterLabel="Custom Filter Name"
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			title={text("title", "Date Range")}
			numberOfMonths={number("numberOfMonths", 2)}
			allowAllDates={boolean("allowAllDates", true)}
			queryFormat={select("queryFormat", {"epoch_millis":"epoch_millis","epoch_seconds":"epoch_seconds","date":"date","date_time":"date_time","date_time_no_millis":"date_time_no_millis","basic_date":"basic_date","basic_date_time":"basic_date_time","basic_date_time_no_millis":"basic_date_time_no_millis","basic_time":"basic_time","basic_time_no_millis":"basic_time_no_millis"}, "epoch_millis")}
		/>
	)));

storiesOf("PoweredBy", module)
	.add("Basic", () => (
		<PoweredByDefault />
	));

storiesOf("ReactiveElement", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(ReactiveElementReadme, 3), () => (
		<ReactiveElement.Basic />
	)))
	.add("Stream", withReadme(removeFirstLine(ReactiveElementReadme, 3), () => (
		<ReactiveElement.WithStream />
	)))
	.add("Theme", withReadme(removeFirstLine(ReactiveElementReadme, 3), () => (
		<ReactiveElement.WithTheme />
	)))
	.add("Playground", withReadme(removeFirstLine(ReactiveElementReadme, 3), () => (
		<ReactiveElement.Basic
			title={text("title", "ReactiveElement")}
			placeholder={text("placeholder", "Select city from the list")}
			from={number("from", 0)}
			size={number("size", 5)}
			initialLoader="Loading results.."
			noResults="No results found! Try a different filter duh.."
			stream={boolean("stream", false)}
			showResultStats={boolean("showResultStats", true)}
		/>
	)));

storiesOf("ReactiveList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault onAllData={null} stream={false} />
	)))
	.add("With Custom Markup", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault stream={false} />
	)))
	.add("Without Title", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault title="" stream={false} />
	)))
	.add("With Streaming Enabled", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault title="Meetups" stream />
	)))
	.add("With pagination", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault pagination title="Meetups" />
	)))
	.add("With pagination at top", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault pagination paginationAt="top" title="Meetups" />
	)))
	.add("With pagination at both", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault pagination paginationAt="both" title="Meetups" />
	)))
	.add("With pages", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault pagination paginationAt="top" title="Meetups" pages={number("pages", 9)} />
	)))
	.add("With Sort Options", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault
			title="Meetups"
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
	.add("With Loader", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault
			title="Meetups"
			stream={false}
			initialLoader="Loading results.."
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault
			title={text("title", "ReactiveList: Results")}
			from={number("from", 0)}
			size={number("size", 5)}
			initialLoader={text("initialLoader", "Loading results..")}
			noResults={text("noResults", "No results found!")}
			showResultStats={boolean("showResultStats", true)}
			pagination={boolean("pagination", true)}
			paginationAt={select("paginationAt", { bottom: "bottom", top: "top", both: "both" }, "bottom")}
			pages={number("pages", 5)}
			stream={boolean("stream", false)}
		/>
	)));
