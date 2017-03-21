import React from 'react';
import { ReactiveBase, NumberBox, ReactiveList } from '../../app/app.js';
import {config} from './config';
import renderer from 'react-test-renderer';

function testComponent(cb) {
	const onData = function(res, err) {
		cb(res, err);
	}
	const component = renderer.create(
		<ReactiveBase
				app={config.ReactiveBase.app}
				credentials={`${config.ReactiveBase.username}:${config.ReactiveBase.password}`}

			>
			<div className="row">
				<div className="col s6 col-xs-6">
					<NumberBox
						componentId="CitySensor"
						appbaseField={config.mapping.rating}
						title="NumberBox"
						data={config.NumberBox.data}
						defaultSelected={config.NumberBox.defaultSelected}
						size={100}
					/>
				</div>
				<div className="col s6 col-xs-6">
					<ReactiveList
						componentId="SearchResult"
						appbaseField={config.mapping.rating}
						title="Results"
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
export var NumberBoxTest = function() {
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
