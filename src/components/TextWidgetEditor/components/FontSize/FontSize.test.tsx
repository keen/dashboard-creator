import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import FontSize from './FontSize';

const render = (overProps: any = {}) => {
  const props = {
    currentFontSize: '18',
    onUpdateFontSize: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<FontSize {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders current font size', () => {
  const {
    props,
    wrapper: { getByText },
  } = render({});

  expect(getByText(props.currentFontSize)).toBeInTheDocument();
});

test('allows user to edit font size', () => {
  const {
    props,
    wrapper: { getByTestId, getByText },
  } = render({});
  const fontSize = '24';

  const element = getByTestId('font-size-header');
  fireEvent.click(element);

  const option = getByText(fontSize);
  fireEvent.click(option);

  expect(props.onUpdateFontSize).toHaveBeenCalledWith(fontSize);
});
