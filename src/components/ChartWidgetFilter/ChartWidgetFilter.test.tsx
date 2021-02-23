/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render as rtlRender, cleanup } from '@testing-library/react';

import { AppContext } from '../../contexts';
import ChartWidgetFilter from './ChartWidgetFilter';

const widgetId = 'widget-1';
const datePickerId = 'datePicker-1';
const filterId = 'filter-1';

const render = (storeState: any = {}, overProps: any = {}) => {
  const props = {
    widgetId,
    ...overProps,
  };

  const state = {
    app: {
      activeDashboardId: 'dashboard',
    },
    theme: {
      dashboards: {
        dashboard: {},
      },
    },
    queries: {
      interimQueries: {
        [widgetId]: {
          query: {
            analysis_type: 'count_unique',
            event_collection: 'logins',
          },
          result: 200,
        },
      },
    },
    widgets: {
      items: {
        [widgetId]: {
          widget: {
            id: widgetId,
            type: 'visualization',
            query: 'test',
            position: {
              x: 0,
              y: 0,
              w: 3,
              h: 7,
            },
            datePickerId,
            settings: {
              visualizationType: 'bar',
              chartSettings: {
                layout: 'vertical',
              },
              widgetSettings: {},
            },
          },
          data: {},
          isConfigured: true,
          isInitialized: true,
          isLoading: false,
          error: null,
        },
        [datePickerId]: {
          isActive: true,
          data: {
            timezone: 'UTC',
            timeframe: 'this_7_days',
          },
        },
        [filterId]: {
          isActive: false,
          data: {
            propertyName: 'propertyName',
            propertyValue: 'propertyValue',
          },
        },
      },
    },
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const wrapper = rtlRender(
    <Provider store={store}>
      <AppContext.Provider
        value={
          {
            modalContainer: '#modal-root',
          } as any
        }
      >
        <ChartWidgetFilter {...props} />
      </AppContext.Provider>
    </Provider>
  );

  return {
    props,
    store,
    wrapper,
  };
};

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

test('renders widget filter for datepicker', () => {
  const {
    wrapper: { getByTestId },
  } = render();
  expect(getByTestId('widget-filter')).toBeInTheDocument();
});

test('renders widget filter for filters', () => {
  const state = {
    widgets: {
      items: {
        [widgetId]: {
          widget: {
            id: widgetId,
            type: 'visualization',
            query: 'test',
            position: {
              x: 0,
              y: 0,
              w: 3,
              h: 7,
            },
            datePickerId,
            filterIds: [filterId],
            settings: {
              visualizationType: 'bar',
              chartSettings: {
                layout: 'vertical',
              },
              widgetSettings: {},
            },
          },
          data: {},
          isConfigured: true,
          isInitialized: true,
          isLoading: false,
          error: null,
        },
        [datePickerId]: {
          isActive: true,
          data: {
            timezone: 'UTC',
            timeframe: 'this_7_days',
          },
        },
        [filterId]: {
          isActive: true,
          data: {
            propertyName: 'propertyName',
            propertyValue: 'propertyValue',
          },
        },
      },
    },
  };
  const {
    wrapper: { getAllByTestId },
  } = render(state);
  expect(getAllByTestId('widget-filter').length).toEqual(2);
});
