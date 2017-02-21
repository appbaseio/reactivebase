import React from 'react';
import {RangeSliderTest} from './RangeSlider';
import {expectedValues} from './config';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('RangeSlider test', () => {
	var response = null;
	beforeAll(() => {
		return RangeSliderTest().then((res) => {
			response = res;
			return response;
		}).catch((err) => err);
	});

	test('Response should exists', ()=> {
		expect(response).toBeTruthy();
		expect(response.res).toBeTruthy();
	})

	test('Query should match', () => {
		expect(response.res.appliedQuery).toMatchObject(expectedValues.appliedQuery);
	});

	test('result length', () => {
		expect(response.res.newData.length).toBe(expectedValues.resultLength);
	});

});
