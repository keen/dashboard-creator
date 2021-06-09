/* eslint-disable @typescript-eslint/camelcase */

import sagaHelper from 'redux-saga-testing';
import { put, select } from 'redux-saga/effects';
import { chartEditorActions, chartEditorSelectors } from '../index';
import { updateQuerySettings } from './updateQuerySettings';

describe('updateQuerySettings()', () => {
  const timezone1 = '@Timezone1';
  const timezone2 = '@Timezone2';

  const action = chartEditorActions.setQuerySettings({
    timezone: timezone1,
  });

  describe('Scenario 1: Query is changed', () => {
    const test = sagaHelper(updateQuerySettings(action));

    test('gets hasQueryChanged flag and initial query settings', (result) => {
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));
      return {
        hasQueryChanged: false,
        initialQuerySettings: {
          timezone: timezone2,
        },
      };
    });

    test('sets hasQueryChanged flag as true', (result) => {
      expect(result).toEqual(put(chartEditorActions.setQueryChange(true)));
    });
  });

  describe('Scenario 2: Query is not changed', () => {
    const test = sagaHelper(updateQuerySettings(action));

    test('gets hasQueryChanged flag and initial query settings', (result) => {
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));
      return {
        hasQueryChanged: false,
        initialQuerySettings: {
          timezone: timezone1,
        },
      };
    });

    test('sets hasQueryChanged flag as true', (result) => {
      expect(result).not.toEqual(put(chartEditorActions.setQueryChange(true)));
    });
  });
});
