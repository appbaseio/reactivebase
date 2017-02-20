import React from 'react';
import { ReactiveBase, SingleRange, ReactiveList } from '../../app/app.js';
import {config} from './config';
import { mount } from 'enzyme';

function testComponent(cb) {
	const onData = function(response) {
		cb(response);
	}
	const component = mount(
		<ReactiveBase
				app={config.ReactiveBase.app}
				username={config.ReactiveBase.username}
				password={config.ReactiveBase.password}
			>
			<div className="row">
				<div className="col s6 col-xs-6">
					<SingleRange
						componentId="CitySensor"
						appbaseField={config.mapping.price}
						title="SingleRange"
						defaultSelected={config.SingleRange.defaultSelected}
						data={config.SingleRange.data}
						size={100}
					/>
				</div>
				<div className="col s6 col-xs-6">
					<ReactiveList
						componentId="SearchResult"
						appbaseField={config.mapping.name}
						title="Results"
						sortBy={config.ReactiveList.sortBy}
						from={config.ReactiveList.from}
						size={config.ReactiveList.size}
						onData={onData}
						requestOnScroll={true}
						react={{
							'and': ["CitySensor"]
						}}
					/>
				</div>
			</div>
		</ReactiveBase>
	);
}
export var SingleRangeTest = function() {
	return new Promise((resolve, reject) => {
		testComponent(function(response) {
			if (response.err) {
				reject(response);
			} else if (response.res) {
				resolve(response);
			}
		});
	});
}
