import React from 'react';
import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { render as rtlRender, waitFor } from '@testing-library/react';

import { APIContext } from '../../../../contexts';

import Thumbnail from './Thumbnail';

const render = (overProps: any = {}, blobApiOverride: any = {}) => {
  const props = {
    dashboardId: '@dashboard/id',
    useDefaultThumbnail: false,
    ...overProps,
  };

  const blobApi = {
    getThumbnailByDashboardId: jest.fn(),
    ...blobApiOverride,
  };

  const wrapper = rtlRender(
    <APIContext.Provider value={{ blobApi }}>
      <Thumbnail {...props} />
    </APIContext.Provider>
  );

  return {
    props,
    blobApi,
    wrapper,
  };
};

test('renders default thumbnail', () => {
  const {
    blobApi,
    wrapper: { getByTestId },
  } = render({ useDefaultThumbnail: true });

  expect(getByTestId('default-thumbnail')).toBeInTheDocument();
  expect(blobApi.getThumbnailByDashboardId).not.toHaveBeenCalled();
});

test('fetch and renders thumbnail from API', async () => {
  const image = '@image_blob';
  const blobApiMock = {
    getThumbnailByDashboardId: jest.fn().mockResolvedValue({
      status: OK,
      text: () => Promise.resolve(image),
    }),
  };

  const {
    blobApi,
    wrapper: { getByTestId },
    props: { dashboardId },
  } = render({}, blobApiMock);

  await waitFor(() => {
    expect(blobApi.getThumbnailByDashboardId).toHaveBeenCalledWith(dashboardId);
    expect(getByTestId('thumbnail-image')).toHaveAttribute('src', image);
  });
});

test('renders default thumbnail for API error ', async () => {
  const blobApiMock = {
    getThumbnailByDashboardId: jest.fn().mockRejectedValue({
      status: INTERNAL_SERVER_ERROR,
    }),
  };

  const {
    blobApi,
    wrapper: { getByTestId },
    props: { dashboardId },
  } = render({}, blobApiMock);

  await waitFor(() => {
    expect(blobApi.getThumbnailByDashboardId).toHaveBeenCalledWith(dashboardId);
    expect(getByTestId('default-thumbnail')).toBeInTheDocument();
  });
});
