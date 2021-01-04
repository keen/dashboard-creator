import React from 'react';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
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
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const appContext = {
    notificationPubSub: new PubSub(),
    modalContainer: '#modalContainer',
    project: {
      id: '@project-id',
      userKey: '@user-key',
      masterKey: '@master-key',
    },
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

  jest.clearAllTimers();
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
  jest.clearAllTimers();
});

test('allows user to apply chart editor configuration', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorState,
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

  jest.clearAllTimers();
});

test('renders visualization settings error', () => {
  const {
    wrapper: { getByText },
  } = render();

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

  jest.clearAllTimers();
});
