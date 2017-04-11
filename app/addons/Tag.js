import React, { Component } from "react";

export default class Tag extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span onClick={() => this.props.onClick(this.props.value)} className="rbc-tag-item col">
				<a href="javascript:void(0)" className="close">×</a>
				<span>{this.props.value}</span>
			</span>
		);
	}
}
