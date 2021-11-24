import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import QueryItem from './QueryItem';

const render = (overProps: any = {}) => {
  const props = {
    onClick: jest.fn(),
    name: 'name',
    visualization: {
      type: 'bar',
      chartSettings: {},
      widgetSettings: {},
    },
    ...overProps,
  };

  const wrapper = rtlRender(<QueryItem {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders query name', () => {
  const {
    wrapper: { getByText },
    props: { name },
  } = render();
  expect(getByText(name)).toBeInTheDocument();
});

test('renders visualization icon', () => {
  const {
    wrapper: { container },
  } = render();
  const icon = container.querySelector('svg');

  expect(icon).toBeInTheDocument();
});

test('calls "onClick" handler', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render();

  const element = getByTestId('query-item');
  fireEvent.click(element);

  expect(props.onClick).toHaveBeenCalled();
});

test('renders "tags" items', () => {
  const tags = ['@tag1', '@tag2', '@tag3'];

  const {
    wrapper: { getByText },
  } = render({ tags });

  tags.forEach((tag) => {
    expect(getByText(tag)).toBeInTheDocument();
  });
});

test('renders "cached" tag', () => {
  const cached = 4;

  const {
    wrapper: { getByText },
  } = render({ cached });

  const element = getByText(
    `query_picker.cached_label(${cached}query_picker.cached_units)`
  );

  expect(element).toBeInTheDocument();
});
