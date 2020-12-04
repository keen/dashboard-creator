import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import Thumbnail from './Thumbnail';

const render = (overProps: any = {}) => {
  const props = {
    useDefaultThumbnail: true,
    defaultThumbnailMessage: 'Default messasge',
    ...overProps,
  };

  const wrapper = rtlRender(<Thumbnail {...props} />);

  return {
    props,
    wrapper,
  };
};

test('should render Gradient', () => {
  const {
    wrapper: { getByTestId },
  } = render();
  const gradient = getByTestId('thumbnail-gradient');

  expect(gradient).toBeInTheDocument();
});

test('should render default thumbnail', () => {
  const {
    wrapper: { getByTestId },
  } = render();
  const thumbnail = getByTestId('default-thumbnail');

  expect(thumbnail).toBeInTheDocument();
});

test('should render thumbnail message', () => {
  const {
    wrapper: { getByText },
    props: { defaultThumbnailMessage },
  } = render();
  expect(getByText(defaultThumbnailMessage)).toBeInTheDocument();
});

test('should render thumbnail placeholder', () => {
  const {
    wrapper: { getByTestId },
  } = render({ useDefaultThumbnail: false });
  const placeholder = getByTestId('thumbnail-placeholder');
  expect(placeholder).toBeInTheDocument();
});
