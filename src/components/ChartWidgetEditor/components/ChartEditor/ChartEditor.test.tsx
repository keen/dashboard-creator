/* eslint-disable @typescript-eslint/naming-convention */
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

import { AppContext } from '../../../../contexts';
import { createBodyElementById } from '../../../../utils/test/createBodyElementById';

import {
  chartEditorActions,
  chartEditorInitialState,
  EditorSection,
} from '../../../../modules/chartEditor';
import { createDashboardSettings } from '../../../../modules/dashboards/utils';

const render = (storeState: any = {}, overProps: any = {}) => {
  const props = {
    onClose: jest.fn(),
    ...overProps,
  };

  const activeDashboardId = '@dashboard-id';

  const state = {
    app: { activeDashboardId },
    theme: {
      dashboards: {
        [activeDashboardId]: {
          theme: {
            gridX: {
              enabled: true,
            },
            gridY: {
              enabled: false,
            },
            funnel: {
              header: {
                badge: {
                  enabled: true,
                },
              },
            },
          },
          settings: createDashboardSettings(),
        },
      },
    },
    chartEditor: chartEditorInitialState,
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
    timezonesApiUrl: '@timezones-api-url',
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
  createBodyElementById('modal-root');
});

test('allows user to run query', () => {
  const {
    wrapper: { getAllByText },
    store,
  } = render();

  store.clearActions();

  const button = getAllByText('chart_widget_editor.run_query');
  fireEvent.click(button[0]);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "chartEditor/runQuery",
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
          type: chartEditorActions.editorMounted.type,
        },
      ])
    );
  });
});

test('do not allows user to apply incomplete chart settings', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorInitialState,
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
    store,
  } = render(storeState);

  store.clearActions();

  const button = getByText('chart_widget_editor.add_to_dashboard');
  fireEvent.click(button);

  expect(store.getActions()).toEqual([]);
});

test('allows user to apply chart editor configuration', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorInitialState,
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
        "type": "chartEditor/applyConfiguration",
      },
    ]
  `);
});

test('renders visualization settings error', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorInitialState,
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

test('clicking "close" icon calls "onClose" handler', () => {
  const {
    props,
    wrapper: { getByTestId },
  } = render();

  const closeIcon = getByTestId('close-handler');
  fireEvent.click(closeIcon);

  expect(props.onClose).toHaveBeenCalled();
});

test('shows placeholder with run query button', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorInitialState,
      analysisResult: null,
    },
  };
  const {
    wrapper: { getAllByText },
  } = render(storeState);

  expect(getAllByText('chart_widget_editor.run_query').length).toEqual(2);
});

test('does not allow user to apply chart editor configuration when query has error', () => {
  const storeState = {
    chartEditor: {
      ...chartEditorInitialState,
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
      ...chartEditorInitialState,
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

test('allows user to set chart title', async () => {
  const chartTitle = 'CHART_TITLE';
  const storeState = {
    chartEditor: {
      ...chartEditorInitialState,
      analysisResult: {
        query: {
          analysis_type: 'count',
        },
        results: 100,
      },
      visualization: {
        type: 'area',
        visualizationType: 'area',
        chartSettings: {
          curve: 'linear',
          stackMode: 'normal',
          groupMode: 'grouped',
        },
        widgetSettings: {},
      },
      editorSection: EditorSection.SETTINGS,
    },
  };
  const {
    wrapper: { getByPlaceholderText },
    store,
  } = render(storeState);

  store.clearActions();
  const titleInput = getByPlaceholderText(
    'widget_customization_heading_settings.title_placeholder'
  );
  fireEvent.change(titleInput, { target: { value: chartTitle } });

  expect(store.getActions()).toMatchSnapshot();
});

test('allows user to set chart subtitle', async () => {
  const chartSubtitle = 'CHART_SUBTITLE';
  const storeState = {
    chartEditor: {
      ...chartEditorInitialState,
      analysisResult: {
        query: {
          analysis_type: 'count',
        },
        results: 100,
      },
      visualization: {
        type: 'area',
        visualizationType: 'area',
        chartSettings: {
          curve: 'linear',
          stackMode: 'normal',
          groupMode: 'grouped',
        },
        widgetSettings: {},
      },
      editorSection: EditorSection.SETTINGS,
    },
  };
  const {
    wrapper: { getByPlaceholderText },
    store,
  } = render(storeState);

  store.clearActions();
  const titleInput = getByPlaceholderText(
    'widget_customization_heading_settings.subtitle_placeholder'
  );
  fireEvent.change(titleInput, { target: { value: chartSubtitle } });

  expect(store.getActions()).toMatchSnapshot();
});

test('allows user use chart name from saved query', async () => {
  const storeState = {
    chartEditor: {
      ...chartEditorInitialState,
      analysisResult: {
        query_name: 'QUERY_NAME',
        metadata: {
          display_name: 'QUERY NAME',
        },
        query: {
          analysis_type: 'count',
        },
        results: 100,
      },
      visualization: {
        type: 'area',
        visualizationType: 'area',
        chartSettings: {
          curve: 'linear',
          stackMode: 'normal',
          groupMode: 'grouped',
        },
        widgetSettings: {},
      },
      editorSection: EditorSection.SETTINGS,
    },
  };
  const {
    wrapper: { getByTestId },
  } = render(storeState);

  const inheritQueryNameInfo = getByTestId('inherit-query-name');
  expect(inheritQueryNameInfo).toBeInTheDocument();
});
