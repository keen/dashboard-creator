import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import DatePickerContent from './DatePickerContent';

const render = (overProps: any = {}) => {
  const props = {
    timeframe: 'this_7_days',
    timezone: 'UTC',
    ...overProps,
  };

  const wrapper = rtlRender(<DatePickerContent {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders title', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(
    getByText('dashboard_timepicker.timeframe_modified')
  ).toBeInTheDocument();
});

test('renders relative timeframe', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(
    getByText('query_creator_relative_time_label.label 7 days')
  ).toBeInTheDocument();
});

test('renders absolute timeframe', () => {
  const start = '2021-04-02T02:00:00';
  const end = '2021-04-12T02:00:00';
  const {
    wrapper: { getByText },
  } = render({ timeframe: { start, end } });

  expect(getByText('2021-04-02 02:00')).toBeInTheDocument();
  expect(getByText('dashboard_timepicker.separator')).toBeInTheDocument();
  expect(getByText('2021-04-12 02:00')).toBeInTheDocument();
});
