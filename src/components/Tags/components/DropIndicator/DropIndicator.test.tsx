import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import DropIndicator from './DropIndicator';

test('calls "onClick" handler', () => {
  const mockFn = jest.fn();
  const { getByTestId } = render(<DropIndicator onClick={mockFn} />);

  const element = getByTestId('drop-indicator');
  fireEvent.click(element);

  expect(mockFn).toHaveBeenCalled();
});

test('calls "onMouseOver" handler', () => {
  const mockFn = jest.fn();
  const { getByTestId } = render(<DropIndicator onMouseOver={mockFn} />);

  const element = getByTestId('drop-indicator');
  fireEvent.mouseOver(element);

  expect(mockFn).toHaveBeenCalled();
});

test('calls "onMouseLeave" handler', () => {
  const mockFn = jest.fn();
  const { getByTestId } = render(<DropIndicator onMouseLeave={mockFn} />);

  const element = getByTestId('drop-indicator');
  fireEvent.mouseLeave(element);

  expect(mockFn).toHaveBeenCalled();
});
