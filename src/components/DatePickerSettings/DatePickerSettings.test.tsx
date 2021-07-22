/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import DatePickerSettings from './DatePickerSettings';

const render = (storeState: any = {}, overProps: any = {}) => {
  const mockStore = configureStore([]);
  const state = {
    datePicker: {
      isEditorOpen: true,
      name: 'datePickerName',
      widgetConnections: [
        {
          widgetId: '@widget/01',
          isConnected: true,
          title: null,
          positionIndex: 1,
        },
        {
          widgetId: '@widget/02',
          isConnected: true,
          title: null,
          positionIndex: 2,
        },
      ],
    },
    ...storeState,
  };

  const store = mockStore({ ...state });

  const props = {
    onCancel: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <DatePickerSettings {...props} />
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

test('allows user to apply date picker widget settings', () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  const button = getByText('date_picker_settings.confirm_button');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "name": "datePickerName",
        },
        "type": "@date-picker/SET_NAME",
      },
      Object {
        "payload": undefined,
        "type": "@date-picker/APPLY_SETTINGS",
      },
    ]
  `);
});

test('allows user to cancel date picker widget configuration', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const button = getByText('date_picker_settings.cancel_button');
  fireEvent.click(button);

  expect(props.onCancel).toHaveBeenCalled();
});

test('shows date picker settings hint', () => {
  const {
    wrapper: { getByRole, getByText },
  } = render();

  const element = getByRole('dialog');
  fireEvent.mouseEnter(element);

  expect(getByText('date_picker_settings.tooltip_hint')).toBeInTheDocument();
});

test('renders message about empty connections list', () => {
  const {
    wrapper: { getByText },
  } = render({
    datePicker: {
      isEditorOpen: true,
      widgetConnections: [],
    },
  });

  expect(
    getByText('date_picker_settings.empty_connections')
  ).toBeInTheDocument();
});
