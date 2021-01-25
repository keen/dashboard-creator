import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import EmbedCode from './EmbedCode';

import { AppContext } from '../../../../contexts';

const render = (overProps: any = {}) => {
  const dashboardId = 'dashboardId';

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
          },
        } as any
      }
    >
      <EmbedCode {...props} />
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
