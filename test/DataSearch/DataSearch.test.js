import React from 'react';
import {DataSearchTest} from './DataSearch';
import {expectedValues} from './config';

describe('DataSearch test', () => {
	var response = null;
	beforeAll(() => {
		return DataSearchTest().then((res) => {
			console.log(res);
			response = res;
			return response;
		}).catch((err) => {
			console.log(err);
			return err;
		});
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
