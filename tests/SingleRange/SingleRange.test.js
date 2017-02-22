import React from 'react';
import {SingleRangeTest} from './SingleRange';
import {expectedValues} from './config';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('SingleRange test', () => {
	var response = null;
	
	beforeAll(() => {
		return SingleRangeTest().then((res) => {
			response = res;
			return response;
		}).catch((err) => err);
	});

	test('Response should exists', ()=> {
		expect(response).toBeTruthy();
	})

	test('Query should match', () => {
		expect(response.appliedQuery).toMatchObject(expectedValues.appliedQuery);
	});

	test('result length', () => {
		expect(response.newData.length).toBe(expectedValues.resultLength);
	});

});
