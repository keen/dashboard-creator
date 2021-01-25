import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import DeleteDisclaimer from './DeleteDisclaimer';
import { DISCLAIMERS } from './constants';

const render = (overProps: any = {}) => {
  const props = {
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<DeleteDisclaimer {...props} />);

  return {
    props,
    wrapper,
  };
};

test('allows user to accept disclaimer', () => {
  const {
    props,
    wrapper: { getByTestId },
  } = render();

  DISCLAIMERS.forEach(({ id }) => {
    const element = getByTestId(`disclaimer-${id}`);
    fireEvent.click(element);
  });

  expect(props.onChange).toHaveBeenCalledWith(true);
});
