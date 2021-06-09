import React from 'react';
import { fireEvent, render as rtlRender } from '@testing-library/react';
import ColorSelector from './ColorSelector';

const render = (overProps: any = {}) => {
  const props = {
    color: 'blue',
    colorSuggestions: [],
    onColorChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<ColorSelector {...props} />);

  return {
    props,
    wrapper,
  };
};

HTMLCanvasElement.prototype.getContext = jest.fn();

test('should render color selector with defined color', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render();

  const element = getByTestId('color-selector');
  const style = window.getComputedStyle(element);

  expect(element).toBeInTheDocument();
  expect(style.backgroundColor).toEqual(props.color);
});

test('click on selector should open color picker', () => {
  const {
    wrapper: { getByTestId },
  } = render();

  const element = getByTestId('color-selector');
  fireEvent.click(element);

  expect(getByTestId('color-picker')).toBeInTheDocument();
});
