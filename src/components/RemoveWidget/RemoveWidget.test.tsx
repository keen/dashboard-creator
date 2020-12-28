import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import RemoveWidget from './RemoveWidget';

const render = (overProps: any = {}) => {
  const props = {
    children: 'children',
    onConfirm: jest.fn(),
    onDismiss: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<RemoveWidget {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders children nodes', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('children')).toBeInTheDocument();
});

test('allows user to confirm remove widget', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const button = getByText('widget.remove_confirm_button');
  fireEvent.click(button);

  expect(props.onConfirm).toHaveBeenCalled();
});

test('allows user to dismiss remove widget', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const button = getByText('widget.remove_dismiss_button');
  fireEvent.click(button);

  expect(props.onDismiss).toHaveBeenCalled();
});
