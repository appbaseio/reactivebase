import { configure } from "@storybook/react";
import { setOptions } from "@storybook/addon-options";

setOptions({
	name: "reactivebase",
	url: "https://github.com/appbaseio/reactivebase",
	goFullScreen: false,
	showLeftPanel: true,
	showDownPanel: true,
	showSearchBox: false,
	downPanelInRight: false,
});

function loadStories() {
	require("../app/stories");
}

configure(loadStories, module);
