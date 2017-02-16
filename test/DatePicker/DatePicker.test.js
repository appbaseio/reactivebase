import React from 'react';
import {DatePickerTest} from './DatePicker';
import {expectedValues} from './config';
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('DatePicker test', () => {
	var response = null;
	beforeAll((done) => {
		return DatePickerTest().then((res) => {
			response = res;
			done();
			return response;
		}).catch((err) => {
			console.log(err);
			done();
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
