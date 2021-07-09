import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { theme } from '@keen.io/charts';

import Grid from './Grid';

const render = (overProps: any = {}) => {
  const { gridX, gridY } = theme;
  const settings = {
    gridX,
    gridY,
  };

  const props = {
    settings,
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<Grid {...props} />);

  return {
    wrapper,
    props,
  };
};

test('renders color picker for grid element', () => {
  const {
    wrapper: { getByTestId },
  } = render();

  expect(getByTestId('color-selector')).toBeInTheDocument();
});
