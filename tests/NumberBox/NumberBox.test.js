import React from 'react';
import {NumberBoxTest} from './NumberBox';
import {expectedValues} from './config';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('NumberBox test', () => {
	var response = null;
	
	beforeAll(() => {
		return NumberBoxTest().then((res) => {
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
