import React, { Component } from "react";
import ListItem from "./ListItem";
import Tag from "./Tag";

export default class ItemCheckboxList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItems: []
		};
		this.refStore = {};
		this.handleListClick = this.handleListClick.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
		this.handleListClickAll = this.handleListClickAll.bind(this);
		this.clearAll = this.clearAll.bind(this);
	}

	componentDidMount() {
		if (this.props.defaultSelected) {
			this.defaultUpdate();
		}
	}

	defaultUpdate() {
		this.setState({
			selectedItems: this.props.defaultSelected,
			defaultSelectall: this.props.defaultSelectall
		}, () => {
			this.updateAction.bind(this);
			this.props.onSelect(this.state.selectedItems);
		});
	}

	// remove selected types if not in the list
	componentDidUpdate() {
		let updated = null;
		let isExecutable = true;
		if (this.state.selectedItems) {
			updated = JSON.parse(JSON.stringify(this.state.selectedItems));
		}
		if (updated && updated.length && this.props.items && this.props.items.length) {
			updated = updated.filter((item) => {
				const updatedFound = this.props.items.filter(propItem => propItem.key === item);
				return !!updatedFound.length;
			});
			if (updated.length !== this.state.selectedItems.length) {
				isExecutable = !updated.length;
				this.props.onRemove(this.state.selectedItems, isExecutable);
				this.updateSelectedItems(updated);
				if (updated.length) {
					this.props.onSelect(updated);
				}
			}
		}
	}

	// Handler function when a checkbox is clicked
	handleListClick(value, selectedStatus) {
		let updated;
		// If the checkbox selectedStatus is true, then update selectedItems array
		if (selectedStatus) {
			this.props.onRemove(this.state.selectedItems, false);
			updated = this.state.selectedItems;
			updated.push(value);
			this.setState({
				selectedItems: updated
			}, this.updateAction.bind(this));
			// Pass the props to parent components to add to the Query
			if (this.state.selectedItems.length) {
				this.props.onSelect(this.state.selectedItems);
			}
		} else {
			// If the checkbox selectedStatus is false
			// Call handleTagClick to remove it from the selected Items
			this.handleTagClick(value);
		}
	}

	// Handler function when a cancel button on tag is clicked to remove it
	handleTagClick(value) {
		// Pass the older value props to parent components to remove older list in terms query
		const isExecutable = this.state.selectedItems.length === 1;
		this.props.onRemove(this.state.selectedItems, isExecutable);
		const keyRef = value.toString().replace(/ /g, "_");
		const ref = `ref${keyRef}`;
		const checkboxElement = this.refStore[ref];
		checkboxElement.state.status = false;
		const updated = this.state.selectedItems;
		const index = updated.indexOf(value);
		updated.splice(index, 1);
		this.setState({
			selectedItems: updated
		}, this.updateAction.bind(this));
		// Pass the removed value props to parent components to add updated list in terms query
		// if(updated.length) {
		this.props.onSelect(updated);
		// }
	}

	clearAll() {
		this.handleListClickAll(this.props.selectAllLabel, false);
	}

	getSelectedItems() {
		// let selectedItems = this.state.selectedItems ? this.state.selectedItems : [];
		const selectedItems = [];
		this.props.items.forEach((item) => {
			if (item.status && selectedItems.indexOf(item.key) < 0) {
				selectedItems.push(item.key);
			}
		});

		return selectedItems;
	}

	// handler function for select all
	handleListClickAll(value, selectedStatus) {
		this.props.selectAll(selectedStatus);
		let selectedItems = this.props.items.map(item => item.key);
		selectedItems = selectedStatus ? selectedItems : [];
		this.setState({
			defaultSelectall: selectedStatus,
			selectedItems
		}, () => {
			this.updateAction.bind(this);
			this.props.onSelect(this.state.selectedItems, selectedItems);
		});
	}

	updateSelectedItems(updated) {
		this.setState({
			selectedItems: updated
		});
	}

	updateAction() {
		if (!this.state.selectedItems.length) {
			this.props.onSelect(null);
		}
	}

	render() {
		const items = this.props.items;
		const selectedItems = this.getSelectedItems();
		const ListItemsArray = [];
		const TagItemsArray = [];
		// Build the array for the checkboxList items
		items.forEach((item, index) => {
			try {
				item.keyRef = item.key.replace(/ /g, "_");
			} catch (e) {
				item.keyRef = index;
			}
			const visibleFlag = !(item in "visible") ? true : (!!item.visible);
			ListItemsArray.push(
				<ListItem
					key={item.keyRef}
					value={item.key}
					doc_count={item.doc_count}
					countField={this.props.showCount}
					handleClick={this.handleListClick}
					visible={visibleFlag}
					status={item.status || false}
					ref={
						(listitem) => {
							const currentItemRef = `ref${item.keyRef}`;
							this.refStore[currentItemRef] = listitem;
						}
					}
				/>
			);
		});
		// include select all if set from parent
		if (this.props.selectAllLabel && items && items.length) {
			ListItemsArray.unshift(
				<ListItem
					key="selectall"
					value={this.props.selectAllLabel}
					countField={false}
					visible
					handleClick={this.handleListClickAll}
					status={this.props.selectAllValue}
					ref={(listitem) => { this.refStore.refselectall = listitem; }}
				/>
			);
		}
		// Build the array of Tags for selected items
		if (this.props.showTags && selectedItems) {
			if (selectedItems.length <= 5) {
				selectedItems.forEach((item) => {
					TagItemsArray.push(<Tag
						key={item}
						value={item}
						onClick={this.handleTagClick}
					/>);
				});
			} else {
				TagItemsArray.unshift(<Tag
					key={"Clear All"}
					value={"Clear All"}
					onClick={this.clearAll}
				/>);
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

ItemCheckboxList.propTypes = {
	defaultSelected: React.PropTypes.array,
	items: React.PropTypes.array,
	onRemove: React.PropTypes.func,
	onSelect: React.PropTypes.func,
	selectAll: React.PropTypes.bool,
	selectAllLabel: React.PropTypes.string,
	selectAllValue: React.PropTypes.bool,
	showCount: React.PropTypes.bool,
	showTags: React.PropTypes.bool,
	defaultSelectall: React.PropTypes.bool
};

ItemCheckboxList.defaultProps = {
	showTags: true
};
