// sensors
import {SingleList} from './sensors/SingleList';
import {MultiList} from './sensors/MultiList';
import {RangeSlider} from './sensors/RangeSlider';
import {TextField} from './sensors/TextField';
import {DataSearch} from './sensors/DataSearch';
import {SingleRange} from './sensors/SingleRange';
import {AppbaseList} from './sensors/AppbaseList';
import {AppbaseSlider} from './sensors/AppbaseSlider';
import {AppbaseSearch} from './sensors/AppbaseSearch';
import {AppbaseDistanceSensor} from './sensors/AppbaseDistanceSensor';
import {AppbaseInputField} from './sensors/AppbaseInputField';
import {AppbaseButtonGroup} from './sensors/AppbaseButtonGroup';
import {AppbaseGoogleSearch} from './sensors/AppbaseGoogleSearch';
import {MultiRange} from './sensors/MultiRange';
import {ToggleButton} from './sensors/ToggleButton';
// middleware
import {AppbaseReactiveMap} from './middleware/AppbaseReactiveMap';
import {manager} from './middleware/ChannelManager';
var helper = require('./middleware/helper.js');

module.exports = {
	AppbaseReactiveMap: AppbaseReactiveMap,
	SingleList: SingleList,
	MultiList: MultiList,
	RangeSlider: RangeSlider,
	TextField: TextField,
	DataSearch: DataSearch,
	SingleRange: SingleRange,
	MultiRange: MultiRange,
	ToggleButton: ToggleButton,
	AppbaseList: AppbaseList,
	AppbaseSlider: AppbaseSlider,
	AppbaseSearch: AppbaseSearch,
	AppbaseDistanceSensor: AppbaseDistanceSensor,
	AppbaseInputField: AppbaseInputField,
	AppbaseButtonGroup: AppbaseButtonGroup,
	AppbaseGoogleSearch: AppbaseGoogleSearch,
	AppbaseChannelManager: manager,
	AppbaseSensorHelper: helper
};
