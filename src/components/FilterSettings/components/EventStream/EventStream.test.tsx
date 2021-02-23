import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import EventStream from './EventStream';

const render = (overProps: any = {}) => {
  const props = {
    currentEventStream: null,
    eventStreams: ['logins', 'purchases', 'pageviews'],
    onChange: jest.fn(),
    isDisabled: false,
    ...overProps,
  };

  const wrapper = rtlRender(<EventStream {...props} />);

  return {
    props,
    wrapper,
  };
};

test('allows user to select event stream', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const placeholder = getByText('filter_settings.event_stream_placeholder');
  fireEvent.click(placeholder);

  const eventStream = getByText('purchases');
  fireEvent.click(eventStream);

  expect(props.onChange).toHaveBeenCalledWith('purchases');
});

test('do not allows user to open dropdown', () => {
  const {
    wrapper: { getByText, queryByText },
  } = render({ isDisabled: true });

  const placeholder = getByText('filter_settings.event_stream_placeholder');
  fireEvent.click(placeholder);

  expect(queryByText('logins')).not.toBeInTheDocument();
});

test('renders the current selected event stream', () => {
  const {
    wrapper: { getByText },
  } = render({ currentEventStream: 'logins' });

  expect(getByText('logins')).toBeInTheDocument();
});
