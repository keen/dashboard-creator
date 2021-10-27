import React from 'react';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

jest.mock('uuid', () => {
  return {
    v4: () => '@dashboard/01',
  };
});

import { dashboardsMeta } from '../../modules/dashboards/fixtures';

import { createDashboard } from '../../modules/dashboards';
import { Scopes } from '../../modules/app';

import DashboardViewSwitch from './DashboardViewSwitch';

const render = (overProps: any = {}, storeState: any = {}) => {
  const mockStore = configureStore([]);
  const store = mockStore({
    app: {
      activeDashboard: '@dashboard/01',
      user: {
        permissions: [],
      },
    },
    dashboards: {
      metadata: {
        data: dashboardsMeta,
      },
    },
    ...storeState,
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
    store,
    props,
    wrapper,
  };
};

mockAllIsIntersecting(true);

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

test('renders dashboard switch with dropdown', async () => {
  const {
    wrapper: { getByText, queryByText },
  } = render(
    {},
    {
      app: {
        user: {
          permissions: [Scopes.EDIT_DASHBOARD],
        },
      },
    }
  );

  const dashboardSwitch = getByText('dashboard_details.untitled_dashboard');
  fireEvent.click(dashboardSwitch);

  await waitFor(() => {
    expect(queryByText('dashboard_details.new_dashboard')).toBeInTheDocument();
    expect(queryByText('dashboard_details.all_dashboards')).toBeInTheDocument();
  });
});

test('renders dashboard switch with dropdown and allows users to search dashboard based on phrase', async () => {
  const {
    wrapper: { getAllByTestId, getByText, getByRole },
  } = render();

  const dashboardSwitch = getByText('dashboard_details.untitled_dashboard');
  fireEvent.click(dashboardSwitch);

  await waitFor(() => {
    const searchInput = getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Dashboard 1' } });

    const dashboardItems = getAllByTestId('dashboard-item');

    expect(getByText('Dashboard 1')).toBeInTheDocument();
    expect(dashboardItems.length).toEqual(1);
  });
});

test('renders dashboard switch with dropdown and renders empty search', async () => {
  const {
    wrapper: { queryAllByTestId, getByText, getByRole },
  } = render();

  const dashboardSwitch = getByText('dashboard_details.untitled_dashboard');
  fireEvent.click(dashboardSwitch);

  await waitFor(() => {
    const searchInput = getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Empty search' } });

    const dashboardItems = queryAllByTestId('dashboard-item');

    expect(getByText('dashboard_details.empty_search')).toBeInTheDocument();
    expect(dashboardItems.length).toEqual(0);
  });
});

test('do not allows user to create new dashbord without edit privileges', async () => {
  const {
    wrapper: { getByText, queryByText },
  } = render();

  const dashboardSwitch = getByText('dashboard_details.untitled_dashboard');
  fireEvent.click(dashboardSwitch);

  await waitFor(() => {
    const createDashbord = queryByText('dashboard_details.new_dashboard');
    expect(createDashbord).not.toBeInTheDocument();
  });
});

test('allows user to create new dashbord', async () => {
  const {
    wrapper: { getByText, queryByText },
    store,
  } = render(
    {},
    {
      app: {
        user: {
          permissions: [Scopes.EDIT_DASHBOARD],
        },
      },
    }
  );

  const dashboardSwitch = getByText('dashboard_details.untitled_dashboard');
  fireEvent.click(dashboardSwitch);

  await waitFor(() => {
    const dashboardButton = queryByText('dashboard_details.new_dashboard');

    store.clearActions();
    fireEvent.click(dashboardButton);

    expect(store.getActions()).toEqual([createDashboard('@dashboard/01')]);
  });
});
