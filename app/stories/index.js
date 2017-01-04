import React from 'react';
var moment = require('moment');
import { storiesOf, addDecorator } from '@kadira/storybook';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';
import withReadme from 'storybook-readme/with-readme';

import { Appbase } from 'appbase-js';

import SingleListDefault from './SingleList.stories';
import SingleListReadme from '@appbaseio/reactivebase-manual/docs/v1/components/SingleList.md';

import MultiListDefault from './MultiList.stories';
import MultiListReadme from '@appbaseio/reactivebase-manual/docs/v1/components/MultiList.md';

import SingleRangeDefault from './SingleRange.stories';
import SingleRangeReadme from '@appbaseio/reactivebase-manual/docs/v1/components/SingleRange.md';

import MultiRangeDefault from './MultiRange.stories';
import MultiRangeReadme from '@appbaseio/reactivebase-manual/docs/v1/components/MultiRange.md';

import ToggleButtonDefault from './ToggleButton.stories';
import ToggleButtonReadme from '@appbaseio/reactivebase-manual/docs/v1/components/ToggleButton.md';

import TextFieldDefault from './TextField.stories';
import TextFieldReadme from '@appbaseio/reactivebase-manual/docs/v1/components/TextField.md';

import DataSearchDefault from './DataSearch.stories';
import DataSearchReadme from '@appbaseio/reactivebase-manual/docs/v1/components/DataSearch.md';

import RangeSliderDefault from './RangeSlider.stories';
import RangeSliderReadme from '@appbaseio/reactivebase-manual/docs/v1/components/RangeSlider.md';

import SingleDropdownListDefault from './SingleDropdownList.stories';
import MultiDropdownListDefault from './MultiDropdownList.stories';
import SingleDropdownRangeDefault from './SingleDropdownRange.stories';
import MultiDropdownRangeDefault from './MultiDropdownRange.stories';
import PaginatedResultListDefault from './PaginatedResultListDefault.stories';
import DatePickerDefault from './DatePicker.stories';
import DateRangeDefault from './DateRange.stories';

require ('../../node_modules/materialize-css/dist/css/materialize.min.css');
require ('../../dist/css/vendor.min.css');
require ('../../dist/css/style.min.css');

function removeFirstLine(str) {
	return str.substring(str.indexOf("\n") + 1);
}

storiesOf('SingleList', module)
	.addDecorator(withKnobs)
	.add('Basic', withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch={true} />
	)))
	.add('Without Search', withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch={false} />
	)))
	.add('Default Selected', withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch={true} defaultSelected='London' />
	)))
	.add('Custom Sort', withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault showSearch={true} defaultSelected='London' sortBy='asc' />
	)))
	.add('Playground', withReadme(removeFirstLine(SingleListReadme), () => (
		<SingleListDefault
			title={text('Title', 'My Cities')}
			showSearch={boolean('Show Search', true)}
			defaultSelected={text('Default Selected', 'London')}
		/>
	)));

storiesOf('MultiList', module)
	.addDecorator(withKnobs)
	.add('Basic', withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch={true} />
	)))
	.add('Without Search', withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch={false} />
	)))
	.add('Default Selected', withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch={true} defaultSelected={["London", "Sydney"]} />
	)))
	.add('Custom Sort', withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault showSearch={true} defaultSelected={["London"]} sortBy='asc' />
	)))
	.add('Playground', withReadme(removeFirstLine(MultiListReadme), () => (
		<MultiListDefault
			title={text('Title', 'My Cities')}
			showSearch={boolean('Show Search', true)}
		/>
	)));

storiesOf('SingleRange', module)
	.addDecorator(withKnobs)
	.add('Basic', withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault />
	)))
	.add('With Default Selected', withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault defaultSelected='Cheap' />
	)))
	.add('Playground', withReadme(removeFirstLine(SingleRangeReadme), () => (
		<SingleRangeDefault
			title={text('Title', 'Price Range')}
			defaultSelected={text('Default Selected', 'Cheap')}
		/>
	)));

storiesOf('MultiRange', module)
	.addDecorator(withKnobs)
	.add('Basic', withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault />
	)))
	.add('With Default Selected', withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault defaultSelected={['Cheap', 'Moderate']} />
	)))
	.add('Playground', withReadme(removeFirstLine(MultiRangeReadme), () => (
		<MultiRangeDefault
			title={text('Title', 'Price Range')}
		/>
	)));

storiesOf('ToggleButton', module)
	.addDecorator(withKnobs)
	.add('Basic', withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault />
	)))
	.add('With Default Selected', withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault defaultSelected={["Social"]} />
	)))
	.add('Playground', withReadme(removeFirstLine(ToggleButtonReadme), () => (
		<ToggleButtonDefault
			title={text('Title', 'Meetup Categories')} />
	)));

storiesOf('TextField', module)
	.addDecorator(withKnobs)
	.add('Basic', withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault />
	)))
	.add('With Title', withReadme(removeFirstLine(TextFieldReadme), () => (
		<TextFieldDefault
			title={text('Title', "Car Search")}
			placeholder={text('Place Holder', "Type a car name")} />
	)));

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
	.add('Basic', withReadme(removeFirstLine(DataSearchReadme), () => (
		<DataSearchDefault />
	)));;

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
	.add('Basic', withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault />
	)))
	.add('With Default Selected', withReadme(removeFirstLine(RangeSliderReadme), () => (
		<RangeSliderDefault
			defaultSelected={
				{
				  "start": 0,
				  "end": 2
				}
			}
		/>
	)));

storiesOf('PaginatedResultList', module)
	.add('Basic', () => (
		<PaginatedResultListDefault />
	));

storiesOf('DatePicker', module)
	.addDecorator(withKnobs)
	.add('Basic', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DatePickerDefault />
	)))
	.add('Show more than 1 month', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DatePickerDefault
			numberOfMonths={2}
		/>
	)))
	.add('Default date', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DatePickerDefault
			date={moment()}
		/>
	)))
	.add('Initial Focus', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DatePickerDefault
			focused={false}
		/>
	)))
	.add('Enable days from today only', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DatePickerDefault
			allowAllDates={false}
		/>
	)))
	.add('React-dates props', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DatePickerDefault
			extra = {{
				'withFullScreenPortal': true,
				'showClearDate': true
			}}
		/>
	)))
	.add('Playground', () => (
		<DatePickerDefault
			title={text('Title', 'Date Picker')}
			numberOfMonths={number('Number of months', 1)}
			focused={boolean('focused', true)}
			allowAllDates={boolean('allowAllDates: Enable days from today only', true)}
		/>
	));

storiesOf('DateRange', module)
	.addDecorator(withKnobs)
	.add('Basic', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DateRangeDefault />
	)))
	.add('Show more than 1 month', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DateRangeDefault
			numberOfMonths={3}
		/>
	)))
	.add('Default date', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DateRangeDefault
			startDate={moment()}
			endDate={moment().add(5, 'days')}
		/>
	)))
	.add('Enable days from today only', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DateRangeDefault
			allowAllDates={false}
		/>
	)))
	.add('React-dates props', withReadme(removeFirstLine(TextFieldReadme), () => (
		<DateRangeDefault
			extra = {{
				'withFullScreenPortal': true,
				'showClearDate': true
			}}
		/>
	)))
	.add('Playground', () => (
		<DateRangeDefault
			title={text('Title', 'Date Range')}
			numberOfMonths={number('Number of months', 2)}
			allowAllDates={boolean('allowAllDates: Enable days from today only', true)}
		/>
	));