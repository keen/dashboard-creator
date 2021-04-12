/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { PubSub } from '@keen.io/pubsub';

import ChartEditor from './ChartEditor';

import {
  initialState as chartEditorState,
  EDITOR_MOUNTED,
} from '../../../../modules/chartEditor';
import { AppContext } from '../../../../contexts';

const render = (storeState: any = {}, overProps: any = {}) => {
  const props = {
    onClose: jest.fn(),
    ...overProps,
  };

  const state = {
    app: { activeDashboardId: '@dashboard-id' },
    theme: { dashboards: {} },
    chartEditor: chartEditorState,
    timezone: {
      defaultTimezoneForQuery: 'Africa/Nairobi',
      timezoneSelectionDisabled: false,
    },
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const appContext = {
    notificationPubSub: new PubSub(),
    analyticsApiUrl: '@keen-api-url',
    modalContainer: '#modal-root',
    project: {
      id: '@project-id',
      userKey: '@user-key',
      masterKey: '@master-key',
    },
    createSharedDashboardUrl: () => 'url',
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <AppContext.Provider value={appContext}>
        <ChartEditor {...props} />
      </AppContext.Provider>
    </Provider>
  );

  return {
    store,
    appContext,
    props,
    wrapper,
  };
};

jest.useFakeTimers();

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  }
});

test('allows user to run query', () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  store.clearActions();

  const button = getByText('chart_widget_editor.run_query');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@chart-editor/RUN_QUERY",
      },
    ]
  `);
});

test('triggers action after editor is mounted', async () => {
  const { store } = render();

  await waitFor(() => {
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        {
          type: EDITOR_MOUNTED,
        },
      ])
    );
  });
});

test('do not allows user to apply incomplete chart settings', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorState,
      analysisResult: null,
      visualization: {
        type: 'metric',
        chartSettings: {},
        widgetSettings: {},
      },
    },
  };

  const {
    wrapper: { getByText },
  } = render(storeState);

  const button = getByText('chart_widget_editor.add_to_dashboard');
  fireEvent.click(button);

  expect(
    getByText('chart_widget_editor.configuration_error')
  ).toBeInTheDocument();
});

test('allows user to apply chart editor configuration', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorState,
      analysisResult: {
        query: {
          analysis_type: 'count',
        },
        results: 100,
      },
      visualization: {
        type: 'metric',
        chartSettings: {},
        widgetSettings: {},
      },
    },
  };

  const {
    wrapper: { getByText },
    store,
  } = render(storeState);

  store.clearActions();

  const button = getByText('chart_widget_editor.add_to_dashboard');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@chart-editor/APPLY_CONFIGURATION",
      },
    ]
  `);
});

test('renders visualization settings error', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorState,
      analysisResult: {
        query: {
          analysis_type: 'count',
        },
        results: 100,
      },
      visualization: {
        type: 'line',
        chartSettings: {},
        widgetSettings: {},
      },
    },
  };

  const {
    wrapper: { getByText },
  } = render(storeState);

  const button = getByText('chart_widget_editor.add_to_dashboard');
  fireEvent.click(button);

  expect(getByText('chart_widget_editor.widget_error')).toBeInTheDocument();

  jest.clearAllTimers();
});

test('calls "onClose" event handler', () => {
  const {
    props,
    wrapper: { getByText },
  } = render();

  const cancelButton = getByText('chart_widget_editor.cancel');
  fireEvent.click(cancelButton);

  expect(props.onClose).toHaveBeenCalled();
});

test('shows saved query updated message', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorState,
      hasQueryChanged: true,
      isSavedQuery: true,
    },
  };
  const {
    wrapper: { getByText },
  } = render(storeState);

  expect(getByText('chart_widget_editor.save_query_edit')).toBeInTheDocument();
});

test('allows user to restore saved query settings', async () => {
  const storeState = {
    chartEditor: {
      ...chartEditorState,
      hasQueryChanged: true,
      isSavedQuery: true,
    },
  };
  const {
    store,
    wrapper: { getByTestId, getByText },
  } = render(storeState);

  const element = getByTestId('edit-tooltip-icon');
  fireEvent.mouseEnter(element);

  await waitFor(() => getByText('chart_widget_editor.save_query_restore'));
  store.clearActions();

  const anchor = getByText('chart_widget_editor.save_query_restore');
  fireEvent.click(anchor);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@chart-editor/RESTORE_SAVED_QUERY",
      },
    ]
  `);
});

test('shows placeholder with run query button', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorState,
      analysisResult: null,
    },
  };
  const {
    wrapper: { getByText },
  } = render(storeState);

  expect(getByText('chart_widget_editor.run_query')).toBeInTheDocument();
});

test('does not allow user to apply chart editor configuration when query has error', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorState,
      analysisResult: {
        query: {
          analysis_type: 'count',
        },
        results: 100,
      },
      visualization: {
        type: 'metric',
        chartSettings: {},
        widgetSettings: {},
      },
      queryError: 'There is error in the query',
    },
  };

  const {
    wrapper: { getByText },
    store,
  } = render(storeState);

  store.clearActions();

  const button = getByText('chart_widget_editor.add_to_dashboard');
  fireEvent.click(button);
  expect(store.getActions()).toEqual([]);
});

test('does not allow user to apply chart editor configuration when query is dirty', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorState,
      analysisResult: {
        query: {
          analysis_type: 'count',
        },
        results: 100,
      },
      visualization: {
        type: 'metric',
        chartSettings: {},
        widgetSettings: {},
      },
      isDirtyQuery: true,
    },
  };

  const {
    wrapper: { getByText },
    store,
  } = render(storeState);

  store.clearActions();

  const button = getByText('chart_widget_editor.add_to_dashboard');
  fireEvent.click(button);
  expect(store.getActions()).toEqual([]);
});
