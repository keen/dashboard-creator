/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Provider } from 'react-redux';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';

import DashboardShare from './DashboardShare';

import { BlobAPI } from '../../api';

import { AppContext, APIContext } from '../../contexts';

const dashboardId = 'dashboardId';
const render = (
  storeState: any = {},
  keenAnalysisInstance: any = {},
  overProps: any = {}
) => {
  const mockStore = configureStore([]);
  const state = {
    dashboards: {
      metadata: {
        isInitiallyLoaded: false,
        error: null,
        data: [
          {
            id: dashboardId,
            isPublic: true,
            accessPublicKey: 'public-key',
            lastModificationDate: 1610013350396,
            queries: 0,
            tags: [],
            title: 'Example Title',
            widgets: 0,
          },
        ],
      },
      deleteConfirmation: {
        isVisible: false,
        dashboardId: null,
      },
      dashboardShareModal: {
        isVisible: true,
        dashboardId,
      },
      tagsPool: [],
      items: {},
    },
    ...storeState,
  };

  const accessKey = {
    is_active: true,
  };

  const keenAnalysis = {
    get: jest.fn().mockReturnThis(),
    auth: jest.fn().mockReturnThis(),
    url: jest.fn(),
    masterKey: jest.fn(),
    send: jest.fn().mockResolvedValue([accessKey]),
    ...keenAnalysisInstance,
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
          modalContainer: '#modal-root',
          createSharedDashboardUrl: () => 'url',
          project: {
            id: 'projectId',
            masterKey: 'masterKey',
          },
        } as any
      }
    >
      <APIContext.Provider value={{ keenAnalysis, blobApi: {} as BlobAPI }}>
        <Provider store={store}>
          <DashboardShare {...props} />
        </Provider>
      </APIContext.Provider>
    </AppContext.Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

afterEach(() => cleanup());

test('renders "Public Link" view by default', () => {
  const {
    wrapper: { getByText },
  } = render();
  expect(getByText('dashboard_share.message')).toBeInTheDocument();
});

test('renders "Embed HTML" view on tab click', () => {
  const {
    wrapper: { getByText },
  } = render();

  const tab = getByText('dashboard_share.embed_html');
  fireEvent.click(tab);

  expect(getByText('dashboard_share.embed_title')).toBeInTheDocument();
});

test('renders placeholder instead of code for non-public dashboard', () => {
  const state = {
    dashboards: {
      metadata: {
        data: [
          {
            id: dashboardId,
            isPublic: false,
            accessPublicKey: null,
            lastModificationDate: 1610013350396,
            queries: 0,
            tags: [],
            title: 'Example Title',
            widgets: 0,
          },
        ],
      },
    },
  };

  const {
    wrapper: { getByText },
  } = render({ ...state });

  const tab = getByText('dashboard_share.embed_html');
  fireEvent.click(tab);

  expect(getByText('dashboard_share.embed_placeholder')).toBeInTheDocument();
});

test('renders error message about problems with fetching access keys', async () => {
  const keenAnalysis = {
    send: jest.fn().mockRejectedValue({}),
  };

  const {
    wrapper: { getByText },
  } = render({}, keenAnalysis);

  await waitFor(() => {
    expect(
      getByText('dashboard_share.access_key_api_error')
    ).toBeInTheDocument();
  });
});

test('renders error message about not existing access key', async () => {
  const keenAnalysis = {
    send: jest.fn().mockResolvedValue([]),
  };

  const {
    wrapper: { getByText },
  } = render({}, keenAnalysis);

  await waitFor(() => {
    expect(
      getByText('dashboard_share.access_key_not_exist_error')
    ).toBeInTheDocument();
  });
});

test('renders error message about revoking access key', async () => {
  const keenAnalysis = {
    send: jest.fn().mockResolvedValue([{ is_active: false }]),
  };

  const {
    wrapper: { getByText },
  } = render({}, keenAnalysis);

  await waitFor(() => {
    expect(
      getByText('dashboard_share.access_key_revoke_error')
    ).toBeInTheDocument();
  });
});
