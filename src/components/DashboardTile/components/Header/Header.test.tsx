import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import Header from './Header';

const render = (overProps: any = {}) => {
  const props = {
    title: 'Title',
    excerpt: 'Excerpt',
    ...overProps,
  };

  const wrapper = rtlRender(<Header {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders Header title', () => {
  const {
    wrapper: { getByText },
    props: { title },
  } = render();
  expect(getByText(title)).toBeInTheDocument();
});

test('renders Header excerpt', () => {
  const {
    wrapper: { getByText },
    props: { excerpt },
  } = render();
  expect(getByText(excerpt)).toBeInTheDocument();
});

test('renders label for public dashboard', () => {
  const {
    wrapper: { getByText },
  } = render({ isPublic: true });
  expect(getByText('Public')).toBeInTheDocument();
});

test('renders dashboard labels', () => {
  const labels = ['label1', 'label2', 'label3'];
  const {
    wrapper: { getByText },
  } = render({ tags: labels });

  labels.forEach((label) => expect(getByText(label)).toBeInTheDocument());
});

test('allows to render children', () => {
  const children = <span>children</span>;
  const {
    wrapper: { getByText },
  } = render({ children });

  expect(getByText('children')).toBeInTheDocument();
});
