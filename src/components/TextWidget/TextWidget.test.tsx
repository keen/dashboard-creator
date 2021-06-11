/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import TextWidget from './TextWidget';

const render = (storeState: any = {}, overProps: any = {}) => {
  const mockStore = configureStore([]);
  const widgetId = '@widget-id';
  const editorText = '@editor-text';

  const state = {
    widgets: {
      items: {
        [widgetId]: {
          widget: {
            type: 'text',
            settings: {
              content: {
                blocks: [
                  {
                    key: '@key',
                    text: editorText,
                    type: 'unstyled',
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                  },
                ],
                entityMap: {},
              },
              textAlignment: 'left',
            },
          },
          isConfigured: true,
          isInitialized: true,
          isLoading: false,
          error: null,
          data: null,
        },
      },
    },
    ...storeState,
  };

  const store = mockStore({ ...state });

  const props = {
    id: widgetId,
    ...overProps,
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <TextWidget {...props} />
    </Provider>
  );

  return {
    store,
    props,
    editorText,
    wrapper,
  };
};

test('renders HTML content', () => {
  const {
    editorText,
    wrapper: { getByText },
  } = render();

  expect(getByText(editorText)).toBeInTheDocument();
});
