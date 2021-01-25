import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import InputGroup from './InputGroup';

const render = (overProps: any = {}) => {
  const props = {
    value: 'input-value',
    ...overProps,
  };

  const wrapper = rtlRender(<InputGroup {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders input value', () => {
  const {
    wrapper: { getByRole },
    props,
  } = render();
  const input = getByRole('textbox') as HTMLInputElement;

  expect(input.value).toEqual(props.value);
});

test('allows user to copy input value', () => {
  const {
    wrapper: { getByText },
  } = render({ isPublic: true });
  expect(getByText('dashboard_share.copy')).toBeInTheDocument();
});
