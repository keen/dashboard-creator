import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import Tags from './Tags';

const render = (overProps: any = {}) => {
  const props = {
    tags: ['tag 1', 'tag 2', 'tag 3'],
    extraTag: 'Cached(4h)',
    ...overProps,
  };

  const wrapper = rtlRender(<Tags {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders extra label dashboard', () => {
  const {
    wrapper: { getByText },
  } = render();
  expect(getByText('Cached(4h)')).toBeInTheDocument();
});

test('renders dashboard labels', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  props.tags.forEach((tag) => expect(getByText(tag)).toBeInTheDocument());
});
