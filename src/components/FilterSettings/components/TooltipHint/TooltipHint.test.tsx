/* eslint-disable react/display-name */
import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import TooltipHint from './TooltipHint';

const render = (overProps: any = {}) => {
  const props = {
    renderMessage: () => <span>message</span>,
    ...overProps,
  };

  const wrapper = rtlRender(<TooltipHint {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders tooltip with message', () => {
  const {
    wrapper: { getByTestId, getByText },
  } = render();

  const element = getByTestId('tooltip-hint');
  fireEvent.mouseEnter(element);

  expect(getByText('message')).toBeInTheDocument();
});
