import React, { Component } from "react";
import PropTypes from 'prop-types';
import _ from "lodash";
import ListItem from "./ListItem";

export default class ItemCheckboxList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItems: [],
			selectAll: false
		};
		this.refStore = {};
		this.handleListClick = this.handleListClick.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.handleListClickAll = this.handleListClickAll.bind(this);
	}

	componentDidMount() {
		if (Array.isArray(this.props.defaultSelected)) {
			if (this.props.defaultSelected.indexOf(this.props.selectAllLabel) >= 0) {
				this.handleListClickAll(this.props.selectAllLabel, true);
			} else {
				let items = [];
				this.props.items.forEach(item => {
					if (Array.isArray(this.props.defaultSelected) && this.props.defaultSelected.indexOf(item.key) >= 0) {
						items.push(item.key);
					}
				});
				this.setState({
					selectedItems: items.length ? items : []
				}, () => {
					this.props.onSelect(this.state.selectedItems);
				});
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.defaultSelected === null && !nextProps.selectAll) {
			this.setState({
				selectedItems: []
			});
		}
		if (!_.isEqual(this.props.defaultSelected, nextProps.defaultSelected)) {
			let items = [];
			this.props.items.forEach(item => {
				if (Array.isArray(nextProps.defaultSelected) &&  nextProps.defaultSelected.indexOf(item.key) >= 0) {
					items.push(item.key);
				}
			});
			this.setState({
				selectedItems: items.length ? items : []
			}, () => {
				this.props.onSelect(this.state.selectedItems);
			});
		}
	}

	// Handler function when a checkbox is clicked
	handleListClick(value, selectedStatus) {
		let updated;
		// If the checkbox selectedStatus is true, then update selectedItems array
		if (selectedStatus) {
			updated = this.state.selectedItems;
			updated.push(value);
			this.setState({
				selectedItems: updated
			}, () => {
				this.props.onSelect(updated);
			});
		} else {
			// If the checkbox selectedStatus is false
			// Call removeItem to remove it from the selected Items
			this.removeItem(value);
		}
	}

	// Handler function when a cancel button on tag is clicked to remove it
	removeItem(value) {
		// Pass the older value props to parent components to remove older list in terms query
		const keyRef = value.toString().replace(/ /g, "_");
		const ref = `ref${keyRef}`;
		const checkboxElement = this.refStore[ref];
		checkboxElement.state.status = false;

		const updated = this.state.selectedItems;
		let index = updated.indexOf(value);
		updated.splice(index, 1);

		if (this.state.selectAll) {
			index = updated.indexOf(this.props.selectAllLabel);
			updated.splice(index, 1);
		}

		this.setState({
			selectedItems: updated,
			selectAll: false
		}, () => {
			this.props.onRemove(this.state.selectedItems);
		});
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
		if (selectedStatus) {
			let selectedItems = this.props.items.map(item => item.key);
			selectedItems = selectedStatus ? selectedItems : [];
			this.setState({
				selectedItems: [this.props.selectAllLabel, ...selectedItems],
				selectAll: true
			}, () => {
				this.props.onSelectAll(value);
			});
		} else {
			this.setState({
				selectedItems: []
			}, () => {
				this.props.onSelect(null);
			});
		}
	}

	render() {
		const items = this.props.items;
		const ListItemsArray = [];
		// Build the array for the checkboxList items
		items.forEach((item, index) => {
			try {
				item.keyRef = item.key.replace(/ /g, "_");
			} catch (e) {
				item.keyRef = index;
			}
			const visibleFlag = !("visible" in item) ? true : (!!item.visible);
			ListItemsArray.push(
				<ListItem
					key={item.keyRef}
					value={item.key}
					doc_count={item.doc_count}
					countField={this.props.showCount}
					handleClick={this.handleListClick}
					visible={visibleFlag}
					showCheckbox={this.props.showCheckbox}
					status={this.state.selectedItems.indexOf(item.key) >= 0}
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
					showCheckbox={this.props.showCheckbox}
					handleClick={this.handleListClickAll}
					status={this.props.selectAll}
					ref={(listitem) => { this.refStore.refselectall = listitem; }}
				/>
			);
		}

		return (
			<div className="rbc-list-container col s12 col-xs-12">
				<div className="row">
					{ListItemsArray}
				</div>
			</div>
		);
	}
}

ItemCheckboxList.propTypes = {
	defaultSelected: PropTypes.array,
	items: PropTypes.array,
	onRemove: PropTypes.func,
	onSelect: PropTypes.func,
	onSelectAll: PropTypes.func,
	selectAllLabel: PropTypes.string,
	selectAll: PropTypes.bool,
	showCount: PropTypes.bool,
	defaultSelectall: PropTypes.bool
};
