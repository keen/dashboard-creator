import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render as rtlRender } from '@testing-library/react';

import EmbedCode from './EmbedCode';

import { AppContext } from '../../../../contexts';

const render = (overProps: any = {}) => {
  const mockStore = configureStore([]);
  const dashboardId = 'dashboardId';

  const store = mockStore({});

  const props = {
    dashboardId,
    ...overProps,
  };

  const wrapper = rtlRender(
    <AppContext.Provider
      value={
        {
          project: {
            id: 'projectId',
            masterKey: 'masterKey',
          },
        } as any
      }
    >
      <Provider store={store}>
        <EmbedCode {...props} />
      </Provider>
    </AppContext.Provider>
  );

  return {
    props,
    wrapper,
  };
};

test('renders placeholder text', () => {
  const {
    wrapper: { getByText },
  } = render();
  expect(getByText('dashboard_share.embed_placeholder')).toBeInTheDocument();
});

test('allows user to download HTML code', () => {
  const {
    wrapper: { getByText },
  } = render({ isPublic: true });
  expect(getByText('dashboard_share.download_code')).toBeInTheDocument();
});
