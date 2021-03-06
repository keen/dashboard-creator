import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import WidgetCover from './WidgetCover';

const render = (overProps: any = {}) => {
  const props = {
    isHighlighted: false,
    isDetached: false,
    ...overProps,
  };

  const wrapper = rtlRender(<WidgetCover {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders title on cover', () => {
  const title = 'Title';
  const {
    wrapper: { getByText },
  } = render({ title });

  expect(getByText(title)).toBeInTheDocument();
});
