/* eslint-disable @typescript-eslint/camelcase */
import { Query } from '@keen.io/query';
import { ChartSettings } from '@keen.io/widget-picker';
import chartEditorReducer, { initialState } from './reducer';

import {
  openEditor,
  closeEditor,
  resetEditor,
  runQueryError,
  runQuerySuccess,
  runQuery,
  setQueryType,
  setQueryChange,
  setQueryResult,
  setQuerySettings,
  setVisualizationSettings,
  updateChartSettings,
  showQueryUpdateConfirmation,
  hideQueryUpdateConfirmation,
} from './actions';

test('shows query update confirmation', () => {
  const action = showQueryUpdateConfirmation();
  const { changeQueryConfirmation } = chartEditorReducer(
    { ...initialState, changeQueryConfirmation: false },
    action
  );

  expect(changeQueryConfirmation).toEqual(true);
});

test('hides query update confirmation', () => {
  const action = hideQueryUpdateConfirmation();
  const { changeQueryConfirmation } = chartEditorReducer(
    { ...initialState, changeQueryConfirmation: true },
    action
  );

  expect(changeQueryConfirmation).toEqual(false);
});

test('set query type', () => {
  const action = setQueryType(false);
  const { isSavedQuery } = chartEditorReducer(
    { ...initialState, isSavedQuery: true },
    action
  );

  expect(isSavedQuery).toEqual(false);
});

test('set query change indicator', () => {
  const action = setQueryChange(false);
  const { hasQueryChanged } = chartEditorReducer(
    { ...initialState, hasQueryChanged: true },
    action
  );

  expect(hasQueryChanged).toEqual(false);
});

test('set state for successful query perform', () => {
  const queryResult = {
    result: 100,
  };

  const action = runQuerySuccess(queryResult);
  const { isQueryPerforming, analysisResult } = chartEditorReducer(
    { ...initialState, isQueryPerforming: true },
    action
  );

  expect(isQueryPerforming).toEqual(false);
  expect(analysisResult).toEqual(queryResult);
});

test('set perform state for unsuccessful query', () => {
  const action = runQueryError();
  const { isQueryPerforming } = chartEditorReducer(
    { ...initialState, isQueryPerforming: true },
    action
  );

  expect(isQueryPerforming).toEqual(false);
});

test('set correct query performing state', () => {
  const action = runQuery();
  const { isQueryPerforming } = chartEditorReducer(initialState, action);

  expect(isQueryPerforming).toEqual(true);
});

test('set query settings', () => {
  const query: Query = {
    analysis_type: 'percentile',
    event_collection: 'logins',
    order_by: null,
  };

  const action = setQuerySettings(query);
  const { querySettings } = chartEditorReducer(initialState, action);

  expect(querySettings).toEqual(query);
});

test('set visualization settings', () => {
  const chartSettings: ChartSettings = {
    layout: 'vertical',
  };

  const action = setVisualizationSettings('bar', chartSettings, {});
  const { visualization } = chartEditorReducer(initialState, action);

  expect(visualization).toMatchObject({
    type: 'bar',
    chartSettings,
    widgetSettings: {},
  });
});

test('updates chart settings', () => {
  const action = updateChartSettings({ steps: ['purchases'] });
  const { visualization } = chartEditorReducer(
    {
      ...initialState,
      visualization: {
        type: 'funnel',
        chartSettings: {
          layout: 'vertical',
        },
        widgetSettings: {},
      },
    },
    action
  );

  expect(visualization).toMatchObject({
    type: 'funnel',
    chartSettings: {
      layout: 'vertical',
      steps: ['purchases'],
    },
    widgetSettings: {},
  });
});

test('set query results', () => {
  const queryResult = {
    result: 100,
  };

  const action = setQueryResult(queryResult);
  const { analysisResult } = chartEditorReducer(initialState, action);

  expect(analysisResult).toEqual(queryResult);
});

test('opens chart editor', () => {
  const action = openEditor();
  const { isOpen } = chartEditorReducer(
    { ...initialState, isOpen: false },
    action
  );

  expect(isOpen).toEqual(true);
});

test('closes chart editor', () => {
  const action = closeEditor();
  const { isOpen } = chartEditorReducer(
    { ...initialState, isOpen: true },
    action
  );

  expect(isOpen).toEqual(false);
});

test('restore initial state', () => {
  const action = resetEditor();
  const state = chartEditorReducer({ ...initialState, isOpen: true }, action);

  expect(state).toEqual({
    ...initialState,
    isOpen: true,
  });
});
