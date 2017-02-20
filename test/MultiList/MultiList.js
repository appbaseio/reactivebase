import React from 'react';
import { ReactiveBase, MultiList, ReactiveList } from '../../app/app.js';
import {config} from './config';
import renderer from 'react-test-renderer';

function testComponent(cb) {
	const onData = function(response) {
		cb(response);
	}
	const component = renderer.create(
		<ReactiveBase
				app={config.ReactiveBase.app}
				username={config.ReactiveBase.username}
				password={config.ReactiveBase.password}
				type={config.ReactiveBase.type}
			>
			<div className="row">
				<div className="col s6 col-xs-6">
					<MultiList
						componentId="CitySensor"
						appbaseField={config.mapping.city}
						title="MultiList"
						defaultSelected={config.MultiList.defaultSelected}
						size={100}
					/>
				</div>
				<div className="col s6 col-xs-6">
					<ReactiveList
						componentId="SearchResult"
						appbaseField={config.mapping.topic}
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
export var MultiListTest = function() {
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
