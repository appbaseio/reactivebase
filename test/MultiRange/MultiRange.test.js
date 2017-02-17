import React from 'react';
import {MultiRangeTest} from './MultiRange';
import {expectedValues} from './config';

describe('MultiRange test', () => {
	var response = null;
	beforeAll(() => {
		return MultiRangeTest().then((res) => {
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
