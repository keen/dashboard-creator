import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import ManagementNavigation from './ManagementNavigation';

const render = (overProps: any = {}) => {
  const props = {
    onCreateDashboard: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<ManagementNavigation {...props} />);

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

  const button = getByText('dashboard_management.create_dashboard');
  fireEvent.click(button);

  expect(props.onCreateDashboard).toHaveBeenCalled();
});

test('renders section title', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('dashboard_management.title')).toBeInTheDocument();
});

test('renders dashboards management description', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('dashboard_management.description')).toBeInTheDocument();
});
