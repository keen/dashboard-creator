/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { render as rtlRender, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import Management from './Management';
import { dashbordsMeta } from '../../modules/dashboards/fixtures';

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

test('renders notification about creating first dashboard in project', async () => {
  const storeState = {
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
        data: dashbordsMeta,
      },
    },
  };
  const {
    wrapper: { getByTestId },
  } = render(storeState);

  expect(getByTestId('dashboards-grid')).toBeInTheDocument();
});
