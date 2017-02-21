import React from 'react';
import { ReactiveBase, DateRange, ReactiveList } from '../../app/app.js';
import {config} from './config';
import { mount } from 'enzyme';

function testComponent(cb) {
	const onData = function(err, res) {
		cb(err, res);
	}
	const component = mount(
		<ReactiveBase
				app={config.ReactiveBase.app}
				username={config.ReactiveBase.username}
				password={config.ReactiveBase.password}
				type={config.ReactiveBase.type}
			>
			<div className="row">
				<div className="col s6 col-xs-6">
					<DateRange
						componentId="CitySensor"
						appbaseField={config.mapping.date}
						title="DateRange"
						defaultSelected ={{
							startDate: config.DateRange.startDate,
							endDate: config.DateRange.endDate
						}}
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
export var DateRangeTest = function() {
	return new Promise((resolve, reject) => {
		testComponent(function(err, res) {
			if (err) {
				reject(err);
			} else if (res) {
				resolve(res);
			}
		});
	});
}
