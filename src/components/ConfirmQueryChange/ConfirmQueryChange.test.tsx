import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import ConfirmQueryChange from './ConfirmQueryChange';

afterEach(() => {
  mockAllIsIntersecting(false);
});

beforeEach(() => {
  mockAllIsIntersecting(true);
});

const render = (overProps: any = {}) => {
  const props = {
    isOpen: true,
    ...overProps,
  };

  const mockStore = configureStore([]);
  const store = mockStore({
    dashboards: {
      connectedDashboards: {
        isLoading: false,
        isError: false,
        items: [],
      },
    },
  });

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
        "type": "chartEditor/queryUpdateConfirmationMounted",
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

  const button = getByText('confirm_query_change.update_save_query');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "chartEditor/confirmSaveQueryUpdate",
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

  const element = getByText('confirm_query_change.update_ad_hoc_query');
  fireEvent.click(element);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "chartEditor/useQueryForWidget",
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
        "type": "chartEditor/hideQueryUpdateConfirmation",
      },
    ]
  `);
});
