import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ChartManagement from './ChartManagement';
import { WidgetErrors } from '../../modules/widgets';

const render = (overProps: any = {}) => {
  const props = {
    widgetId: '@widget/01',
    isHoverActive: true,
    onRemoveWidget: jest.fn(),
    error: null,
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

test('do not allows user to edit chart widget', () => {
  const {
    wrapper: { queryByText },
  } = render({
    error: {
      code: WidgetErrors.SAVED_QUERY_NOT_EXIST,
    },
  });

  const editButton = queryByText('widget.edit_chart');

  expect(editButton).not.toBeInTheDocument();
});

test('allows user to clone chart widget with applied inconsistent filter', () => {
  const {
    store,
    wrapper: { container },
  } = render({
    error: {
      code: WidgetErrors.INCONSISTENT_FILTER,
    },
  });

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

test('allows user to clone chart widget', () => {
  const {
    store,
    wrapper: { container },
  } = render({});

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

test('do not allows user to clone chart widget', () => {
  const {
    wrapper: { queryByTestId },
  } = render({
    error: {
      code: WidgetErrors.SAVED_QUERY_NOT_EXIST,
    },
  });

  expect(queryByTestId('clone-widget')).not.toBeInTheDocument();
});
