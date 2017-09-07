import React from 'react';
import { ReactiveBase, SingleRange, ReactiveList } from '../../app/app.js';
import {config} from './config';
import { mount } from 'enzyme';

function testComponent(cb) {
	const onData = function(res, err) {
		cb(res, err);
	}
	const component = mount(
		<ReactiveBase
				app={config.ReactiveBase.app}
				credentials={`${config.ReactiveBase.username}:${config.ReactiveBase.password}`}

			>
			<div className="row">
				<div className="col s6 col-xs-6">
					<SingleRange
						componentId="CitySensor"
						dataField={config.mapping.price}
						title="SingleRange"
						defaultSelected={config.SingleRange.defaultSelected}
						data={config.SingleRange.data}
						size={100}
					/>
				</div>
				<div className="col s6 col-xs-6">
					<ReactiveList
						componentId="SearchResult"
						dataField={config.mapping.name}
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
		testComponent(function(res,err) {
			if (err) {
				reject(err);
			} else if (res) {
				resolve(res);
			}
		});
	});
}
