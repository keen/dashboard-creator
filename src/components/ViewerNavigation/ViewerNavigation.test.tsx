import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ViewerNavigation from './ViewerNavigation';

const render = (overProps: any = {}) => {
  const props = {
    editPrivileges: false,
    onShowSettings: jest.fn(),
    onEditDashboard: jest.fn(),
    tags: [],
    title: null,
    ...overProps,
  };

  const state = {
    app: {
      activeDashboardId: '@dashboard/01',
    },
  };
  const mockStore = configureStore([]);
  const store = mockStore(state);

  const wrapper = rtlRender(
    <Provider store={store}>
      <ViewerNavigation {...props} />
    </Provider>
  );

  return {
    props,
    store,
    wrapper,
  };
};

test('do not allows user without privilages to edit dashboard ', () => {
  const {
    wrapper: { queryByText },
  } = render();

  expect(queryByText('viewer.edit_dashboard_button')).not.toBeInTheDocument();
});

test('do not allows user without privilages to open dashboard settings', () => {
  const {
    wrapper: { queryByTestId },
  } = render();

  expect(queryByTestId('dashboard-settings')).not.toBeInTheDocument();
});

test('allows user with privilages to open dashboard settings', () => {
  const {
    props,
    wrapper: { container },
  } = render({ editPrivileges: true });

  const button = container.querySelector(
    '[data-testid="dashboard-settings"] > *'
  );
  fireEvent.click(button);

  expect(props.onShowSettings).toHaveBeenCalled();
});

test('allows user with privilages to edit dashboard ', () => {
  const {
    props,
    wrapper: { getByText },
  } = render({ editPrivileges: true });

  const button = getByText('viewer.edit_dashboard_button');
  fireEvent.click(button);

  expect(props.onEditDashboard).toHaveBeenCalled();
});
