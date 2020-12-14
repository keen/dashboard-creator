import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { EditorContext } from '../../contexts';

import ChartWidget from './ChartWidget';
import { GridSize, WidgetType } from '../../types';

const id = 'widget-1';

const render = (storeState: any = {}, overProps: any = {}) => {
  const props = {
    id,
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
    widgets: {
      items: {
        [id]: {
          widget: {
            id,
            type: 'visualization',
            query: 'test',
            position: {
              x: 0,
              y: 0,
              w: 3,
              h: 7,
            },
            settings: {
              visualizationType: 'visualization',
              chartSettings: {},
              widgetSettings: {},
            },
          },
          data: {},
          isConfigured: true,
          isInitialized: true,
          isLoading: false,
          error: null,
        },
      },
    },
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const initialContext = {
    editorPubSub: {
      publish: () => jest.fn(),
      subscribe: () => jest.fn(),
      subscriptions: [],
    },
    gridSize: {
      cols: 10,
      containerWidth: 1200,
      margin: [10, 10],
    } as GridSize,
    droppableWidget: 'text' as WidgetType,
    setGridSize: jest.fn(),
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <EditorContext.Provider value={initialContext}>
        <ChartWidget {...props} />
      </EditorContext.Provider>
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

test('render ChartWidget container', () => {
  const {
    wrapper: { getByTestId },
  } = render();
  const container = getByTestId('chart-widget-container');
  expect(container).toBeInTheDocument();
});

test('render chart placeholder', () => {
  const storeState = {
    widgets: {
      items: {
        [id]: {
          widget: {
            id,
            type: 'visualization',
            query: 'test',
            position: {
              x: 0,
              y: 0,
              w: 3,
              h: 7,
            },
            settings: {
              visualizationType: 'visualization',
              chartSettings: {},
              widgetSettings: {},
            },
          },
          data: {},
          isConfigured: false,
          isInitialized: true,
          isLoading: false,
          error: null,
        },
      },
    },
  };
  const {
    wrapper: { getByTestId },
  } = render(storeState);
  const placeholder = getByTestId('chart-placeholder');
  expect(placeholder).toBeInTheDocument();
});

test('render loader', () => {
  const storeState = {
    widgets: {
      items: {
        [id]: {
          widget: {
            id,
            type: 'visualization',
            query: 'test',
            position: {
              x: 0,
              y: 0,
              w: 3,
              h: 7,
            },
            settings: {
              visualizationType: 'visualization',
              chartSettings: {},
              widgetSettings: {},
            },
          },
          data: {},
          isConfigured: true,
          isInitialized: false,
          isLoading: true,
          error: null,
        },
      },
    },
  };
  const {
    wrapper: { getByTestId },
  } = render(storeState);
  const loader = getByTestId('chart-widget-loader');
  expect(loader).toBeInTheDocument();
});
