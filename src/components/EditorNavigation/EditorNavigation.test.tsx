import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import EditorNavigation from './EditorNavigation';

import { Scopes } from '../../modules/app';

const render = (overProps: any = {}, storeState: any = {}) => {
  const props = {
    title: null,
    isPublic: false,
    tags: [],
    onBack: jest.fn(),
    ...overProps,
  };

  const mockStore = configureStore([]);
  const store = mockStore({
    dashboards: {
      metadata: {
        isInitiallyLoaded: false,
        error: null,
        data: [],
        isSavingMetadata: false,
        isRegeneratingAccessKey: false,
      },
    },
    app: {
      activeDashboardId: '@dashboard/01',
      user: {
        permissions: [Scopes.SHARE_DASHBOARD],
      },
    },
    ...storeState,
  });

  const wrapper = rtlRender(
    <Provider store={store}>
      <EditorNavigation {...props} />
    </Provider>
  );

  return {
    props,
    store,
    wrapper,
  };
};

test('renders "share dashboard" button', () => {
  const {
    wrapper: { getByTestId },
  } = render();
  const button = getByTestId('share-dashboard');

  expect(button).toBeInTheDocument();
});

test('do not renders "share dashboard" button for user without privileges', () => {
  const {
    wrapper: { queryByTestId },
  } = render(
    {},
    {
      dashboards: {
        metadata: {
          isInitiallyLoaded: false,
          error: null,
          data: [],
          isSavingMetadata: false,
          isRegeneratingAccessKey: false,
        },
      },
      app: {
        activeDashboardId: '@dashboard/01',
        user: {
          permissions: [],
        },
      },
    }
  );
  const button = queryByTestId('share-dashboard');

  expect(button).not.toBeInTheDocument();
});
