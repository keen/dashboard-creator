import React from 'react';
import moment from 'moment-timezone';
import { fireEvent, render as rtlRender } from '@testing-library/react';

import { TIMEFRAME_FORMAT } from '../../constants';

import TimeframeLabel from './TimeframeLabel';

const render = (overProps: any = {}) => {
  const props = {
    timeframe: 'this_14_days',
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
  const today = moment().format();
  const yesterday = moment().subtract(-1, 'days').format();
  const {
    wrapper: { getByText },
  } = render({ timeframe: { start: yesterday, end: today } });

  expect(getByText(moment(today).format(TIMEFRAME_FORMAT))).toBeInTheDocument();
  expect(
    getByText(moment(yesterday).format(TIMEFRAME_FORMAT))
  ).toBeInTheDocument();
});
