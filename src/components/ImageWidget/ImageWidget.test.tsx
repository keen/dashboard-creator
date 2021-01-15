import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { PubSub } from '@keen.io/pubsub';

import { EditorContext } from '../../contexts';

import ImageWidget from './ImageWidget';
import { WidgetType } from '../../types';

const renderMock = jest.fn();
const destroyMock = jest.fn();

const id = 'widget-2';

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
            type: 'image',
            position: {
              x: 0,
              y: 0,
              w: 3,
              h: 7,
            },
            settings: {
              link: 'http://www.example.com/image.png',
            },
          },
          data: {},
          isConfigured: true,
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
    droppableWidget: 'image' as WidgetType,
    containerWidth: 1200,
    setContainerWidth: jest.fn(),
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <EditorContext.Provider value={initialContext}>
        <ImageWidget {...props} />
      </EditorContext.Provider>
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
    editorPubSub,
  };
};

beforeEach(() => {
  destroyMock.mockClear();
  renderMock.mockClear();
});

test('renders image placeholder', () => {
  const storeState = {
    widgets: {
      items: {
        [id]: {
          widget: {
            id,
            type: 'image',
            position: {
              x: 0,
              y: 0,
              w: 3,
              h: 7,
            },
            settings: { link: 'http://www.example.com/image.png' },
          },
          data: {},
          isConfigured: false,
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

test('renders image', () => {
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
              settings: { link: 'http://www.example.com/image.png' },
            },
          },
          data: {},
          isConfigured: true,
          error: null,
        },
      },
    },
  };
  const {
    wrapper: { getByTestId },
  } = render(storeState);
  const loader = getByTestId('image-widget');

  expect(loader).toBeInTheDocument();
});
