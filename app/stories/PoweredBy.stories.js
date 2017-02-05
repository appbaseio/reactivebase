import React, { Component } from 'react';
import { ReactiveBase, PoweredBy } from '../app.js';

export default class PoweredByDefault extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ReactiveBase
				appname="car-store"
				username="cf7QByt5e"
				password="d2d60548-82a9-43cc-8b40-93cbbe75c34c"
			>
				<div className="row">
					<div className="col s6 col-xs-6 card thumbnail">
						<PoweredBy />
					</div>
				</div>
			</ReactiveBase>
		);
	}
}
