import { default as React, Component } from 'react';
import Select from 'react-select';
import { manager } from '../middleware/ChannelManager.js';
var helper = require('../middleware/helper.js');

export class DataSearch extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			items: [],
			currentValue: null,
			rawData: {
				hits: {
					hits: []
				}
			}
		};
		this.type = 'match_phrase';
		this.handleSearch = this.handleSearch.bind(this);
		this.setValue = this.setValue.bind(this);
		this.defaultSearchQuery = this.defaultSearchQuery.bind(this);
		this.previousSelectedSensor = {};
	}

	// Get the items from Appbase when component is mounted
	componentDidMount() {
		this.setQueryInfo();
		this.createChannel();
	}

	// set the query type and input data
	setQueryInfo() {
		let obj = {
				key: this.props.sensorId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField
				}
		};
		helper.selectedSensor.setSensorInfo(obj);
		let searchObj = {
				key: this.props.searchInputId,
				value: {
					queryType: 'multi_match',
					inputData: this.props.appbaseField
				}
		};
		helper.selectedSensor.setSensorInfo(searchObj);
	}

	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		let depends = this.props.depends ? this.props.depends : {};
		depends[this.props.searchInputId] = {
			operation: "must",
			defaultQuery: this.defaultSearchQuery
		};
		var channelObj = manager.create(this.context.appbaseConfig, depends);
		channelObj.emitter.addListener(channelObj.channelId, function(res) {
			let data = res.data;
			let rawData;
			if(res.mode === 'stream') {
				rawData = this.state.rawData;
				rawData.hits.hits.push(res.data);
			} else if(res.mode === 'historic') {
				rawData = data;
			}
			this.setState({
				rawData: rawData
			});
			this.setData(rawData);
		}.bind(this));
	}

	//default query
	defaultSearchQuery(value) {
		return {
			"match_phrase_prefix": {
				[this.props.appbaseField]: value
			}
		};
	}

	// set value to search
	setValue(value, callback) {
		var obj = {
			key: this.props.searchInputId,
			value: value
		};
		helper.selectedSensor.set(obj, true);
		this.callback = callback;
		if(!value) {
			this.callback(null, {
				options: []
			});
		}
	}

	// set data after get the result
	setData(data) {
		let options = [];
		let searchField = `hit._source.${this.props.appbaseField}`;
		// Check if this is Geo search or field tag search
		if (this.props.isGeoSearch) {
			// If it is Geo, we return the location field
			let latField = `hit._source.${this.props.latField}`;
			let lonField = `hit._source.${this.props.lonField}`;
			data.hits.hits.map(function (hit) {
				let location = {
					lat: eval(latField),
					lon: eval(lonField)
				};
				options.push({ value: location, label: eval(searchField) });
			});
		} else {
			data.hits.hits.map(function (hit) {
				options.push({ value: eval(searchField), label: eval(searchField) });
			});
		}
		options = this.removeDuplicates(options, "label");
		if(this.callback) {
			this.callback(null, {
				options: options
			});
		}
	}

	// Search results often contain duplicate results, so display only unique values
	removeDuplicates(myArr, prop) {
		return myArr.filter((obj, pos, arr) => {
			return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
		});
	}

	// When user has selected a search value
	handleSearch(currentValue) {
		let value = currentValue ? currentValue.value : null;
		value = value === 'null' ? null : value;
		var obj = {
				key: this.props.sensorId,
				value: value
		};
		helper.selectedSensor.set(obj, true);
		this.setState({
			currentValue: value
		});
	}

	render() {
		return (
			<div className="rbc rbc-datasearch">
				<Select.Async
					name="appbase-search"
					value={this.state.currentValue}
					loadOptions={this.setValue}
					onChange={this.handleSearch}
					{...this.props}
				/>
			</div>
		);
	}
}

DataSearch.propTypes = {
	sensorId: React.PropTypes.string.isRequired,
	sensorInputId: React.PropTypes.string,
	appbaseField : React.PropTypes.string,
	title: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	size: React.PropTypes.number,
};

// Default props value
DataSearch.defaultProps = {
	placeholder: "Search...",
	size: 10,
	executeDepends: true,
	sensorInputId: "searchLetter"
};

// context type
DataSearch.contextTypes = {
	appbaseConfig: React.PropTypes.any.isRequired
};
