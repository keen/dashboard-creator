import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import SearchDashboard from './SearchDashboard';

const render = (overProps: any = {}) => {
  const props = {
    searchPhrase: '',
    placeholder: 'placeholder',
    onChangePhrase: jest.fn(),
    onClearSearch: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<SearchDashboard {...props} />);

  return {
    wrapper,
    props,
  };
};

test('calls "onChangePhrase" handler with phrase', () => {
  const {
    wrapper: { container },
    props,
  } = render();
  const phrase = 'marketing';

  const input = container.querySelector('input');
  fireEvent.change(input, { target: { value: phrase } });

  expect(props.onChangePhrase).toHaveBeenCalledWith(phrase);
});

test('calls "onClearSearch" handler', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render({
    searchPhrase: 'phrase',
  });

  const element = getByTestId('clear-dashboard-search');
  fireEvent.click(element);

  expect(props.onClearSearch).toHaveBeenCalled();
});

test('set placeholder attribute for HTML Input element', () => {
  const {
    wrapper: { container },
    props,
  } = render();
  const input = container.querySelector('input');

  expect(input).toHaveAttribute('placeholder', props.placeholder);
});
