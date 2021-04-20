import React from 'react';
import { fireEvent, render as rtlRender } from '@testing-library/react';
import TimeframeLabel from './TimeframeLabel';

const render = (overProps: any = {}) => {
  const props = {
    timeframe: 'this_14_days',
    timezone: 'UTC',
    onRemove: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<TimeframeLabel {...props} />);

  return {
    props,
    wrapper,
  };
};

test('should render relative timeframe', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('relative_time_label.label 14 days')).toBeInTheDocument();
});

test('should call onRemove handler', () => {
  const {
    wrapper: { getByTestId },
    props,
  } = render();
  const element = getByTestId('remove-handler');

  fireEvent.click(element);
  expect(props.onRemove).toHaveBeenCalled();
});

test('should render absolute timeframe', () => {
  const today = '2021-04-02T02:00:00';
  const yesterday = '2021-04-01T02:00:00';
  const {
    wrapper: { getByText },
  } = render({ timeframe: { start: yesterday, end: today } });

  expect(getByText('2021-04-01 02:00')).toBeInTheDocument();
  expect(getByText('2021-04-02 02:00')).toBeInTheDocument();
});
