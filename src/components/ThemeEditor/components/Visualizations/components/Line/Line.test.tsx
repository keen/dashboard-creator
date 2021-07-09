import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { theme } from '@keen.io/charts';

import Line from './Line';

const render = (overProps: any = {}) => {
  const { line } = theme;

  const props = {
    settings: line,
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<Line {...props} />);

  return {
    wrapper,
    props,
  };
};

test('allows user to set line thickness', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('line-thickness');
  const element = within(section).getByText('7');

  fireEvent.click(element);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    strokeWidth: 7,
  });
});

test('allows user to set line markers radius', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('line-markers');
  const element = within(section).getByText('14');

  fireEvent.click(element);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    markRadius: 14,
  });
});
