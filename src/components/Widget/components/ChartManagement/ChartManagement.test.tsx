import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import ChartManagement from './ChartManagement';

const render = (overProps: any = {}) => {
  const props = {
    isHoverActive: true,
    onRemoveWidget: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<ChartManagement {...props} />);

  return {
    props,
    wrapper,
  };
};

test('allows user to remove widget', () => {
  const {
    props,
    wrapper: { container, getByText },
  } = render();

  const button = container.querySelector('[data-testid="delete-chart"] button');
  fireEvent.click(button);

  const confirmButton = getByText('widget.remove_confirm_button');
  fireEvent.click(confirmButton);

  expect(props.onRemoveWidget).toHaveBeenCalled();
});
