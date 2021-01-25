import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import PublicLink from './PublicLink';

import { AppContext } from '../../../../contexts';

const render = (storeState: any = {}, overProps: any = {}) => {
  const mockStore = configureStore([]);
  const dashboardId = 'dashboardId';
  const state = {
    dashboards: {
      metadata: {
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
            publicAccessKey: 'public-access-key',
          },
        ],
      },
    },
    ...storeState,
  };

  const store = mockStore({ ...state });

  const props = {
    dashboardId,
    ...overProps,
  };

  const wrapper = rtlRender(
    <AppContext.Provider
      value={
        {
          createSharedDashboardUrl: () => 'url',
        } as any
      }
    >
      <Provider store={store}>
        <PublicLink {...props} />
      </Provider>
    </AppContext.Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

test('allows user to regenerate key', () => {
  const {
    wrapper: { getByText },
  } = render();
  expect(getByText('dashboard_share.regenerate_link')).toBeInTheDocument();
});
