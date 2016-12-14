import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import SingleListDemo from './SingleListDemo';
import { Appbase } from 'appbase-js';

require ('../../dist/css/bootstrap.min.css');
require ('../../dist/css/materialize.min.css');
require ('../../dist/css/style.min.css');

storiesOf('SingleList', module)
	.add('Basic', () => (
		<SingleListDemo />
	));
