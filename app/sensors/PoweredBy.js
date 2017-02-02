import {default as React, Component} from 'react';

export class PoweredBy extends Component {
	constructor(props, context) {
		super(props);
	}

	// render
	render() {
		return (
			<span className={`rbc rbc-poweredby`}>
				<img className="rbc-img-responsive rbc-poweredby-dark" src="https://cdn.rawgit.com/appbaseio/cdn/master/appbase/logos/rbc-dark-logo.svg" alt="Appbase dark"/>
				<img className="rbc-img-responsive rbc-poweredby-light" src="https://cdn.rawgit.com/appbaseio/cdn/master/appbase/logos/rbc-logo.svg" alt="Poweredby appbase" />
			</span>
		);
	}
}