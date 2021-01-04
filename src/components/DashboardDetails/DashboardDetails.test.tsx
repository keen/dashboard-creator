import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import DashboardDetails from './DashboardDetails';

const render = (overProps: any = {}) => {
  const props = {
    tags: [],
    ...overProps,
  };

  const wrapper = rtlRender(<DashboardDetails {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders dashboard without title', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('dashboard_details.untitled_dashboard')).toBeInTheDocument();
});

test('renders dashboard title', () => {
  const props = {
    title: 'Marketing',
  };
  const {
    wrapper: { getByText },
  } = render(props);

  expect(getByText(props.title)).toBeInTheDocument();
});

test('renders tags', () => {
  const props = {
    tags: ['marketing'],
  };
  const {
    wrapper: { getByText },
  } = render(props);
  const [firstTag] = props.tags;

  expect(getByText(firstTag)).toBeInTheDocument();
});

test('allows user to back to dashboards list', () => {
  const props = {
    onBack: jest.fn(),
  };
  const {
    wrapper: { getByText },
  } = render(props);

  const element = getByText('dashboard_details.back');
  fireEvent.click(element);

  expect(props.onBack).toHaveBeenCalled();
});
