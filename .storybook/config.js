import { configure } from '@kadira/storybook';
import { setOptions } from '@kadira/storybook-addon-options';

setOptions({
	name: 'reactivebase',
	url: 'https://github.com/appbaseio/reactivebase',
	goFullScreen: false,
	showLeftPanel: true,
	showDownPanel: true,
	showSearchBox: false,
	downPanelInRight: false,
});

function loadStories() {
	require('../app/stories');
}

configure(loadStories, module);
