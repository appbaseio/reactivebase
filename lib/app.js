'use strict';

var _AppbaseList = require('./sensors/AppbaseList');

var _AppbaseSlider = require('./sensors/AppbaseSlider');

var _AppbaseSearch = require('./sensors/AppbaseSearch');

var _AppbaseDistanceSensor = require('./sensors/AppbaseDistanceSensor');

var _AppbaseInputField = require('./sensors/AppbaseInputField');

var _AppbaseButtonGroup = require('./sensors/AppbaseButtonGroup');

var _AppbaseGoogleSearch = require('./sensors/AppbaseGoogleSearch');

var _AppbaseReactiveMap = require('./middleware/AppbaseReactiveMap');

var _ChannelManager = require('./middleware/ChannelManager');

// middleware
var helper = require('./middleware/helper.js'); // sensors


module.exports = {
	AppbaseReactiveMap: _AppbaseReactiveMap.AppbaseReactiveMap,
	AppbaseList: _AppbaseList.AppbaseList,
	AppbaseSlider: _AppbaseSlider.AppbaseSlider,
	AppbaseSearch: _AppbaseSearch.AppbaseSearch,
	AppbaseDistanceSensor: _AppbaseDistanceSensor.AppbaseDistanceSensor,
	AppbaseInputField: _AppbaseInputField.AppbaseInputField,
	AppbaseButtonGroup: _AppbaseButtonGroup.AppbaseButtonGroup,
	AppbaseGoogleSearch: _AppbaseGoogleSearch.AppbaseGoogleSearch,
	AppbaseChannelManager: _ChannelManager.manager,
	AppbaseSensorHelper: helper
};