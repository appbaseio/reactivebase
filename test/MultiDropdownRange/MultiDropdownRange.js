import React from 'react';
import { ReactiveBase, MultiDropdownRange, ReactiveList } from '../../app/app.js';
import {config} from './config';
import { mount } from 'enzyme';

function testComponent(cb) {
	const onData = function(res, err) {
		cb(res, err);
	}
	const component = mount(
		<ReactiveBase
				app={config.ReactiveBase.app}
				username={config.ReactiveBase.username}
				password={config.ReactiveBase.password}
			>
			<div className="row">
				<div className="col s6 col-xs-6">
					<MultiDropdownRange
						componentId="CitySensor"
						appbaseField={config.mapping.price}
						title="MultiDropdownRange"
						defaultSelected={config.MultiDropdownRange.defaultSelected}
						data={config.MultiDropdownRange.data}
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
export var MultiDropdownRangeTest = function() {
	return new Promise((resolve, reject) => {
		testComponent(function(res,err) {
			if (err) {
				reject(err);
			} else if (res) {
				resolve(res);
			}
		});
	});
}
