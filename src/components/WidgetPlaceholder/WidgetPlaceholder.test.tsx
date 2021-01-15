import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import WidgetPlaceholder from './WidgetPlaceholder';

const render = (overProps: any = {}) => {
  const props = {
    ...overProps,
    iconType: 'arrow-up',
  };

  const wrapper = rtlRender(<WidgetPlaceholder {...props} />);

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
