/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import {
  render as rtlRender,
  waitFor,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { AppContext } from '../../contexts';

import Management from './Management';
import { dashboardsMeta } from '../../modules/dashboards/fixtures';

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
        editPrivileges: false,
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
      <AppContext.Provider
        value={
          {
            modalContainer: '#modal-root',
          } as any
        }
      >
        <Management {...props} />
      </AppContext.Provider>
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

beforeEach(() => {
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  }
});

test('renders notification about creating first dashboard in project', async () => {
  const storeState = {
    app: {
      user: {
        editPrivileges: true,
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
    wrapper: { getByTestId },
  } = render(storeState);

  waitFor(() =>
    expect(getByTestId('create-first-dashboard')).toBeInTheDocument()
  );
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
