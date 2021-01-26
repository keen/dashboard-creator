import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ChartManagement from './ChartManagement';

const render = (overProps: any = {}) => {
  const props = {
    widgetId: '@widget/01',
    isHoverActive: true,
    onRemoveWidget: jest.fn(),
    ...overProps,
  };

  const mockStore = configureStore([]);
  const store = mockStore({});

  const wrapper = rtlRender(
    <Provider store={store}>
      <ChartManagement {...props} />
    </Provider>
  );

  return {
    props,
    store,
    wrapper,
  };
};

test('allows user to edit chart widget', () => {
  const {
    store,
    wrapper: { getByText },
  } = render();

  const editButton = getByText('widget.edit_chart');
  fireEvent.click(editButton);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "id": "@widget/01",
          "usePersistedChartEditorState": false,
        },
        "type": "@widgets/EDIT_CHART_WIDGET",
      },
    ]
  `);
});

test('allows user to clone chart widget', () => {
  const {
    store,
    wrapper: { container },
  } = render();

  const button = container.querySelector('[data-testid="clone-widget"] button');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "widgetId": "@widget/01",
        },
        "type": "@widgets/CLONE_WIDGET",
      },
    ]
  `);
});
