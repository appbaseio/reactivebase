'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybook = require('@kadira/storybook');

var _storybookAddonKnobs = require('@kadira/storybook-addon-knobs');

var _appbaseJs = require('appbase-js');

var _SingleList = require('./SingleList.stories');

var _SingleList2 = _interopRequireDefault(_SingleList);

var _MultiList = require('./MultiList.stories');

var _MultiList2 = _interopRequireDefault(_MultiList);

var _SingleRange = require('./SingleRange.stories');

var _SingleRange2 = _interopRequireDefault(_SingleRange);

var _MultiRange = require('./MultiRange.stories');

var _MultiRange2 = _interopRequireDefault(_MultiRange);

var _ToggleButton = require('./ToggleButton.stories');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _TextField = require('./TextField.stories');

var _TextField2 = _interopRequireDefault(_TextField);

var _SingleDropdownList = require('./SingleDropdownList.stories');

var _SingleDropdownList2 = _interopRequireDefault(_SingleDropdownList);

var _MultiDropdownList = require('./MultiDropdownList.stories');

var _MultiDropdownList2 = _interopRequireDefault(_MultiDropdownList);

var _DataSearch = require('./DataSearch.stories');

var _DataSearch2 = _interopRequireDefault(_DataSearch);

var _SingleDropdownRange = require('./SingleDropdownRange.stories');

var _SingleDropdownRange2 = _interopRequireDefault(_SingleDropdownRange);

var _MultiDropdownRange = require('./MultiDropdownRange.stories');

var _MultiDropdownRange2 = _interopRequireDefault(_MultiDropdownRange);

var _RangeSlider = require('./RangeSlider.stories');

var _RangeSlider2 = _interopRequireDefault(_RangeSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('../../node_modules/materialize-css/dist/css/materialize.min.css');
require('../../dist/css/vendor.min.css');
require('../../dist/css/style.min.css');

(0, _storybook.storiesOf)('SingleList', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', function () {
	return _react2.default.createElement(_SingleList2.default, { showSearch: true });
}).add('Without Search', function () {
	return _react2.default.createElement(_SingleList2.default, { showSearch: false });
}).add('Default Selected', function () {
	return _react2.default.createElement(_SingleList2.default, { showSearch: true, defaultSelected: 'London' });
}).add('Custom Sort', function () {
	return _react2.default.createElement(_SingleList2.default, { showSearch: true, defaultSelected: 'London', sortBy: 'asc' });
}).add('Playground', function () {
	return _react2.default.createElement(_SingleList2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'My Cities'),
		showSearch: (0, _storybookAddonKnobs.boolean)('Show Search', true),
		defaultSelected: (0, _storybookAddonKnobs.text)('Default Selected', 'London')
	});
});

(0, _storybook.storiesOf)('MultiList', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', function () {
	return _react2.default.createElement(_MultiList2.default, { showSearch: true });
}).add('Without Search', function () {
	return _react2.default.createElement(_MultiList2.default, { showSearch: false });
}).add('Default Selected', function () {
	return _react2.default.createElement(_MultiList2.default, { showSearch: true, defaultSelected: ["London", "Sydney"] });
}).add('Custom Sort', function () {
	return _react2.default.createElement(_MultiList2.default, { showSearch: true, defaultSelected: ["London"], sortBy: 'asc' });
}).add('Playground', function () {
	return _react2.default.createElement(_MultiList2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'My Cities'),
		showSearch: (0, _storybookAddonKnobs.boolean)('Show Search', true)
	});
});

(0, _storybook.storiesOf)('SingleRange', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', function () {
	return _react2.default.createElement(_SingleRange2.default, null);
}).add('With Default Selected', function () {
	return _react2.default.createElement(_SingleRange2.default, { defaultSelected: 'Cheap' });
}).add('Playground', function () {
	return _react2.default.createElement(_SingleRange2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'Price Range'),
		defaultSelected: (0, _storybookAddonKnobs.text)('Default Selected', 'Cheap')
	});
});

(0, _storybook.storiesOf)('MultiRange', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', function () {
	return _react2.default.createElement(_MultiRange2.default, null);
}).add('With Default Selected', function () {
	return _react2.default.createElement(_MultiRange2.default, { defaultSelected: ['Cheap', 'Moderate'] });
}).add('Playground', function () {
	return _react2.default.createElement(_MultiRange2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'Price Range')
	});
});

(0, _storybook.storiesOf)('ToggleButton', module).add('Basic', function () {
	return _react2.default.createElement(_ToggleButton2.default, null);
}).add('With Default Selected', function () {
	return _react2.default.createElement(_ToggleButton2.default, { defaultSelected: ["Social"] });
});

(0, _storybook.storiesOf)('TextField', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', function () {
	return _react2.default.createElement(_TextField2.default, null);
}).add('With Title', function () {
	return _react2.default.createElement(_TextField2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', "Car Search"),
		placeholder: (0, _storybookAddonKnobs.text)('Place Holder', "Type a car name") });
});

(0, _storybook.storiesOf)('SingleDropdownList', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', function () {
	return _react2.default.createElement(_SingleDropdownList2.default, null);
}).add('With Select All', function () {
	return _react2.default.createElement(_SingleDropdownList2.default, {
		selectAllLabel: 'All Cities'
	});
}).add('Playground', function () {
	return _react2.default.createElement(_SingleDropdownList2.default, {
		selectAllLabel: (0, _storybookAddonKnobs.text)('Label for Select All', 'All Cities')
	});
});

(0, _storybook.storiesOf)('MultiDropdownList', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', function () {
	return _react2.default.createElement(_MultiDropdownList2.default, null);
}).add('With Placeholder', function () {
	return _react2.default.createElement(_MultiDropdownList2.default, {
		placeholder: 'Select Cities'
	});
}).add('Playground', function () {
	return _react2.default.createElement(_MultiDropdownList2.default, {
		placeholder: (0, _storybookAddonKnobs.text)('Place Holder', 'Select Cities')
	});
});

(0, _storybook.storiesOf)('DataSearch', module).add('Basic', function () {
	return _react2.default.createElement(_DataSearch2.default, null);
});;

(0, _storybook.storiesOf)('SingleDropdownRange', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', function () {
	return _react2.default.createElement(_SingleDropdownRange2.default, null);
}).add('With Default Selected', function () {
	return _react2.default.createElement(_SingleDropdownRange2.default, { defaultSelected: 'Cheap' });
}).add('Playground', function () {
	return _react2.default.createElement(_SingleDropdownRange2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'Price Range'),
		defaultSelected: (0, _storybookAddonKnobs.text)('Default Selected', 'Cheap')
	});
});

(0, _storybook.storiesOf)('MultiDropdownRange', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', function () {
	return _react2.default.createElement(_MultiDropdownRange2.default, null);
}).add('With Default Selected', function () {
	return _react2.default.createElement(_MultiDropdownRange2.default, { defaultSelected: ['Cheap', 'Moderate'] });
}).add('Playground', function () {
	return _react2.default.createElement(_MultiDropdownRange2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'Price Range')
	});
});

(0, _storybook.storiesOf)('RangeSlider', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', function () {
	return _react2.default.createElement(_RangeSlider2.default, null);
}).add('With Default Selected', function () {
	return _react2.default.createElement(_RangeSlider2.default, {
		defaultSelected: {
			"start": 0,
			"end": 2
		}
	});
});