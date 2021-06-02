import React from 'react';
import { fireEvent, render as rtlRender } from '@testing-library/react';
import ThemeSlider from './ThemeSlider';

const intervals = [{ minimum: 0, maximum: 10, step: 1 }];
const ticks = [
  { label: '0', position: '0%' },
  { label: '5', position: '50%' },
  { label: '10', position: '100%' },
];

const render = (overProps: any = {}) => {
  const props = {
    intervals,
    ticks,
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<ThemeSlider {...props} />);

  return {
    props,
    wrapper,
  };
};

test('should call onChange when user selects a value', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const label = getByText('5');
  fireEvent.click(label);

  expect(props.onChange).toHaveBeenCalledWith(5);
});
