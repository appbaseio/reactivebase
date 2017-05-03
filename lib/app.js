global.process = { env: {} };

// sensors
import SingleList from "./sensors/SingleList";
import MultiList from "./sensors/MultiList";
import SingleDropdownList from "./sensors/SingleDropdownList";
import MultiDropdownList from "./sensors/MultiDropdownList";
import RangeSlider from "./sensors/RangeSlider";
import TextField from "./sensors/TextField";
import DataSearch from "./sensors/DataSearch";
import SingleRange from "./sensors/SingleRange";
import MultiRange from "./sensors/MultiRange";
import SingleDropdownRange from "./sensors/SingleDropdownRange";
import MultiDropdownRange from "./sensors/MultiDropdownRange";
import ToggleButton from "./sensors/ToggleButton";
import DatePicker from "./sensors/DatePicker";
import DateRange from "./sensors/DateRange";
import NumberBox from "./sensors/NumberBox";
import ReactiveList from "./actuators/ReactiveList";
import ReactiveElement from "./actuators/ReactiveElement";
import PoweredBy from "./sensors/PoweredBy";
import DataController from "./sensors/DataController";

// addons
import InitialLoader from "./addons/InitialLoader";
import NoResults from "./addons/NoResults";
import ResultStats from "./addons/ResultStats";

// middleware
import ReactiveBase from "./middleware/ReactiveBase";
import manager from "./middleware/ChannelManager";
import * as TYPES from "./middleware/constants";

var helper = require("./middleware/helper");

module.exports = {
	SingleList: SingleList,
	MultiList: MultiList,
	SingleDropdownList: SingleDropdownList,
	MultiDropdownList: MultiDropdownList,
	RangeSlider: RangeSlider,
	TextField: TextField,
	DataSearch: DataSearch,
	SingleRange: SingleRange,
	MultiRange: MultiRange,
	SingleDropdownRange: SingleDropdownRange,
	MultiDropdownRange: MultiDropdownRange,
	ToggleButton: ToggleButton,
	DatePicker: DatePicker,
	DateRange: DateRange,
	NumberBox: NumberBox,
	ReactiveBase: ReactiveBase,
	ReactiveList: ReactiveList,
	ReactiveElement: ReactiveElement,
	AppbaseChannelManager: manager,
	AppbaseSensorHelper: helper,
	PoweredBy: PoweredBy,
	DataController: DataController,
	TYPES: TYPES,
	InitialLoader: InitialLoader,
	NoResults: NoResults,
	ResultStats: ResultStats
};