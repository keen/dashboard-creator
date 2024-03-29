/* eslint-disable @typescript-eslint/naming-convention */
import sagaHelper from 'redux-saga-testing';
import { getContext, put } from 'redux-saga/effects';

import { fetchTimezonesHandler } from './fetchTimezonesHandler';

import { timezoneSlice } from '../reducer';

import { TIMEZONES_API_HOST, KEEN_ANALYSIS } from '../../../constants';

describe('Scenario 1: Successfully fetch timezones collection', () => {
  const test = sagaHelper(fetchTimezonesHandler());
  const apiResponse = [
    {
      name: 'Europe/Warsaw',
      number_of_seconds_to_offset_time: 2000,
      utc_offset: '+02:00',
    },
  ];
  const keenAnalysis = {
    config: {
      protocol: 'http',
    },
  };

  test('set timezone loading state', (result) => {
    expect(result).toEqual(
      put(timezoneSlice.actions.setTimezonesLoading(true))
    );
  });

  test('get timezones API host from context', (result) => {
    expect(result).toEqual(getContext(TIMEZONES_API_HOST));
  });

  test('gets Keen API client from context', (result) => {
    expect(result).toEqual(getContext(KEEN_ANALYSIS));

    return keenAnalysis;
  });

  test('performs request for timezones collection', () => {
    return new Response(JSON.stringify(apiResponse));
  });

  test('serializes timezones JSON response', () => {
    return apiResponse;
  });

  test('set timezones collection', (result) => {
    const timezones = [
      {
        name: 'Europe/Warsaw',
        numberOfSecondsToOffsetTime: 2000,
        utcOffset: '+02:00',
      },
    ];

    expect(result).toEqual(put(timezoneSlice.actions.setTimezones(timezones)));
  });

  test('set timezone loading state', (result) => {
    expect(result).toEqual(
      put(timezoneSlice.actions.setTimezonesLoading(false))
    );
  });

  test('terminates saga', (result) => {
    expect(result).toBeUndefined();
  });
});

describe('Scenario 2: Error occured during fetch of timezones collection', () => {
  const test = sagaHelper(fetchTimezonesHandler());

  test('set timezone loading state', (result) => {
    expect(result).toEqual(
      put(timezoneSlice.actions.setTimezonesLoading(true))
    );
  });

  test('get timezones API host from context', (result) => {
    expect(result).toEqual(getContext(TIMEZONES_API_HOST));
  });

  test('performs request for timezones collection', () => {
    return new Error();
  });

  test('set timezones error', (result) => {
    expect(result).toEqual(put(timezoneSlice.actions.setError(true)));
  });

  test('set timezone loading state', (result) => {
    expect(result).toEqual(
      put(timezoneSlice.actions.setTimezonesLoading(false))
    );
  });

  test('terminates saga', (result) => {
    expect(result).toBeUndefined();
  });
});
