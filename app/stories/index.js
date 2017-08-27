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
	.add("With URLParams", withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch placeholder="Search City" showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
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
			URLParams={boolean("URLParams (not visible on storybook)", false)}
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
	.add("With URLParams", withReadme(removeFirstLine(SingleListReadme), () => (
		<MultiListDefault showSearch placeholder="Search City" showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
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
			URLParams={boolean("URLParams (not visible on storybook)", false)}
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
	.add("With URLParams", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<SingleDropdownListDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
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
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));

storiesOf("MultiDropdownList", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault showFilter={false} />
	)))
	.add("With title", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<MultiDropdownListDefault showFilter={false} title={text("title", "City list")} />
	)))
	.add("With Placeholder", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			placeholder={text("placeholder", "Select Cities")}
			showFilter={false}
		/>
	)))
	.add("With size", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<MultiDropdownListDefault showFilter={false} size={number("size", 10)} />
	)))
	.add("With filter", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<MultiDropdownListDefault showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "Cities filter")} />
	)))
	.add("Without count", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<MultiDropdownListDefault showFilter={false} showCount={boolean("showCount", false)} />
	)))
	.add("With custom sort", withReadme(removeFirstLine(SingleDropdownListReadme), () => (
		<MultiDropdownListDefault showFilter={false} sortBy={select("sortBy", { asc: "asc", desc: "desc", count: "count" }, "asc")} />
	)))
	.add("With queryFormat", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault showFilter={false} queryFormat={select("queryFormat", { and: "and", or: "or" }, "and")} />
	)))
	.add("With Select All", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			placeholder="Select Cities"
			selectAllLabel={text("selectAllLabel", "All Cities")}
			showFilter={false}
		/>
	)))
	.add("With Default Selected", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault
			placeholder="Select Cities"
			size={100}
			sortBy="count"
			defaultSelected={array("defaultSelected", ["London", "Melbourne"])}
			showFilter={false}
		/>
	)))
	.add("With URLParams", withReadme(removeFirstLine(MultiDropdownListReadme), () => (
		<MultiDropdownListDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
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
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "City filter")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));

storiesOf("SingleDataList", module)
	.addDecorator(withKnobs)
	.add("Basic", () => (
		<SingleDataListDefault showFilter={false} />
	))
	.add("With title", () => (
		<SingleDataListDefault showFilter={false} title={text("title", "Topics")} />
	))
	.add("With defaultSelected", () => (
		<SingleDataListDefault defaultSelected={text("defaultSelected", "Social")} showFilter={false} />
	))
	.add("With showSearch", () => (
		<SingleDataListDefault showFilter={false} showSearch={boolean("showSearch", true)} placeholder={text("placeholder", "Search topics")} />
	))
	.add("Without Radio", () => (
		<SingleDataListDefault showRadio={boolean("showRadio", false)} showFilter={false} />
	))
	.add("With selectAllLabel", () => (
		<SingleDataListDefault showFilter={false} selectAllLabel={text("selectAllLabel", "Select All")} />
	))
	.add("With filter", () => (
		<SingleDataListDefault showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "Custom Filter Name")} />
	))
	.add("With URLParams", () => (
		<SingleDataListDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
	))
	.add("Playground", () => (
		<SingleDataListDefault
			title={text("title", "Topics")}
			defaultSelected={text("defaultSelected", "Social")}
			showSearch={boolean("showSearch", true)}
			placeholder={text("placeholder", "Search topics")}
			showRadio={boolean("showRadio", true)}
			selectAllLabel={text("selectAllLabel", "Select All")}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Custom Filter Name")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	));

storiesOf("MultiDataList", module)
	.addDecorator(withKnobs)
	.add("Basic", () => (
		<MultiDataListDefault showFilter={false} />
	))
	.add("With title", () => (
		<MultiDataListDefault showFilter={false} title={text("title", "Topics")} />
	))
	.add("With defaultSelected", () => (
		<MultiDataListDefault defaultSelected={array("defaultSelected", ["Social", "Travel"])} showFilter={false} />
	))
	.add("With showSearch", () => (
		<MultiDataListDefault showFilter={false} showSearch={boolean("showSearch", true)} placeholder={text("placeholder", "Search topics")} />
	))
	.add("Without Checkbox", () => (
		<MultiDataListDefault showCheckbox={boolean("showCheckbox", false)} showFilter={false} />
	))
	.add("With selectAllLabel", () => (
		<MultiDataListDefault showFilter={false} selectAllLabel={text("selectAllLabel", "Select All")} />
	))
	.add("With filter", () => (
		<MultiDataListDefault showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "Custom Filter Name")} />
	))
	.add("With queryFormat", () => (
		<MultiDataListDefault showFilter={false} queryFormat={select("queryFormat", { and: "and", or: "or" }, "and")} />
	))
	.add("With URLParams", () => (
		<MultiDataListDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
	))
	.add("Playground", () => (
		<MultiDataListDefault
			title={text("title", "Topics")}
			defaultSelected={array("defaultSelected", ["Social", "Travel"])}
			showSearch={boolean("showSearch", true)}
			placeholder={text("placeholder", "Search topics")}
			showCheckbox={boolean("showCheckbox", true)}
			selectAllLabel={text("selectAllLabel", "Select All")}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Custom Filter Name")}
			queryFormat={select("queryFormat", { and: "and", or: "or" }, "or")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	));

storiesOf("SingleRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault showFilter={false} />
	)))
	.add("With title", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault showFilter={false} title={text("title", "SingleRange: Price Filter")} />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault defaultSelected={text("defaultSelected", "Cheap")} showFilter={false} />
	)))
	.add("With filter", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "Price filter")} />
	)))
	.add("Without radio buttons", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault showFilter={false} showRadio={boolean("showRadio", false)} />
	)))
	.add("With URLParams", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
	)))
	.add("Playground", withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault
			title={text("title", "SingleRange: Price Filter")}
			defaultSelected={text("defaultSelected", "Cheap")}
			showRadio={boolean("showRadio", true)}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Price filter")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));

storiesOf("MultiRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault showFilter={false} />
	)))
	.add("With title", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault title={text("title", "MultiRange: Price Filter")} showFilter={false} />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault defaultSelected={array("defaultSelected", ["Cheap", "Moderate"])} showFilter={false} />
	)))
	.add("With filter", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "Price filter")} />
	)))
	.add("Without checkbox", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault showFilter={false} showCheckbox={boolean("showCheckbox", false)} />
	)))
	.add("With URLParams", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
	)))
	.add("Playground", withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault
			title={text("title", "MultiRange: Price Filter")}
			defaultSelected={array("defaultSelected", ["Cheap", "Moderate"])}
			showCheckbox={boolean("showCheckbox", true)}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Price filter")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));

storiesOf("SingleDropdownRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault />
	)))
	.add("With title", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault title={text("title", "SingleDropdownRange: Price Filter")} />
	)))
	.add("With placeholder", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault placeholder={text("placeholder", "Search prices")} />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault defaultSelected={text("defaultSelected", "Cheap")} />
	)))
	.add("With URLParams", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault URLParams={boolean("URLParams (not visible on storybook)", true)} />
	)))
	.add("Playground", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<SingleDropdownRangeDefault
			title={text("title", "SingleDropdownRange: Price Filter")}
			placeholder={text("placeholder", "Search prices")}
			defaultSelected={text("defaultSelected", "Cheap")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));

storiesOf("MultiDropdownRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault />
	)))
	.add("With title", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault title={text("title", "SingleDropdownRange: Price Filter")} />
	)))
	.add("With placeholder", withReadme(removeFirstLine(SingleDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault placeholder={text("placeholder", "Search prices")} />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault defaultSelected={array("defaultSelected", ["Cheap", "Moderate"])} />
	)))
	.add("With URLParams", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault URLParams={boolean("URLParams (not visible on storybook)", true)} />
	)))
	.add("Playground", withReadme(removeFirstLine(MultiDropdownRangeReadme), () => (
		<MultiDropdownRangeDefault
			title={text("title", "MultiDropdownRange: Price Filter")}
			placeholder={text("placeholder", "Search prices")}
			defaultSelected={array("defaultSelected", ["Cheap", "Moderate"])}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));

storiesOf("RangeSlider", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault />
	)))
	.add("With title", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault title={text("title", "RangeSlider: Prices")} />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			defaultSelected={object("defaultSelected", {
				start: 10,
				end: 50
			})}
		/>
	)))
	.add("Without histogram", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			showHistogram={boolean("showHistogram", false)}
		/>
	)))
	.add("With custom histogram interval", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault interval={number("interval", 50)} />
	)))
	.add("With Range Labels", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			rangeLabels={object("rangeLabels", {
				start: "$10",
				end: "$250"
			})}
		/>
	)))
	.add("With URLParams", withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault URLParams={boolean("URLParams (not visible on storybook)", true)} />
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
			URLParams={boolean("URLParams (not visible on storybook)", true)}
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
	.add("With title", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			defaultSelected={2}
			data={{
				start: 1,
				end: 16
			}}
			labelPosition="left"
			title={text("title", "Number of Guests")}
		/>
	)))
	.add("With data", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			defaultSelected={2}
			data={object("data", {
				start: 1,
				end: 16,
				label: "Guests"
			})}
			labelPosition="right"
		/>
	)))
	.add("With defaultSelected", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			defaultSelected={number("defaultSelected", 2)}
			data={{
				start: 1,
				end: 16
			}}
		/>
	)))
	.add("With queryFormat", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			defaultSelected={2}
			data={{
				start: 1,
				end: 16
			}}
			queryFormat={select("queryFormat", { exact: "exact", gte: "gte", lte: "lte" }, "exact")}
		/>
	)))
	.add("With URLParams", withReadme(removeFirstLine(NumberBoxReadme), () => (
		<NumberBoxDefault
			defaultSelected={2}
			data={{
				start: 1,
				end: 16
			}}
			labelPosition="left"
			URLParams={boolean("URLParams (not visible on storybook)", true)}
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
			queryFormat={select("queryFormat", { gte: "gte", lte: "lte", exact: "exact" }, "gte")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));

storiesOf("ToggleButton", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault showFilter={false} />
	)))
	.add("With title", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault showFilter={false} title={text("title", "ToggleButton: Meetup Categories")} />
	)))
	.add("With Default Selected", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault defaultSelected={array("defaultSelected", ["Social", "Travel"])} showFilter={false} />
	)))
	.add("With filter", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "Category filter")} />
	)))
	.add("Without multiSelect", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault showFilter={false} multiSelect={boolean("multiSelect", false)} />
	)))
	.add("With URLParams", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
	)))
	.add("Playground", withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault
			title={text("title", "ToggleButton: Meetup Categories")}
			multiSelect={boolean("multiSelect", true)}
			defaultSelected={array("defaultSelected", ["Social", "Travel"])}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Category filter")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));

storiesOf("TextField", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault showFilter={false} />
	)))
	.add("With title", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault title={text("title", "Cars")} showFilter={false} />
	)))
	.add("DefaultSelected", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault defaultSelected={text("defaultSelected", "Nissan")} showFilter={false} />
	)))
	.add("With filter", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "Cars filter")} />
	)))
	.add("With URLParams", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
	)))
	.add("Playground", withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault
			title={text("title", "TextField: Car Search")}
			placeholder={text("placeholder", "Type a car name")}
			defaultSelected={text("defaultSelected", "nissan")}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Cars filter")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));

storiesOf("DataSearch", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venue"
			showFilter={false}
		/>
	)))
	.add("With title", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title={text("title", "Venue Search")}
			placeholder="Search Venues"
			showFilter={false}
		/>
	)))
	.add("With filter", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venues"
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Venues filter")}
		/>
	)))
	.add("Without autoSuggest", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venue"
			autoSuggest={boolean("autoSuggest", false)}
			showFilter={false}
		/>
	)))
	.add("With defaultSelected", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venues"
			showFilter={false}
			defaultSelected={text("defaultSelected", "Jazz")}
		/>
	)))
	.add("With initialSuggestions", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venues"
			showFilter={false}
			initialSuggestions={[{ label: "Songwriting", value: "Songwriting" }, { label: "Jazz", value: "Jazz" }]}
		/>
	)))
	.add("With Weights", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venues"
			weights={array("weights", [1,3])}
			showFilter={false}
		/>
	)))
	.add("With queryFormat", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venue"
			showFilter={false}
			queryFormat={select("queryFormat", { and: "and", or: "or" }, "and")}
		/>
	)))
	.add("With fuzziness", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venues"
			showFilter={false}
			fuzziness={number("fuzziness", 1)}
		/>
	)))
	.add("With highlight", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venues"
			showFilter={false}
			highlight={boolean("highlight", true)}
		/>
	)))
	.add("With URLParams", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title="DataSearch"
			placeholder="Search Venues"
			showFilter={false}
			URLParams={boolean("URLParams (not visible on storybook)", true)}
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault
			title={text("title", "DataSearch: Venues")}
			placeholder={text("placeholder", "Search Venues")}
			autoSuggest={boolean("autoSuggest", true)}
			defaultSelected={text("defaultSelected", "")}
			weights={array("weights", [1, 3])}
			queryFormat={select("queryFormat", { and: "and", or: "or" }, "or")}
			fuzziness={number("fuzziness", 1)}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Venue filter")}
			highlight={boolean("highlight", false)}
			URLParams={boolean("URLParams (not visible on storybook)", true)}
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
		<DataControllerDefault showFilter={false} />
	)))
	.add("With UI", withReadme(removeFirstLine(DataControllerReadme), () => (
		<DataControllerDefault
			title="DataController"
			visible={boolean("visible", true)}
			dataLabel={
				<p>★ A customizable UI widget ★</p>
			}
			showFilter={false}
		/>
	)))
	.add("With defaultSelected", withReadme(removeFirstLine(DataControllerReadme), () => (
		<DataControllerDefault defaultSelected={text("defaultSelected", "Audi")} />
	)))
	.add("With filter", withReadme(removeFirstLine(DataControllerReadme), () => (
		<DataControllerDefault
			title="DataController"
			visible={true}
			dataLabel={
				<p>★ A customizable UI widget ★</p>
			}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Custom Filter Name")}
		/>
	)))
	.add("With URLParams", withReadme(removeFirstLine(DataControllerReadme), () => (
		<DataControllerDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
	)))
	.add("Playground", withReadme(removeFirstLine(DataControllerReadme), () => (
		<DataControllerDefault
			title={text("title", "DataController")}
			visible={boolean("visible", true)}
			dataLabel={text("dataLabel", "★  A customizable UI widget ★")}
			defaultSelected={text("defaultSelected", "default")}
			componentStyle={object("componentStyle", { "padding-bottom": "10px" })}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Custom Filter Name")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));


storiesOf("DatePicker", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault showFilter={false} />
	)))
	.add("With title", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault title={text("title", "Date Picker")} showFilter={false} />
	)))
	.add("With placeholder", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault placeholder={text("placeholder", "Pick date")} showFilter={false} />
	)))
	.add("With filter", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "Date")} />
	)))
	.add("Without focus", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault showFilter={false} focused={boolean("focused", false)} />
	)))
	.add("Show more than 1 month", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			numberOfMonths={number("numberOfMonths", 2)}
			showFilter={false}
		/>
	)))
	.add("Default date", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			defaultSelected={moment().subtract(1, "day")}
			showFilter={false}
		/>
	)))
	.add("Enable days from today only", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			allowAllDates={boolean("allowAllDates", false)}
			showFilter={false}
		/>
	)))
	.add("Using extra prop object", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			extra={object("extra", {
				withFullScreenPortal: true,
				showClearDate: true
			})}
			showFilter={false}
		/>
	)))
	.add("With URLParams", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
	)))
	.add("Playground", withReadme(removeFirstLine(DatePickerReadme), () => (
		<DatePickerDefault
			title={text("title", "Date Picker")}
			placeholder={text("placeholder", "Pick date")}
			numberOfMonths={number("numberOfMonths", 1)}
			allowAllDates={boolean("allowAllDates", true)}
			extra={object("extra", {
				withFullScreenPortal: false,
				showClearDate: false
			})}
			queryFormat={select("queryFormat", {"epoch_millis":"epoch_millis","epoch_seconds":"epoch_seconds","date":"date","date_time":"date_time","date_time_no_millis":"date_time_no_millis","basic_date":"basic_date","basic_date_time":"basic_date_time","basic_date_time_no_millis":"basic_date_time_no_millis","basic_time":"basic_time","basic_time_no_millis":"basic_time_no_millis"}, "epoch_millis")}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Date")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
		/>
	)));

storiesOf("DateRange", module)
	.addDecorator(withKnobs)
	.add("Basic", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault />
	)))
	.add("With title", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault showFilter={false} title={text("title", "Date Range")} />
	)))
	.add("With filter", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault showFilter={boolean("showFilter", true)} filterLabel={text("filterLabel", "Date range")} />
	)))
	.add("Show more than 1 month", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			numberOfMonths={number("numberOfMonths", 3)}
			showFilter={false}
		/>
	)))
	.add("Default date", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			showFilter={false}
			defaultSelected={{
				start: moment().subtract(7, "days"),
				end: moment()
			}}
		/>
	)))
	.add("Enable days from today only", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			allowAllDates={boolean("allowAllDates", false)}
			showFilter={false}
		/>
	)))
	.add("Using extra prop object", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			showFilter={false}
			extra={object("extra", {
				withFullScreenPortal: true,
				showClearDate: true
			})}
		/>
	)))
	.add("With URLParams", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault showFilter={false} URLParams={boolean("URLParams (not visible on storybook)", true)} />
	)))
	.add("Playground", withReadme(removeFirstLine(DateRangeReadme), () => (
		<DateRangeDefault
			title={text("title", "Date Range")}
			numberOfMonths={number("numberOfMonths", 2)}
			allowAllDates={boolean("allowAllDates", true)}
			extra={object("extra", {
				withFullScreenPortal: true,
				showClearDate: true
			})}
			queryFormat={select("queryFormat", {"epoch_millis":"epoch_millis","epoch_seconds":"epoch_seconds","date":"date","date_time":"date_time","date_time_no_millis":"date_time_no_millis","basic_date":"basic_date","basic_date_time":"basic_date_time","basic_date_time_no_millis":"basic_date_time_no_millis","basic_time":"basic_time","basic_time_no_millis":"basic_time_no_millis"}, "epoch_millis")}
			showFilter={boolean("showFilter", true)}
			filterLabel={text("filterLabel", "Date range")}
			URLParams={boolean("URLParams (not visible on storybook)", false)}
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
	.add("With title", withReadme(removeFirstLine(ReactiveElementReadme, 3), () => (
		<ReactiveElement.Basic title={text("title", "ReactiveElement")} />
	)))
	.add("With placeholder", withReadme(removeFirstLine(ReactiveElementReadme, 3), () => (
		<ReactiveElement.Basic placeholder={text("placeholder", "Select city from the list")} />
	)))
	.add("Without result stats", withReadme(removeFirstLine(ReactiveElementReadme, 3), () => (
		<ReactiveElement.Basic showResultStats={boolean("showResultStats", false)} />
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
			initialLoader={text("initialLoader", "Loading results..")}
			noResults={text("noResults", "No results found! Try a different filter duh..")}
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
	.add("With Title", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault title={text("title", "People")} stream={false} />
	)))
	.add("With placeholder", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault onAllData={null} stream={false} placeholder={text("placeholder", "Select from list")} />
	)))
	.add("Without resultStats", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault onAllData={null} stream={false} showResultStats={boolean("showResultStats", false)} />
	)))
	.add("With Streaming Enabled", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault title="Meetups" stream={boolean("stream", true)} />
	)))
	.add("With pagination", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault
			pagination={boolean("pagination", true)}
			paginationAt={select("paginationAt", { bottom: "bottom", top: "top", both: "both" }, "bottom")}
			pages={number("pages", 5)}
			title="Meetups"
		/>
	)))
	.add("With custom sort order", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault onAllData={null} stream={false} sortBy={select("sortBy", { asc: "asc", desc: "desc", default: "default" }, "asc")} />
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
	.add("With custom messages", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault
			title="Meetups"
			stream={false}
			initialLoader={text("initialLoader", "Loading results..")}
			noResults={text("noResults", "No results found!")}
		/>
	)))
	.add("Playground", withReadme(removeFirstLine(ReactiveListReadme, 3), () => (
		<ReactiveListDefault
			title={text("title", "ReactiveList: Results")}
			placeholder={text("placeholder", "Select from list")}
			from={number("from", 0)}
			size={number("size", 5)}
			initialLoader={text("initialLoader", "Loading results..")}
			noResults={text("noResults", "No results found!")}
			showResultStats={boolean("showResultStats", true)}
			pagination={boolean("pagination", true)}
			paginationAt={select("paginationAt", { bottom: "bottom", top: "top", both: "both" }, "bottom")}
			pages={number("pages", 5)}
			stream={boolean("stream", false)}
			sortBy={select("sortBy", { asc: "asc", desc: "desc", default: "default" }, "default")}
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
	)));
