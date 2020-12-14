import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import ChartPlaceholder from './ChartPlaceholder';

const render = (overProps: any = {}) => {
  const props = {
    ...overProps,
  };

  const wrapper = rtlRender(<ChartPlaceholder {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders placeholder icon', () => {
  const {
    wrapper: { container },
  } = render();
  const svg = container.querySelector('svg');
  expect(svg).toBeInTheDocument();
});

test('renders ghost image version', () => {
  const {
    wrapper: { getByTestId },
  } = render({ isGhostImage: true });
  const style = window.getComputedStyle(getByTestId('chart-placeholder'));
  expect(style.transform).toEqual('translateX(-100%)');
});
