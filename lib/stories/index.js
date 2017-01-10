'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybook = require('@kadira/storybook');

var _storybookAddonKnobs = require('@kadira/storybook-addon-knobs');

var _withReadme = require('storybook-readme/with-readme');

var _withReadme2 = _interopRequireDefault(_withReadme);

var _appbaseJs = require('appbase-js');

var _SingleList = require('./SingleList.stories');

var _SingleList2 = _interopRequireDefault(_SingleList);

var _SingleList3 = require('@appbaseio/reactivebase-manual/docs/v1/components/SingleList.md');

var _SingleList4 = _interopRequireDefault(_SingleList3);

var _MultiList = require('./MultiList.stories');

var _MultiList2 = _interopRequireDefault(_MultiList);

var _MultiList3 = require('@appbaseio/reactivebase-manual/docs/v1/components/MultiList.md');

var _MultiList4 = _interopRequireDefault(_MultiList3);

var _SingleRange = require('./SingleRange.stories');

var _SingleRange2 = _interopRequireDefault(_SingleRange);

var _SingleRange3 = require('@appbaseio/reactivebase-manual/docs/v1/components/SingleRange.md');

var _SingleRange4 = _interopRequireDefault(_SingleRange3);

var _MultiRange = require('./MultiRange.stories');

var _MultiRange2 = _interopRequireDefault(_MultiRange);

var _MultiRange3 = require('@appbaseio/reactivebase-manual/docs/v1/components/MultiRange.md');

var _MultiRange4 = _interopRequireDefault(_MultiRange3);

var _ToggleButton = require('./ToggleButton.stories');

var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

var _ToggleButton3 = require('@appbaseio/reactivebase-manual/docs/v1/components/ToggleButton.md');

var _ToggleButton4 = _interopRequireDefault(_ToggleButton3);

var _TextField = require('./TextField.stories');

var _TextField2 = _interopRequireDefault(_TextField);

var _TextField3 = require('@appbaseio/reactivebase-manual/docs/v1/components/TextField.md');

var _TextField4 = _interopRequireDefault(_TextField3);

var _DataSearch = require('./DataSearch.stories');

var _DataSearch2 = _interopRequireDefault(_DataSearch);

var _DataSearch3 = require('@appbaseio/reactivebase-manual/docs/v1/components/DataSearch.md');

var _DataSearch4 = _interopRequireDefault(_DataSearch3);

var _RangeSlider = require('./RangeSlider.stories');

var _RangeSlider2 = _interopRequireDefault(_RangeSlider);

var _RangeSlider3 = require('@appbaseio/reactivebase-manual/docs/v1/components/RangeSlider.md');

var _RangeSlider4 = _interopRequireDefault(_RangeSlider3);

var _SingleDropdownList = require('./SingleDropdownList.stories');

var _SingleDropdownList2 = _interopRequireDefault(_SingleDropdownList);

var _MultiDropdownList = require('./MultiDropdownList.stories');

var _MultiDropdownList2 = _interopRequireDefault(_MultiDropdownList);

var _SingleDropdownRange = require('./SingleDropdownRange.stories');

var _SingleDropdownRange2 = _interopRequireDefault(_SingleDropdownRange);

var _MultiDropdownRange = require('./MultiDropdownRange.stories');

var _MultiDropdownRange2 = _interopRequireDefault(_MultiDropdownRange);

var _PaginatedResultListDefault = require('./PaginatedResultListDefault.stories');

var _PaginatedResultListDefault2 = _interopRequireDefault(_PaginatedResultListDefault);

var _DatePicker = require('./DatePicker.stories');

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _DateRange = require('./DateRange.stories');

var _DateRange2 = _interopRequireDefault(_DateRange);

var _NestedList = require('./NestedList.stories');

var _NestedList2 = _interopRequireDefault(_NestedList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moment = require('moment');


require('../../node_modules/materialize-css/dist/css/materialize.min.css');
require('../../dist/css/vendor.min.css');
require('../../dist/css/style.min.css');

function removeFirstLine(str) {
	return str.substring(str.indexOf("\n") + 1);
}

(0, _storybook.storiesOf)('SingleList', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', (0, _withReadme2.default)(removeFirstLine(_SingleList4.default), function () {
	return _react2.default.createElement(_SingleList2.default, { showSearch: true });
})).add('Without Search', (0, _withReadme2.default)(removeFirstLine(_SingleList4.default), function () {
	return _react2.default.createElement(_SingleList2.default, { showSearch: false });
})).add('Default Selected', (0, _withReadme2.default)(removeFirstLine(_SingleList4.default), function () {
	return _react2.default.createElement(_SingleList2.default, { showSearch: true, defaultSelected: 'London' });
})).add('Custom Sort', (0, _withReadme2.default)(removeFirstLine(_SingleList4.default), function () {
	return _react2.default.createElement(_SingleList2.default, { showSearch: true, defaultSelected: 'London', sortBy: 'asc' });
})).add('Playground', (0, _withReadme2.default)(removeFirstLine(_SingleList4.default), function () {
	return _react2.default.createElement(_SingleList2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'My Cities'),
		showSearch: (0, _storybookAddonKnobs.boolean)('Show Search', true),
		defaultSelected: (0, _storybookAddonKnobs.text)('Default Selected', 'London')
	});
}));

(0, _storybook.storiesOf)('MultiList', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', (0, _withReadme2.default)(removeFirstLine(_MultiList4.default), function () {
	return _react2.default.createElement(_MultiList2.default, { showSearch: true });
})).add('Without Search', (0, _withReadme2.default)(removeFirstLine(_MultiList4.default), function () {
	return _react2.default.createElement(_MultiList2.default, { showSearch: false });
})).add('Default Selected', (0, _withReadme2.default)(removeFirstLine(_MultiList4.default), function () {
	return _react2.default.createElement(_MultiList2.default, { showSearch: true, defaultSelected: ["London", "Sydney"] });
})).add('Custom Sort', (0, _withReadme2.default)(removeFirstLine(_MultiList4.default), function () {
	return _react2.default.createElement(_MultiList2.default, { showSearch: true, defaultSelected: ["London"], sortBy: 'asc' });
})).add('Playground', (0, _withReadme2.default)(removeFirstLine(_MultiList4.default), function () {
	return _react2.default.createElement(_MultiList2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'My Cities'),
		showSearch: (0, _storybookAddonKnobs.boolean)('Show Search', true)
	});
}));

(0, _storybook.storiesOf)('SingleRange', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', (0, _withReadme2.default)(removeFirstLine(_SingleRange4.default), function () {
	return _react2.default.createElement(_SingleRange2.default, null);
})).add('With Default Selected', (0, _withReadme2.default)(removeFirstLine(_SingleRange4.default), function () {
	return _react2.default.createElement(_SingleRange2.default, { defaultSelected: 'Cheap' });
})).add('Playground', (0, _withReadme2.default)(removeFirstLine(_SingleRange4.default), function () {
	return _react2.default.createElement(_SingleRange2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'Price Range'),
		defaultSelected: (0, _storybookAddonKnobs.text)('Default Selected', 'Cheap')
	});
}));

(0, _storybook.storiesOf)('MultiRange', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', (0, _withReadme2.default)(removeFirstLine(_MultiRange4.default), function () {
	return _react2.default.createElement(_MultiRange2.default, null);
})).add('With Default Selected', (0, _withReadme2.default)(removeFirstLine(_MultiRange4.default), function () {
	return _react2.default.createElement(_MultiRange2.default, { defaultSelected: ['Cheap', 'Moderate'] });
})).add('Playground', (0, _withReadme2.default)(removeFirstLine(_MultiRange4.default), function () {
	return _react2.default.createElement(_MultiRange2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'Price Range')
	});
}));

(0, _storybook.storiesOf)('ToggleButton', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', (0, _withReadme2.default)(removeFirstLine(_ToggleButton4.default), function () {
	return _react2.default.createElement(_ToggleButton2.default, null);
})).add('With Default Selected', (0, _withReadme2.default)(removeFirstLine(_ToggleButton4.default), function () {
	return _react2.default.createElement(_ToggleButton2.default, { defaultSelected: ["Social"] });
})).add('Playground', (0, _withReadme2.default)(removeFirstLine(_ToggleButton4.default), function () {
	return _react2.default.createElement(_ToggleButton2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'Meetup Categories') });
}));

(0, _storybook.storiesOf)('TextField', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_TextField2.default, null);
})).add('With Title', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_TextField2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', "Car Search"),
		placeholder: (0, _storybookAddonKnobs.text)('Place Holder', "Type a car name") });
}));

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

(0, _storybook.storiesOf)('DataSearch', module).add('Basic', (0, _withReadme2.default)(removeFirstLine(_DataSearch4.default), function () {
	return _react2.default.createElement(_DataSearch2.default, null);
}));;

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

(0, _storybook.storiesOf)('RangeSlider', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', (0, _withReadme2.default)(removeFirstLine(_RangeSlider4.default), function () {
	return _react2.default.createElement(_RangeSlider2.default, null);
})).add('With Default Selected', (0, _withReadme2.default)(removeFirstLine(_RangeSlider4.default), function () {
	return _react2.default.createElement(_RangeSlider2.default, {
		defaultSelected: {
			"start": 0,
			"end": 2
		}
	});
}));

(0, _storybook.storiesOf)('PaginatedResultList', module).add('Basic', function () {
	return _react2.default.createElement(_PaginatedResultListDefault2.default, null);
});

(0, _storybook.storiesOf)('DatePicker', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DatePicker2.default, null);
})).add('Show more than 1 month', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DatePicker2.default, {
		numberOfMonths: 2
	});
})).add('Default date', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DatePicker2.default, {
		date: moment()
	});
})).add('Initial Focus', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DatePicker2.default, {
		focused: false
	});
})).add('Enable days from today only', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DatePicker2.default, {
		allowAllDates: false
	});
})).add('React-dates props', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DatePicker2.default, {
		extra: {
			'withFullScreenPortal': true,
			'showClearDate': true
		}
	});
})).add('Playground', function () {
	return _react2.default.createElement(_DatePicker2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'Date Picker'),
		numberOfMonths: (0, _storybookAddonKnobs.number)('Number of months', 1),
		focused: (0, _storybookAddonKnobs.boolean)('focused', true),
		allowAllDates: (0, _storybookAddonKnobs.boolean)('allowAllDates: Enable days from today only', true)
	});
});

(0, _storybook.storiesOf)('DateRange', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DateRange2.default, null);
})).add('Show more than 1 month', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DateRange2.default, {
		numberOfMonths: 3
	});
})).add('Default date', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DateRange2.default, {
		startDate: moment(),
		endDate: moment().add(5, 'days')
	});
})).add('Enable days from today only', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DateRange2.default, {
		allowAllDates: false
	});
})).add('React-dates props', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_DateRange2.default, {
		extra: {
			'withFullScreenPortal': true,
			'showClearDate': true
		}
	});
})).add('Playground', function () {
	return _react2.default.createElement(_DateRange2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'Date Range'),
		numberOfMonths: (0, _storybookAddonKnobs.number)('Number of months', 2),
		allowAllDates: (0, _storybookAddonKnobs.boolean)('allowAllDates: Enable days from today only', true)
	});
});

(0, _storybook.storiesOf)('NestedList', module).addDecorator(_storybookAddonKnobs.withKnobs).add('Basic', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_NestedList2.default, null);
})).add('With Title', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_NestedList2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', "Car Category") });
})).add('Default selection', (0, _withReadme2.default)(removeFirstLine(_TextField4.default), function () {
	return _react2.default.createElement(_NestedList2.default, {
		defaultSelected: ["bmw", "x series"] });
})).add('Playground', function () {
	return _react2.default.createElement(_NestedList2.default, {
		title: (0, _storybookAddonKnobs.text)('Title', 'Car Category'),
		defaultSelected: (0, _storybookAddonKnobs.array)('Default selection', ['bmw', 'x series'])
	});
});