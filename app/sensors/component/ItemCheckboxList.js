import { default as React, Component } from 'react';
import classNames from 'classnames';

export class ItemCheckboxList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItems: [],
		};
		this.handleListClick = this.handleListClick.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
		this.handleListClickAll = this.handleListClickAll.bind(this);
		this.clearAll = this.clearAll.bind(this);
	}

	componentDidMount() {
		if(this.props.defaultSelected) {
			this.setState({
				selectedItems: this.props.defaultSelected,
				defaultSelectall: this.props.defaultSelectall
			}, function() {
				this.updateAction.bind(this);
				this.props.onSelect(this.state.selectedItems);
			}.bind(this));
		}
	}

	// remove selected types if not in the list
	componentDidUpdate() {
		var updated = null;
		if(this.state.selectedItems) {
			updated = JSON.parse(JSON.stringify(this.state.selectedItems));
		}
		if(updated && updated.length && this.props.items && this.props.items.length) {
			updated = updated.filter((item)=> {
				let updatedFound = this.props.items.filter((propItem) => {
					return propItem.key === item;
				});
				return updatedFound.length ? true : false;
			});
			if(updated.length !== this.state.selectedItems.length) {
				var isExecutable = updated.length ? false : true;
				this.props.onRemove(this.state.selectedItems, isExecutable);
				this.setState({
					'selectedItems': updated
				});
				if(updated.length) {
					this.props.onSelect(updated);
				}
			}
		}
	}

	updateAction() {
		if(!this.state.selectedItems.length) {
			this.props.onSelect(null);
		}
	}

	// handler function for select all
	handleListClickAll(value, selectedStatus) {
		this.props.selectAll(selectedStatus);
		let selectedItems = this.props.items.map((item) => item.key );
		selectedItems = selectedStatus ? selectedItems : [];
		this.setState({
			defaultSelectall: selectedStatus,
			selectedItems: selectedItems
		}, function() {
			this.updateAction.bind(this);
			this.props.onSelect(this.state.selectedItems, selectedItems);
		}.bind(this));
	}

	// Handler function when a checkbox is clicked
	handleListClick(value, selectedStatus) {
		// If the checkbox selectedStatus is true, then update selectedItems array
		if (selectedStatus) {
			this.props.onRemove(this.state.selectedItems, false);
			var updated = this.state.selectedItems;
			updated.push(value);
			this.setState({
				selectedItems: updated
			}, this.updateAction.bind(this));
			// Pass the props to parent components to add to the Query
			if(this.state.selectedItems.length) {
				this.props.onSelect(this.state.selectedItems);
			}
		}
		// If the checkbox selectedStatus is false
		// Call handleTagClick to remove it from the selected Items
		else {
			this.handleTagClick(value);
		}
	}

	// Handler function when a cancel button on tag is clicked to remove it
	handleTagClick(value) {
		// Pass the older value props to parent components to remove older list in terms query
		var isExecutable = this.state.selectedItems.length === 1 ? true:false;
		this.props.onRemove(this.state.selectedItems, isExecutable);
		var keyRef = value.toString().replace(/ /g,'_');
		let ref = 'ref'+keyRef;
		var checkboxElement =this.refs[ref];
		checkboxElement.state.status = false;
		var updated = this.state.selectedItems;
		let index = updated.indexOf(value);
		updated.splice(index, 1);
		this.setState({
			selectedItems: updated
		}, this.updateAction.bind(this));
		// Pass the removed value props to parent components to add updated list in terms query
		if(this.state.selectedItems.length) {
			this.props.onSelect(this.state.selectedItems);
		}
	}

	clearAll() {
		this.handleListClickAll(this.props.selectAllLabel, false);
	}

	getSelectedItems() {
		let selectedItems = this.state.selectedItems ? this.state.selectedItems : [];
		this.props.items.forEach((item) => {
			if(item.status && selectedItems.indexOf(item.key) < 0) {
				selectedItems.push(item.key);
			}
		});
		return selectedItems;
	}

	render() {
		let items = this.props.items;
		let selectedItems = this.getSelectedItems();
		var ListItemsArray = [];
		var TagItemsArray = [];
		// Build the array for the checkboxList items
		items.forEach(function (item, index) {
			try {
				item.keyRef = item.key.replace(/ /g,'_');
			} catch(e) {
				item.keyRef = index;
				console.log(item, e);
			}
			let visibleFlag = !item.hasOwnProperty('visible') ? true : (item.visible ? true : false);
			// if(flag) {
				ListItemsArray.push(
					<ListItem
						key={item.keyRef}
						value={item.key}
						doc_count={item.doc_count}
						countField={this.props.showCount}
						handleClick={this.handleListClick}
						visible={visibleFlag}
						status={item.status || false}
						ref={"ref" + item.keyRef} />
				);
			// }
		}.bind(this));
		// include select all if set from parent
		if(this.props.selectAllLabel && items && items.length) {
			ListItemsArray.unshift(
				<ListItem
					key='selectall'
					value={this.props.selectAllLabel}
					countField={false}
					visible={true}
					handleClick={this.handleListClickAll}
					status={this.props.selectAllValue}
					ref={"refselectall"} />
			);
		}
		// Build the array of Tags for selected items
		if(this.props.showTags && selectedItems) {
			if(selectedItems.length <= 5){
				selectedItems.forEach(function (item) {
					TagItemsArray.push(<Tag
						key={item}
						value={item}
						onClick={this.handleTagClick} />);
				}.bind(this));
			} else {
				TagItemsArray.unshift(<Tag
					key={'Clear All'}
					value={'Clear All'}
					onClick={this.clearAll} />);
			}
		}
		return (
			<div className="rbc-list-container col s12 col-xs-12">
				{
					TagItemsArray.length ?
					<div className="row">
						{TagItemsArray}
					</div> :
					null
				}
				<div className="row">
					{ListItemsArray}
				</div>
			</div>
		);
	}
}

ItemCheckboxList.defaultProps = {
	showTags: true
};

class ListItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initialStatus: this.props.status,
			status: this.props.status || false,
		};
	}

	componentDidUpdate() {
		if(this.props.status !== this.state.initialStatus) {
			this.setState({
				status: this.props.status,
				initialStatus: this.props.status
			});
		}
	}

	handleClick() {
		this.setState({
			status: !this.state.status
		});
		this.props.handleClick(this.props.value, !this.state.status);
	}

	handleCheckboxChange(event) {
		this.setState({
			status: event.target.checked
		});
	}

	render() {
		let count;
		// Check if the user has set to display countField
		if (this.props.countField) {
			count = <span className="rbc-count"> {this.props.doc_count} </span>;
		}
		let cx = classNames({
			'rbc-count-active': this.props.countField,
			'rbc-count-inactive': !this.props.countField,
			'rbc-item-show': this.props.visible,
			'rbc-item-hide': !this.props.visible
		});
		return (
			<div onClick={this.handleClick.bind(this) } className={`rbc-list-item row ${cx}`}>
				<input type="checkbox"
					className="rbc-checkbox-item"
					checked={this.state.status}
					onChange={this.handleCheckboxChange.bind(this) } />
				<label className="rbc-label">{this.props.value} {count}</label>
			</div>
		);
	}
}

class Tag extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span onClick={this.props.onClick.bind(null, this.props.value) } className="rbc-tag-item col">
				<a href="javascript:void(0)" className="close"> x </a>
				<span>{this.props.value}</span>
			</span>
		);
	}
}
