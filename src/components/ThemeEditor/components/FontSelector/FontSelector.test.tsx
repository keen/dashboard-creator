import React from 'react';
import { fireEvent, render as rtlRender } from '@testing-library/react';
import FontSelector from './FontSelector';
import { KEYBOARD_KEYS } from '../../constants';

const render = (overProps: any = {}) => {
  const props = {
    font: 'Lato',
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<FontSelector {...props} />);

  return {
    props,
    wrapper,
  };
};

test('should render initial font in selector', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  expect(getByText(props.font)).toBeInTheDocument();
});

test('should call onChange when user selects a font', () => {
  const {
    wrapper: { getByText, getByTestId },
    props,
  } = render();

  const initialFont = getByText(props.font);
  fireEvent.click(initialFont);

  const input = getByTestId('dropable-container-input');
  fireEvent.change(input, { target: { value: 'ro' } });

  const newFont = getByText('Roboto');
  fireEvent.click(newFont);

  expect(props.onChange).toHaveBeenCalledWith('Roboto');
});

test('should select font by using a keyboard', async () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const initialFont = getByText(props.font);
  fireEvent.click(initialFont);

  fireEvent.keyDown(document.activeElement, { keyCode: KEYBOARD_KEYS.DOWN });
  fireEvent.keyDown(document.activeElement, { keyCode: KEYBOARD_KEYS.DOWN });
  fireEvent.keyDown(document.activeElement, { keyCode: KEYBOARD_KEYS.DOWN });
  fireEvent.keyDown(document.activeElement, { keyCode: KEYBOARD_KEYS.ENTER });

  expect(props.onChange).toHaveBeenCalledWith('Lora');
});
