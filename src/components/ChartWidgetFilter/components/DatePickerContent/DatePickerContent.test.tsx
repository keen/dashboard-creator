import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import DatePickerContent from './DatePickerContent';

const render = (overProps: any = {}) => {
  const props = {
    timeframe: 'this_7_days',
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
  const start = '2021-02-10T09:42:14.867Z';
  const end = '2021-02-19T09:42:14.867Z';
  const {
    wrapper: { getByText },
  } = render({ timeframe: { start, end } });

  expect(getByText('2021-02-10 10:42')).toBeInTheDocument();
  expect(getByText('dashboard_timepicker.separator')).toBeInTheDocument();
  expect(getByText('2021-02-19 10:42')).toBeInTheDocument();
});
