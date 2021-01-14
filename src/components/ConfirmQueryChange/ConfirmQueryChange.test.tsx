import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ConfirmQueryChange from './ConfirmQueryChange';

const render = (overProps: any = {}) => {
  const props = {
    isOpen: true,
    ...overProps,
  };

  const mockStore = configureStore([]);
  const store = mockStore({});

  const wrapper = rtlRender(
    <Provider store={store}>
      <ConfirmQueryChange {...props} />
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

jest.useFakeTimers();

test('notifies after mounting component', () => {
  const { store } = render();

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@chart-editor/QUERY_UPDATE_CONFIRMATION_MOUNTED",
      },
    ]
  `);
});

test('allows user to update saved query', () => {
  const {
    store,
    wrapper: { getByText },
  } = render();

  store.clearActions();

  const button = getByText('confirm_query_change.save');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@chart-editor/CONFIRM_SAVE_QUERY_UPDATE",
      },
    ]
  `);
});

test('allows user to convert saved query to ad-hoc query', () => {
  const {
    store,
    wrapper: { getByText },
  } = render();

  store.clearActions();

  const element = getByText('confirm_query_change.create_ad_hoc_query');
  fireEvent.click(element);

  const button = getByText('confirm_query_change.save');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@chart-editor/USE_QUERY_FOR_WIDGET",
      },
    ]
  `);
});

test('allows user to close query change confirmation modal', () => {
  const {
    store,
    wrapper: { getByText },
  } = render();

  store.clearActions();

  const cancel = getByText('confirm_query_change.cancel');
  fireEvent.click(cancel);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@chart-editor/HIDE_QUERY_UPDATE_CONFIRMATION",
      },
    ]
  `);
});
