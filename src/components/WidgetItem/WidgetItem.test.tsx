import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import WidgetItem from './WidgetItem';

const render = (overProps: any = {}) => {
  const props = {
    text: 'simple Text',
    ...overProps,
  };

  const wrapper = rtlRender(<WidgetItem {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders provided text', () => {
  const text = 'Arrow up';
  const {
    wrapper: { getByText },
  } = render({ icon: 'arrow-up', text });

  expect(getByText(text)).toBeInTheDocument();
});

test('do not renders the icon', () => {
  const {
    wrapper: { container },
  } = render({ text: 'text' });

  expect(container.querySelector('svg')).not.toBeInTheDocument();
});
