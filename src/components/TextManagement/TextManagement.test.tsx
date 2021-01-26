/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import TextManagement from './TextManagement';

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
    isHoverActive: false,
    onRemoveWidget: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <TextManagement {...props} />
    </Provider>
  );

  return {
    store,
    props,
    editorText,
    wrapper,
  };
};

test('renders inline text editor', () => {
  const {
    editorText,
    wrapper: { getByText },
  } = render({}, { isHoverActive: true });

  expect(getByText(editorText)).toBeInTheDocument();
});

test('allows user to open text editor', () => {
  const {
    store,
    wrapper: { getByText },
  } = render({}, { isHoverActive: true });

  const button = getByText('widget.edit_text');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
      Array [
        Object {
          "payload": Object {
            "id": "@widget-id",
          },
          "type": "@widgets/EDIT_TEXT_WIDGET",
        },
      ]
    `);
});

test('allows user to remove text widget', async () => {
  const {
    props,
    wrapper: { container, getByText },
  } = render({}, { isHoverActive: true });

  const button = container.querySelector(
    '[data-testid="remove-text-widget"] button'
  );
  fireEvent.click(button);

  const removeConfirmation = getByText('widget.remove_confirm_button');
  fireEvent.click(removeConfirmation);

  expect(props.onRemoveWidget).toHaveBeenCalled();
});

test('allows user to clone text widget', async () => {
  const {
    store,
    wrapper: { container },
  } = render({}, { isHoverActive: true });

  const button = container.querySelector(
    '[data-testid="clone-text-widget"] button'
  );
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "widgetId": "@widget-id",
        },
        "type": "@widgets/CLONE_WIDGET",
      },
    ]
  `);
});
