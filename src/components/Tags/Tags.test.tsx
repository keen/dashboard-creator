import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import Tags from './Tags';

const render = (overProps: any = {}) => {
  const props = {
    tags: [
      {
        label: 'Cached(4h)',
        variant: 'green',
      },
      {
        label: 'tag 1',
        variant: 'purple',
      },
      {
        label: 'tag 2',
        variant: 'purple',
      },
    ],
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

  props.tags.forEach(({ label }) =>
    expect(getByText(label)).toBeInTheDocument()
  );
});
