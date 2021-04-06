import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import CreateFirstDashboard from './CreateFirstDashboard';

const render = (overProps: any = {}) => {
  const props = {
    isVisible: true,
    onClick: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<CreateFirstDashboard {...props} />);

  return {
    props,
    wrapper,
  };
};

test('allows user to create new dashboard', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const element = getByText('dashboard_management.empty_project');
  fireEvent.click(element);

  expect(props.onClick).toHaveBeenCalled();
});

test('do not renders notification', () => {
  const {
    wrapper: { queryByText },
  } = render({ isVisible: false });

  expect(
    queryByText('dashboard_management.empty_project')
  ).not.toBeInTheDocument();
});
