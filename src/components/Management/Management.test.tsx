/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import {
  render as rtlRender,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import Management from './Management';

import { dashboardsMeta } from '../../modules/dashboards/fixtures';
import { Scopes } from '../../modules/app';

import { createBodyElementById } from '../../utils/test/createBodyElementById';
import { DROPDOWN_CONTAINER_ID } from '../../constants';

jest.mock('framer-motion', () => {
  const AnimatePresence = jest.fn(({ children }) => children);
  const motion = {
    div: forwardRef(({ children }, ref: React.LegacyRef<HTMLDivElement>) => (
      <div ref={ref}>{children}</div>
    )),
    tr: forwardRef(
      ({ children }, ref: React.LegacyRef<HTMLTableRowElement>) => (
        <tr ref={ref}>{children}</tr>
      )
    ),
    li: forwardRef(({ children }, ref: React.LegacyRef<HTMLLIElement>) => (
      <li ref={ref}>{children}</li>
    )),
    ul: forwardRef(({ children }, ref: React.LegacyRef<HTMLUListElement>) => (
      <ul ref={ref}>{children}</ul>
    )),
  };

  return {
    AnimatePresence,
    motion,
  };
});

const render = (storeState: any = {}, overProps: any = {}) => {
  const props = {
    ...overProps,
  };

  const state = {
    app: {
      user: {
        permissions: [],
      },
    },
    dashboards: {
      deleteConfirmation: {
        isVisible: false,
        dashboardId: null,
      },
      metadata: {
        isInitiallyLoaded: false,
        error: null,
        data: [],
      },
      tagsPool: [],
      tagsFilters: {
        showOnlyPublicDashboards: false,
        tags: [],
      },
    },
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const wrapper = rtlRender(
    <Provider store={store}>
      <Management {...props} />
    </Provider>
  );

  return {
    props,
    wrapper,
  };
};

afterEach(() => {
  cleanup();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  createBodyElementById(DROPDOWN_CONTAINER_ID);
});

test('renders notification about creating first dashboard in project', async () => {
  const storeState = {
    app: {
      user: {
        permissions: [Scopes.EDIT_DASHBOARD],
      },
    },
    dashboards: {
      deleteConfirmation: {
        isVisible: false,
        dashboardId: null,
      },
      metadata: {
        isInitiallyLoaded: true,
        error: null,
        data: [],
      },
      tagsPool: [],
      tagsFilters: {
        showOnlyPublicDashboards: false,
        tags: [],
      },
    },
  };
  const {
    wrapper: { findByText, queryByTestId },
  } = render(storeState);

  const createDashboardNotification = await findByText(
    'dashboard_management.empty_project'
  );
  const filters = queryByTestId('management-filters');

  expect(createDashboardNotification).toBeInTheDocument();
  expect(filters).toBeNull();
});

test('renders dashboards loading placeholder', () => {
  const {
    wrapper: { getByTestId },
  } = render();

  expect(getByTestId('dashboards-placeholder-grid')).toBeInTheDocument();
});

test('renders dashboards grid', () => {
  const storeState = {
    dashboards: {
      deleteConfirmation: {
        isVisible: false,
        dashboardId: null,
      },
      metadata: {
        isInitiallyLoaded: true,
        error: null,
        data: dashboardsMeta,
      },
      tagsPool: [],
      tagsFilters: {
        showOnlyPublicDashboards: false,
        tags: [],
      },
    },
  };
  const {
    wrapper: { getByTestId },
  } = render(storeState);

  expect(getByTestId('dashboards-grid')).toBeInTheDocument();
  expect(getByTestId('management-filters')).toBeInTheDocument();
});

test('allows user to search dashboards based on phrase', () => {
  const storeState = {
    dashboards: {
      deleteConfirmation: {
        isVisible: false,
        dashboardId: null,
      },
      metadata: {
        isInitiallyLoaded: true,
        error: null,
        data: dashboardsMeta,
      },
      tagsPool: [],
      tagsFilters: {
        showOnlyPublicDashboards: false,
        tags: [],
      },
    },
  };

  const {
    wrapper: { container, getByText, getAllByTestId },
  } = render(storeState);

  const searchInput = container.querySelector('input[type="text"]');
  fireEvent.change(searchInput, { target: { value: 'Dashboard 1' } });

  const dashboardItems = getAllByTestId('dashboard-item');

  expect(getByText('Dashboard 1')).toBeInTheDocument();
  expect(dashboardItems.length).toEqual(1);
});

test('renders empty search results message', () => {
  const storeState = {
    dashboards: {
      deleteConfirmation: {
        isVisible: false,
        dashboardId: null,
      },
      metadata: {
        isInitiallyLoaded: true,
        error: null,
        data: dashboardsMeta,
      },
      tagsPool: [],
      tagsFilters: {
        showOnlyPublicDashboards: false,
        tags: [],
      },
    },
  };

  const {
    wrapper: { container, getByText, queryAllByTestId },
  } = render(storeState);

  const searchInput = container.querySelector('input[type="text"]');
  fireEvent.change(searchInput, { target: { value: 'Empty search' } });

  const dashboardItems = queryAllByTestId('dashboard-item');

  expect(
    getByText('dashboard_management.empty_search_results')
  ).toBeInTheDocument();
  expect(dashboardItems.length).toEqual(0);
});

test('do not show filters and new dashboards button when dashboards are not loaded', () => {
  const storeState = {
    dashboards: {
      deleteConfirmation: {
        isVisible: false,
        dashboardId: null,
      },
      metadata: {
        isInitiallyLoaded: false,
        error: null,
        data: dashboardsMeta,
      },
      tagsPool: [],
      tagsFilters: {
        showOnlyPublicDashboards: false,
        tags: [],
      },
    },
  };

  const {
    wrapper: { queryByText },
  } = render(storeState);

  expect(
    queryByText('dashboard_management.create_dashboard')
  ).not.toBeInTheDocument();
  expect(queryByText('tags_filters.title')).not.toBeInTheDocument();
});
