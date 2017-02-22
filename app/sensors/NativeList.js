import { default as React, Component } from 'react';
import { ItemCheckboxList } from '../addons/ItemCheckboxList.js';
import { ItemList } from '../addons/ItemList.js';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
import { StaticSearch } from '../addons/StaticSearch.js';
import InitialLoader from '../addons/InitialLoader';
var helper = require('../middleware/helper.js');

export class NativeList extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			items: [],
			storedItems: [],
			rawData: {
				hits: {
					hits: []
				}
			},
			queryStart: false,
			defaultSelectAll: false
		};
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		this.previousSelectedSensor = {};
		this.channelId = null;
		this.channelListener = null;
		this.defaultSelected = this.props.defaultSelected;
		this.handleSelect = this.handleSelect.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.filterBySearch = this.filterBySearch.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.type = this.props.multipleSelect ? 'Terms' : 'Term';
		this.customQuery = this.customQuery.bind(this);
		this.defaultCustomQuery = this.defaultCustomQuery.bind(this);
	}

	// Get the items from Appbase when component is mounted
	componentDidMount() {
		this.setQueryInfo();
		this.handleSelect('');
		this.createChannel();
	}

	// build query for this sensor only
	// execute either user defined customQuery or component default query
	// customQuery will receive 2 arguments, selected sensor value and select all.
	customQuery(value) {
		let defaultQuery = this.props.customQuery ? this.props.customQuery : this.defaultCustomQuery;
		return defaultQuery(value, this.state.selectAll);
	}

	defaultCustomQuery(value, selectAll) {
		if(selectAll) {
			return {
				"exists": {
					'field': [this.props.appbaseField]
				}
			};
		}
		else if(value) {
			return {
				[this.type]: {
					[this.props.appbaseField]: value
				}
			};
		}
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (this.defaultSelected != this.props.defaultSelected) {
				this.defaultSelected = this.props.defaultSelected;
				let items = this.state.items;
				items = items.map((item) => {
					item.key = item.key.toString();
					item.status = (this.defaultSelected && this.defaultSelected.indexOf(item.key) > -1) || (this.selectedValue && this.selectedValue.indexOf(item.key) > -1)  ? true : false;
					return item;
				});
				this.setState({
					items: items,
					storedItems: items
				});
				setTimeout(this.handleSelect.bind(this, this.defaultSelected), 1000);
			}
			if (this.sortBy !== this.props.sortBy) {
				this.sortBy = this.props.sortBy;
				this.handleSortSelect();
			}
			if (this.size !== this.props.size) {
				this.size = this.props.size;
				this.removeChannel();
				this.createChannel();
			}
		}, 300);
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		this.removeChannel();
	}

	removeChannel() {
		if(this.channelId) {
			manager.stopStream(this.channelId);
		}
		if(this.channelListener) {
			this.channelListener.remove();
		}
		if(this.loadListener) {
			this.loadListener.remove();
		}
	}

	// set the query type and input data
	setQueryInfo() {
		var obj = {
				key: this.props.componentId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField,
					customQuery: this.customQuery
				}
		};
		helper.selectedSensor.setSensorInfo(obj);
	}

	includeAggQuery() {
		var obj = {
			key: this.props.componentId+'-sort',
			value: this.sortObj
		};
		helper.selectedSensor.setSortInfo(obj);
	}

	handleSortSelect() {
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		let obj = {
			key: this.props.componentId+'-sort',
			value: this.sortObj
		};
		helper.selectedSensor.set(obj, true, 'sortChange');
	}

	// Create a channel which passes the react and receive results whenever react changes
	createChannel() {
		// Set the react - add self aggs query as well with react
		let react = this.props.react ? this.props.react : {};
		react['aggs'] = {
			key: this.props.appbaseField,
			sort: this.props.sortBy,
			size: this.props.size,
			sortRef: this.props.componentId+'-sort'
		};
		if(react && react.and && typeof react.and === 'string') {
			react.and = [react.and];
		} else {
			react.and = react.and ? react.and : [];
		}
		react.and.push(this.props.componentId+'-sort');
		this.includeAggQuery();
		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, react);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(this.channelId, function(res) {
			if(res.error) {
				this.setState({
					queryStart: false
				});
			}
			if(res.appliedQuery) {
				let data = res.data;
				let rawData;
				if(res.mode === 'streaming') {
					rawData = this.state.rawData;
					rawData.hits.hits.push(res.data);
				} else if(res.mode === 'historic') {
					rawData = data;
				}
				this.setState({
					queryStart: false,
					rawData: rawData
				});
				this.setData(rawData);
			}
		}.bind(this));
		this.listenLoadingChannel(channelObj);
	}

	listenLoadingChannel(channelObj) {
		this.loadListener = channelObj.emitter.addListener(channelObj.channelId+'-query', function(res) {
			if(res.appliedQuery) {
				this.setState({
					queryStart: res.queryState
				});
			}
		}.bind(this));
	}

	setData(data) {
		if(data.aggregations && data.aggregations[this.props.appbaseField] && data.aggregations[this.props.appbaseField].buckets) {
			this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
		}
	}

	addItemsToList(newItems) {
		newItems = newItems.map((item) => {
			item.key = item.key.toString();
			item.status = (this.selectedValue && this.selectedValue.indexOf(item.key) > -1) ? true : false;
			return item
		});
		this.setState({
			items: newItems,
			storedItems: newItems
		});
	}

	// Handler function when a value is selected
	handleSelect(handleValue, selectAll=false) {
		if(this.state.selectAll && !selectAll) {
			this.setState({
				selectAll: false
			});
		}
		this.setValue(handleValue, true);
	}

	// Handler function when a value is deselected or removed
	handleRemove(value, isExecuteQuery=false) {
		this.setValue(value, isExecuteQuery);
	}

	// set value
	setValue(value, isExecuteQuery=false) {
		var obj = {
			key: this.props.componentId,
			value: value
		};
		this.selectedValue = value;
		if(this.props.multipleSelect) {
			let items = this.state.items.map((item) => {
				if(value && value.indexOf(item.key) > -1) {
					item.status = true;
				} else {
					item.status = false;
				}
				return item;
			});
			this.setState({items: items});
		}
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	// selectAll
	selectAll(value, selectedValue, cb) {
		let items = this.state.items.map((item) => {
			item.status = value;
			return item;
		});
		if(value) {
			this.selectedValue = selectedValue;
		}
		this.setState({
			items: items,
			storedItems: items,
			defaultSelectAll: value,
			selectAll: value
		}, cb);
	}

	// filter
	filterBySearch(value) {
		if(value) {
			let items = this.state.storedItems.map(function(item) {
				item.visible = item.key && item.key.toLowerCase().indexOf(value.toLowerCase()) > -1 ? true : false;
				return item;
			});
			this.setState({
				items: items
			});
		} else {
			let items = this.state.storedItems.map(function(item) {
				item.visible = true;
				return item;
			});
			this.setState({
				items: items
			});
		}
	}

	render() {
		// Checking if component is single select or multiple select
		let listComponent,
			searchComponent = null,
			title = null;

		if (this.props.multipleSelect) {
			listComponent = <ItemCheckboxList
				items={this.state.items}
				onSelect={this.handleSelect}
				onRemove={this.handleRemove}
				showCount={this.props.showCount}
				selectAll={this.selectAll}
				defaultSelected={this.props.defaultSelected}
				selectAllLabel={this.props.selectAllLabel}
				selectAllValue={this.state.selectAll} />
		}
		else {
			listComponent = <ItemList
				items={this.state.items}
				onSelect={this.handleSelect}
				onRemove={this.handleRemove}
				showCount={this.props.showCount}
				defaultSelected={this.props.defaultSelected}
				selectAllLabel={this.props.selectAllLabel}
				selectAll={this.selectAll} />
		}

		// set static search
		if(this.props.showSearch) {
			searchComponent = <StaticSearch
				placeholder={this.props.placeholder}
				changeCallback={this.filterBySearch}
			/>
		}

		if(this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		let cx = classNames({
			'rbc-search-active': this.props.showSearch,
			'rbc-search-inactive': !this.props.showSearch,
			'rbc-title-active': this.props.title,
			'rbc-title-inactive': !this.props.title,
			'rbc-placeholder-active': this.props.placeholder,
			'rbc-placeholder-inactive': !this.props.placeholder,
			'rbc-singlelist': !this.props.multipleSelect,
			'rbc-multilist': this.props.multipleSelect
		});

		return (
			<div className={`rbc col s12 col-xs-12 card thumbnail ${cx}`}>
				{title}
				{searchComponent}
				<div className="col s12 col-xs-12 nativelist-container">
					{listComponent}
				</div>
				{this.props.initialLoader.show ? (<InitialLoader defaultText={this.props.initialLoader.text} queryState={this.state.queryStart}></InitialLoader>) : null}
			</div>
		);
	}
}

NativeList.propTypes = {
	appbaseField: React.PropTypes.string.isRequired,
	size: helper.sizeValidation,
	showCount: React.PropTypes.bool,
	multipleSelect: React.PropTypes.bool,
	sortBy: React.PropTypes.oneOf(['asc', 'desc', 'count']),
	selectAllLabel: React.PropTypes.string,
	customQuery: React.PropTypes.func,
	initialLoader: React.PropTypes.shape({
		show: React.PropTypes.bool,
		text: React.PropTypes.string
	})
};

// Default props value
NativeList.defaultProps = {
	showCount: true,
	multipleSelect: true,
	sortBy: 'count',
	size: 100,
	showSearch: false,
	title: null,
	placeholder: 'Search',
	selectAllLabel: null,
	initialLoader: {
		show: true
	}
};

// context type
NativeList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
