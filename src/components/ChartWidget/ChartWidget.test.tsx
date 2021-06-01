import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { PubSub } from '@keen.io/pubsub';
import { KeenDataviz } from '@keen.io/dataviz';

import { createDashboardSettings } from '../../modules/dashboards';
import { EditorContext } from '../../contexts';

import { RESIZE_WIDGET_EVENT } from '../../constants';

import ChartWidget from './ChartWidget';
import { WidgetType } from '../../types';

const renderMock = jest.fn();
const destroyMock = jest.fn();
const errorMock = jest.fn();

jest.mock('@keen.io/dataviz', () => {
  return {
    KeenDataviz: jest.fn().mockImplementation(() => {
      return { render: renderMock, destroy: destroyMock, error: errorMock };
    }),
  };
});

const id = 'widget-1';

const render = (
  storeState: any = {},
  overProps: any = {},
  isIntersecting = true
) => {
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
        dashboard: {
          theme: {},
          settings: createDashboardSettings(),
        },
      },
    },
    queries: {
      interimQueries: {},
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
      },
    },
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const editorPubSub = new PubSub();

  const initialContext = {
    editorPubSub,
    droppableWidget: 'text' as WidgetType,
    containerWidth: 1200,
    setContainerWidth: jest.fn(),
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <EditorContext.Provider value={initialContext}>
        <ChartWidget {...props} />
      </EditorContext.Provider>
    </Provider>
  );

  mockAllIsIntersecting(isIntersecting);

  return {
    store,
    props,
    wrapper,
    editorPubSub,
  };
};

beforeEach(() => {
  (KeenDataviz as any).mockClear();
  destroyMock.mockClear();
  errorMock.mockClear();
  renderMock.mockClear();
});

test('remount visualization after user resize widget', () => {
  const { editorPubSub } = render();

  editorPubSub.publish(RESIZE_WIDGET_EVENT, { id });

  expect(destroyMock).toHaveBeenCalled();
  expect(renderMock).toHaveBeenCalledTimes(2);
});

test('renders visualization', () => {
  render();

  expect(KeenDataviz).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'bar',
      presentationTimezone: null,
      settings: {
        layout: 'vertical',
        theme: {},
      },
      widget: {
        card: {
          backgroundColor: '#ffffff',
          borderColor: 'none',
          borderRadius: 0,
          borderWidth: 0,
          hasShadow: true,
        },
      },
    })
  );
});

test('do not renders visualization when widget is not in view', () => {
  const isIntersecting = false;
  render({}, {}, isIntersecting);

  expect(KeenDataviz).not.toHaveBeenCalled();
});

test('renders error', () => {
  const errorMessage = 'Invalid access key';
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
          isInitialized: true,
          isLoading: false,
          error: {
            message: errorMessage,
          },
        },
      },
    },
  };
  render(storeState);

  expect(errorMock).toHaveBeenCalledWith(errorMessage, undefined);
});

test('renders chart placeholder', () => {
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
  const placeholder = getByTestId('widget-placeholder');

  expect(placeholder).toBeInTheDocument();
});

test('renders loader', () => {
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
