import React from 'react';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { dashboardsMeta } from '../../modules/dashboards/fixtures';

import DashboardViewSwitch from './DashboardViewSwitch';

const render = (overProps: any = {}) => {
  const mockStore = configureStore([]);
  const store = mockStore({
    app: {
      activeDashboard: '@dashboard/01',
    },
    dashboards: {
      metadata: {
        data: dashboardsMeta,
      },
    },
  });

  const props = {
    ...overProps,
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <DashboardViewSwitch {...props} />
    </Provider>
  );
  return {
    props,
    wrapper,
  };
};

test('renders dashboard switch without title', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('dashboard_details.untitled_dashboard')).toBeInTheDocument();
});

test('renders dashboard switch with title', () => {
  const {
    wrapper: { getByText },
  } = render({
    title: 'New dashboard',
  });

  expect(getByText('New dashboard')).toBeInTheDocument();
});

test('renders dashboard switch with dropdown', () => {
  const {
    wrapper: { getByText },
  } = render();

  const dashboardSwitch = getByText('dashboard_details.untitled_dashboard');
  fireEvent.click(dashboardSwitch);

  waitFor(() => {
    expect(getByText('dashboard_details.new_dashboard')).toBeInTheDocument();
    expect(getByText('dashboard_details.all_dashboards')).toBeInTheDocument();
  });
});

test('renders dashboard switch with dropdown and allows users to search dashboard based on phrase', () => {
  const {
    wrapper: { getAllByTestId, getByText, getByRole },
  } = render();

  const dashboardSwitch = getByText('dashboard_details.untitled_dashboard');
  fireEvent.click(dashboardSwitch);

  waitFor(() => {
    const searchInput = getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Dashboard 1' } });

    const dashboardItems = getAllByTestId('dashboard-item');

    expect(getByText('Dashboard 1')).toBeInTheDocument();
    expect(dashboardItems.length).toEqual(1);
  });
});

test('renders dashboard switch with dropdown and renders empty search', () => {
  const {
    wrapper: { queryAllByTestId, getByText, getByRole },
  } = render();

  const dashboardSwitch = getByText('dashboard_details.untitled_dashboard');
  fireEvent.click(dashboardSwitch);

  waitFor(() => {
    const searchInput = getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Empty search' } });

    const dashboardItems = queryAllByTestId('dashboard-item');

    expect(getByText('dashboard_details.empty_search')).toBeInTheDocument();
    expect(dashboardItems.length).toEqual(0);
  });
});
