import React, { Component } from "react";
import classNames from "classnames";

export default class ListItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initialStatus: this.props.status,
			status: this.props.status || false
		};
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
	}

	componentDidUpdate() {
		if (this.props.status !== this.state.initialStatus) {
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
		if (this.props.countField) {
			count = <span className="rbc-count"> {this.props.doc_count} </span>;
		}

		if (this.props.value.trim() === "" || !this.props.visible) {
			return null;
		}

		const cx = classNames({
			"rbc-count-active": this.props.countField,
			"rbc-count-inactive": !this.props.countField,
			"rbc-checkbox-active": this.props.showCheckbox,
			"rbc-checkbox-inactive": !this.props.showCheckbox,
			"rbc-list-item-active": this.state.status,
			"rbc-list-item-inactive": !this.state.status
		});

		return (
			<div onClick={this.handleClick.bind(this)} className={`rbc-list-item row ${cx}`}>
				<input
					type="checkbox"
					className="rbc-checkbox-item"
					checked={this.state.status}
					onChange={this.handleCheckboxChange}
				/>
				<label className="rbc-label">{this.props.value} {count}</label>
			</div>
		);
	}
}

ListItem.propTypes = {
	status: React.PropTypes.bool,
	handleClick: React.PropTypes.func,
	value: React.PropTypes.string,
	countField: React.PropTypes.bool,
	doc_count: React.PropTypes.number
};
