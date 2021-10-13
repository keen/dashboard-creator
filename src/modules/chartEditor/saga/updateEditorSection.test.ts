import sagaHelper from 'redux-saga-testing';
import { take, getContext, select } from 'redux-saga/effects';
import { SET_CHART_SETTINGS, SET_QUERY_EVENT } from '@keen.io/query-creator';

import { updateEditorSection } from './updateEditorSection';

import { chartEditorSelectors } from '../selectors';
import { chartEditorActions } from '../index';

import { PUBSUB } from '../../../constants';

import { EditorSection } from '../types';

describe('Scenario 1: Updates editor section with chart settings', () => {
  const action = chartEditorActions.setEditorSection(EditorSection.QUERY);
  const test = sagaHelper(updateEditorSection(action));

  const pubsub = {
    publish: jest.fn(),
  };

  const chartEditor = {
    querySettings: {
      analysis_type: 'count',
      event_collection: 'purchases',
    },
    visualization: {
      chartSettings: {
        stepLabels: ['Logins', 'Purchases'],
      },
    },
  };

  test('waits for editor mount event', (result) => {
    expect(result).toEqual(take(chartEditorActions.editorMounted.type));
  });

  test('get PubSub instance from context', (result) => {
    expect(result).toEqual(getContext(PUBSUB));

    return pubsub;
  });

  test('get chart editor state', (result) => {
    expect(result).toEqual(select(chartEditorSelectors.getChartEditor));

    return chartEditor;
  });

  test('publish event to set chart settings', () => {
    expect(pubsub.publish).toHaveBeenCalledWith(SET_CHART_SETTINGS, {
      chartSettings: { stepLabels: ['Logins', 'Purchases'] },
    });
  });

  test('publish event to set query', () => {
    expect(pubsub.publish).toHaveBeenCalledWith(SET_QUERY_EVENT, {
      query: chartEditor.querySettings,
    });
  });

  test('terminates flow', (result) => {
    expect(result).toBeUndefined();
  });
});
