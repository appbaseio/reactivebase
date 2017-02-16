import React from 'react';
import {DatePickerTest} from './DatePicker';
import {expectedValues} from './config';

describe('DatePicker test', () => {
	var response = null;
	beforeAll(() => {
		return DatePickerTest().then((res) => {
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
