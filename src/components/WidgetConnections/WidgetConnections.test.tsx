import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import WidgetConnections from './WidgetConnections';

const render = (overProps: any = {}) => {
  const props = {
    connections: [
      {
        title: '@connection/01',
        isConnected: false,
        id: '@id/01',
      },
      {
        title: '@connection/02',
        isConnected: true,
        id: '@id/02',
      },
    ],
    onUpdateConnection: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<WidgetConnections {...props} />);

  return {
    props,
    wrapper,
  };
};

test('allows user to enable widget connection', () => {
  const {
    props,
    wrapper: { getByText },
  } = render();

  const connection = getByText('@connection/01');
  fireEvent.click(connection);

  expect(props.onUpdateConnection).toHaveBeenCalledWith('@id/01', true);
});

test('allows user to disable widget connection', () => {
  const {
    props,
    wrapper: { getByText },
  } = render();

  const connection = getByText('@connection/02');
  fireEvent.click(connection);

  expect(props.onUpdateConnection).toHaveBeenCalledWith('@id/02', false);
});
