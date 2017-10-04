import React, { Component } from "react";
import classNames from "classnames";

export default class ItemList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItem: null
		};
		this.defaultSelected = this.props.defaultSelected;
		this.defaultAllowed = true;
		this.handleClick = this.handleClick.bind(this);
		this.handleListClickAll = this.handleListClickAll.bind(this);
	}

	componentDidMount() {
		if (this.props.defaultSelected) {
			if (this.props.selectAllLabel === this.props.defaultSelected) {
				this.handleListClickAll(this.props.defaultSelected, true);
			} else {
				this.handleClick(this.props.defaultSelected, true);
			}
		}
	}

	componentDidUpdate() {
		if (this.props.items.length && this.defaultAllowed) {
			this.defaultAllowed = false;
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selectAll) {
			if (this.state.selectedItem !== nextProps.selectAllLabel) {
				this.setState({
					selectedItem: nextProps.selectAllLabel
				});
			}
		} else if (nextProps.defaultSelected !== "undefined" && !Array.isArray(nextProps.defaultSelected)
			&& this.defaultSelected !== nextProps.defaultSelected) {
			this.defaultSelected = nextProps.defaultSelected;
			if (nextProps.defaultSelected === null) {
				this.setState({
					selectedItem: null
				});
			} else {
				this.defaultSelection(nextProps.defaultSelected);
			}
		}
	}

	defaultSelection(defaultSelected) {
		if (defaultSelected === this.props.selectAllLabel) {
			this.handleListClickAll(this.props.selectAllLabel, true);
		} else {
			this.handleClick(defaultSelected, true);
		}
	}

	handleListClickAll(value, execute = false) {
		if (execute || this.defaultSelected !== value) {
			// const selectedItems = this.props.items.map(item => item.key);
			this.setState({
				selectedItem: value
			}, () => {
				this.props.onSelectAll(value);
				this.defaultSelected = value;
			});
		} else {
			this.reset();
		}
	}

	// Handler function is called when the list item is clicked
	handleClick(value, execute = false) {
		if (execute || this.defaultSelected !== value) {
			// Pass the new selected value to be added to the query
			this.setState({
				selectedItem: value
			}, () => {
				this.props.onSelect(value);
				this.defaultSelected = value;
			});
		} else {
			this.reset();
		}
	}

	reset() {
		this.defaultSelected = null;
		this.setState({
			selectedItem: null
		}, () => {
			this.props.onSelect(null);
		});
	}

	renderItemsComponent() {
		const items = this.props.items;
		const itemsComponent = [];
		// Build the array of components for each item
		items.forEach((item) => {
			const visibleFlag = !item.hasOwnProperty("visible") ? true : (!!item.visible);
			itemsComponent.push(<ItemRow
				key={item.key}
				value={item.key}
				doc_count={item.doc_count}
				countField={this.props.showCount}
				handleClick={this.handleClick}
				visible={visibleFlag}
				showRadio={this.props.showRadio}
				selectedItem={this.state.selectedItem}
			/>);
		});

		// include select all if set from parent
		if (this.props.selectAllLabel && items && items.length) {
			itemsComponent.unshift(
				<ItemRow
					key="selectall"
					visible={true}
					value={this.props.selectAllLabel}
					countField={false}
					showRadio={this.props.showRadio}
					handleClick={this.handleListClickAll}
					selectedItem={this.state.selectedItem}
					ref={"refselectall"}
				/>
			);
		}

		return itemsComponent;
	}

	render() {
		return (
			<div className="rbc-list-container col s12 col-xs-12">
				{this.renderItemsComponent()}
			</div>
		);
	}
}

class ItemRow extends Component {
	renderItem() {
		let count;
		// Check if user wants to show count field
		if (this.props.countField) {
			count = <span className="rbc-count"> ({this.props.doc_count}) </span>;
		}
		let item = (
			<a href="javascript:void(0)" className={"col s12 col-xs-12"}>
				<span> {this.props.value} </span>
				{count}
			</a>
		);
		if (this.props.value === this.props.selectedItem) {
			item = (
				<a href="javascript:void(0)" className={"col s12 col-xs-12"}>
					<strong>
						<span> {this.props.value} </span>
						{count}
					</strong>
				</a>
			);
		}
		return item;
	}

	renderCount() {
		let count;
		// Check if user wants to show count field
		if (this.props.countField) {
			count = <span className="rbc-count"> {this.props.doc_count} </span>;
		}
		return count;
	}

	render() {
		if (this.props.value.trim() === "") {
			return null;
		}

		const cx = classNames({
			"rbc-count-active": this.props.countField,
			"rbc-count-inactive": !this.props.countField,
			"rbc-item-show": this.props.visible,
			"rbc-item-hide": !this.props.visible,
			"rbc-radio-active": this.props.showRadio,
			"rbc-radio-inactive": !this.props.showRadio,
			"rbc-list-item-active": this.props.value === this.props.selectedItem,
			"rbc-list-item-inactive": this.props.value !== this.props.selectedItem
		});
		// let activeClass = this.props.value === this.props.selectedItem ? 'active' : '';
		return (
			<div className={`rbc-list-item row ${cx}`} onClick={() => this.props.handleClick(this.props.value)}>
				<input
					type="radio"
					className="rbc-radio-item"
					checked={this.props.value === this.props.selectedItem}
					value={this.props.value}
				/>
				<label className="rbc-label">{this.props.value} {this.renderCount()}</label>
			</div>
		);
	}
}
