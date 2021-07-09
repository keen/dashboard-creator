/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import DashboardSettings from './DashboardSettings';

const render = (storeState: any = {}, overProps: any = {}) => {
  const mockStore = configureStore([]);
  const dashboardId = '@dashboard-1';
  const state = {
    dashboards: {
      metadata: {
        isInitiallyLoaded: false,
        error: null,
        data: [
          {
            id: dashboardId,
            isPublic: false,
            lastModificationDate: 1610013350396,
            queries: 0,
            tags: [],
            title: 'Example Title',
            widgets: 0,
          },
          {
            id: '@dashboard-2',
            isPublic: false,
            lastModificationDate: 1610013350396,
            queries: 0,
            tags: [],
            title: 'Unique Title',
            widgets: 0,
          },
        ],
      },
      deleteConfirmation: {
        isVisible: false,
        dashboardId: null,
      },
      dashboardSettingsModal: {
        isVisible: true,
        dashboardId,
      },
      tagsPool: [],
      items: {},
    },
    ...storeState,
  };

  const store = mockStore({ ...state });

  const props = {
    onSave: jest.fn(),
    onClose: jest.fn(),
    dashboardId,
    tagsPool: [],
    dashboards: [],
    ...overProps,
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <DashboardSettings {...props} />
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

test('allows user to save dashboard', () => {
  const {
    wrapper: { getByTestId, getByText },
    props,
  } = render();

  const input = getByTestId('dashboard-name-input');
  fireEvent.change(input, { target: { value: 'New Dashboard' } });

  const button = getByText('dashboard_settings.save_dashboard_button');
  fireEvent.click(button);

  expect(props.onSave).toHaveBeenCalledWith('@dashboard-1', {
    id: '@dashboard-1',
    isPublic: false,
    lastModificationDate: 1610013350396,
    queries: 0,
    tags: [],
    title: 'New Dashboard',
    widgets: 0,
  });
});

test('allows user to close dashboard settings', () => {
  const {
    props,
    wrapper: { getByText },
  } = render();

  const button = getByText('dashboard_settings.cancel');
  fireEvent.click(button);

  expect(props.onClose).toHaveBeenCalled();
});

test('renders dashboard uniqueness name error', () => {
  const {
    wrapper: { getByText, getByTestId },
  } = render();

  const input = getByTestId('dashboard-name-input');
  fireEvent.change(input, { target: { value: 'Unique Title' } });

  const button = getByText('dashboard_settings.save_dashboard_button');
  fireEvent.click(button);

  expect(
    getByText('dashboard_settings.dashboard_unique_name_error')
  ).toBeInTheDocument();
});

test('renders dashboard name error', () => {
  const {
    wrapper: { getByText, getByTestId },
  } = render();

  const input = getByTestId('dashboard-name-input');
  fireEvent.change(input, { target: { value: '' } });

  const button = getByText('dashboard_settings.save_dashboard_button');
  fireEvent.click(button);

  expect(
    getByText('dashboard_settings.dashboard_name_error')
  ).toBeInTheDocument();
});
