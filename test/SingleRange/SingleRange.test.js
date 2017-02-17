import React from 'react';
import {SingleRangeTest} from './SingleRange';
import {expectedValues} from './config';

describe('SingleRange test', () => {
	var response = null;
	beforeAll(() => {
		return SingleRangeTest().then((res) => {
			response = res;
			console.log(response.res);
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
