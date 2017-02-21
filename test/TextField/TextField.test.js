import React from 'react';
import {TextFieldTest} from './TextField';
import {expectedValues} from './config';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('TextField test', () => {
	var response = null;
	
	beforeAll(() => {
		return TextFieldTest().then((res) => {
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
