import React from 'react';
import { storiesOf, addDecorator } from '@kadira/storybook';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';

import { Appbase } from 'appbase-js';
import SingleListDefault from './SingleList.stories';
import MultiListDefault from './MultiList.stories';
import SingleRangeDefault from './SingleRange.stories';
import MultiRangeDefault from './MultiRange.stories';
import ToggleButtonDefault from './ToggleButton.stories';
import TextFieldDefault from './TextField.stories';
import SingleDropdownListDefault from './SingleDropdownList.stories';
import MultiDropdownListDefault from './MultiDropdownList.stories';
import DataSearchDefault from './DataSearch.stories';
import SingleDropdownRangeDefault from './SingleDropdownRange.stories';
import MultiDropdownRangeDefault from './MultiDropdownRange.stories';
import RangeSliderDefault from './RangeSlider.stories';
import PaginationDefault from './Pagination.stories';

require ('../../node_modules/materialize-css/dist/css/materialize.min.css');
require ('../../dist/css/vendor.min.css');
require ('../../dist/css/style.min.css');

storiesOf('SingleList', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<SingleListDefault showSearch={true} />
	))
	.add('Without Search', () => (
		<SingleListDefault showSearch={false} />
	))
	.add('Default Selected', () => (
		<SingleListDefault showSearch={true} defaultSelected='London' />
	))
	.add('Custom Sort', () => (
		<SingleListDefault showSearch={true} defaultSelected='London' sortBy='asc' />
	))
	.add('Playground', () => (
		<SingleListDefault
			title={text('Title', 'My Cities')}
			showSearch={boolean('Show Search', true)}
			defaultSelected={text('Default Selected', 'London')}
		/>
	));

storiesOf('MultiList', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<MultiListDefault showSearch={true} />
	))
	.add('Without Search', () => (
		<MultiListDefault showSearch={false} />
	))
	.add('Default Selected', () => (
		<MultiListDefault showSearch={true} defaultSelected={["London", "Sydney"]} />
	))
	.add('Custom Sort', () => (
		<MultiListDefault showSearch={true} defaultSelected={["London"]} sortBy='asc' />
	))
	.add('Playground', () => (
		<MultiListDefault
			title={text('Title', 'My Cities')}
			showSearch={boolean('Show Search', true)}
		/>
	));

storiesOf('SingleRange', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<SingleRangeDefault />
	))
	.add('With Default Selected', () => (
		<SingleRangeDefault defaultSelected='Cheap' />
	))
	.add('Playground', () => (
		<SingleRangeDefault
			title={text('Title', 'Price Range')}
			defaultSelected={text('Default Selected', 'Cheap')}
		/>
	));

storiesOf('MultiRange', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<MultiRangeDefault />
	))
	.add('With Default Selected', () => (
		<MultiRangeDefault defaultSelected={['Cheap', 'Moderate']} />
	))
	.add('Playground', () => (
		<MultiRangeDefault
			title={text('Title', 'Price Range')}
		/>
	));

storiesOf('ToggleButton', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<ToggleButtonDefault />
	))
	.add('With Default Selected', () => (
		<ToggleButtonDefault defaultSelected={["Social"]} />
	))
	.add('Playground', () => (
		<ToggleButtonDefault 
			title={text('Title', 'Meetup Categories')}
			defaultSelected={text('Default Selected', ["Social"])} />
	));

storiesOf('TextField', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<TextFieldDefault />
	))
	.add('With Title', () => (
		<TextFieldDefault
			title={text('Title', "Car Search")}
			placeholder={text('Place Holder', "Type a car name")} />
	));

storiesOf('SingleDropdownList', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<SingleDropdownListDefault />
	))
	.add('With Select All', () => (
		<SingleDropdownListDefault
			selectAllLabel='All Cities'
		/>
	))
	.add('Playground', () => (
		<SingleDropdownListDefault
			selectAllLabel={text('Label for Select All', 'All Cities')}
		/>
	));

storiesOf('MultiDropdownList', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<MultiDropdownListDefault />
	))
	.add('With Placeholder', () => (
		<MultiDropdownListDefault
			placeholder='Select Cities'
		/>
	))
	.add('Playground', () => (
		<MultiDropdownListDefault
			placeholder={text('Place Holder', 'Select Cities')}
		/>
	));

storiesOf('DataSearch', module)
	.add('Basic', () => (
		<DataSearchDefault />
	));;

storiesOf('SingleDropdownRange', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<SingleDropdownRangeDefault />
	))
	.add('With Default Selected', () => (
		<SingleDropdownRangeDefault defaultSelected='Cheap' />
	))
	.add('Playground', () => (
		<SingleDropdownRangeDefault
			title={text('Title', 'Price Range')}
			defaultSelected={text('Default Selected', 'Cheap')}
		/>
	));

storiesOf('MultiDropdownRange', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<MultiDropdownRangeDefault />
	))
	.add('With Default Selected', () => (
		<MultiDropdownRangeDefault defaultSelected={['Cheap', 'Moderate']} />
	))
	.add('Playground', () => (
		<MultiDropdownRangeDefault
			title={text('Title', 'Price Range')}
		/>
	));

storiesOf('RangeSlider', module)
	.addDecorator(withKnobs)
	.add('Basic', () => (
		<RangeSliderDefault />
	))
	.add('With Default Selected', () => (
		<RangeSliderDefault
			defaultSelected={
				{
				  "start": 0,
				  "end": 2
				}
			}
		/>
	));

storiesOf('Pagination', module)
	.add('Basic', () => (
		<PaginationDefault />
	))
