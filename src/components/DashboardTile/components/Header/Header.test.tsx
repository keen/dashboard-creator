import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import Header from './Header';

const render = (overProps: any = {}) => {
  const props = {
    excerpt: 'Excerpt',
    ...overProps,
  };

  const wrapper = rtlRender(<Header {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders title placeholder', () => {
  const {
    wrapper: { getByText },
  } = render();
  expect(getByText('dashboard_tile.untitled_dashboard')).toBeInTheDocument();
});

test('renders Header title', () => {
  const title = 'Title';
  const {
    wrapper: { getByText },
  } = render({ title });
  expect(getByText(title)).toBeInTheDocument();
});

test('renders Header excerpt', () => {
  const {
    wrapper: { getByText },
    props: { excerpt },
  } = render();
  expect(getByText(excerpt)).toBeInTheDocument();
});

test('allows to render children', () => {
  const children = <span>children</span>;
  const {
    wrapper: { getByText },
  } = render({ children });

  expect(getByText('children')).toBeInTheDocument();
});
