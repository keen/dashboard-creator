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

test('allows user to remove widget', () => {
  const {
    props,
    wrapper: { container, getByText },
  } = render();

  const button = container.querySelector('[data-testid="delete-chart"] button');
  fireEvent.click(button);

  const confirmButton = getByText('widget.remove_confirm_button');
  fireEvent.click(confirmButton);

  expect(props.onRemoveWidget).toHaveBeenCalled();
});

test('allows user to edit widget', () => {
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
