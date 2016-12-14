import React from 'react';
import { storiesOf, addDecorator } from '@kadira/storybook';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';

import { Appbase } from 'appbase-js';
import SingleListDefault from './SingleList.stories';

require ('../../dist/css/bootstrap.min.css');
require ('../../dist/css/materialize.min.css');
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
