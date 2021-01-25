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

test('allows user to chart edit widget', () => {
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
