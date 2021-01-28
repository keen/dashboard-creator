import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import PublicDashboardViewer from './PublicDashboardViewer';

import { DashboardError } from '../../modules/dashboards';

const render = (storeState: any = {}, overProps: any = {}) => {
  const props = {
    dashboardId: '@dashboard/01',
    ...overProps,
  };

  const state = {
    app: {
      activeDashboardId: 'dashboard',
    },
    dashboards: {
      items: {
        '@dashboard/01': {
          initialized: false,
          isSaving: false,
          settings: null,
          error: DashboardError.ACCESS_NOT_PUBLIC,
        },
      },
      metadata: {
        isInitiallyLoaded: true,
        error: null,
        data: [
          {
            id: '@dashboard/01',
            widgets: 5,
            queries: 0,
            title: 'Dashboard 1',
            tags: [],
            lastModificationDate: 1606895352390,
            isPublic: true,
          },
        ],
        isSavingMetadata: false,
      },
    },
    theme: {
      dashboards: {
        dashboard: {},
      },
    },
    widgets: {
      items: {},
    },
    ...storeState,
  };

  const mockStore = configureStore([]);
  const store = mockStore({ ...state });

  const wrapper = rtlRender(
    <Provider store={store}>
      <PublicDashboardViewer {...props} />
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

test('renders error notification', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(
    getByText('public_dashboard_errors.access_not_public_message')
  ).toBeInTheDocument();
});

test('renders dashboard title', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('Dashboard 1')).toBeInTheDocument();
});
