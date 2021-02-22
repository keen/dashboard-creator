import React from 'react';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import TargetProperty from './TargetProperty';

const render = (overProps: any = {}) => {
  const props = {
    targetProperty: null,
    schema: {
      id: 'string',
      'user.gender': 'string',
    },
    schemaList: [
      { path: 'id', type: 'string' },
      { path: 'user.gender', type: 'string' },
    ],
    schemaTree: {
      id: ['id', 'string'],
      user: {
        gender: ['user.gender', 'string'],
      },
    },
    onChange: jest.fn(),
    isDisabled: false,
    hasError: false,
    ...overProps,
  };

  const wrapper = rtlRender(<TargetProperty {...props} />);

  return {
    props,
    wrapper,
  };
};

test('allows user to select target property', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const placeholder = getByText('filter_settings.target_property_placeholder');
  fireEvent.click(placeholder);

  const property = getByText('id');
  fireEvent.click(property);

  expect(props.onChange).toHaveBeenCalledWith('id');
});

test('do not allows user to select target property', () => {
  const {
    wrapper: { getByText, queryByText },
  } = render({ isDisabled: true });

  const placeholder = getByText('filter_settings.target_property_placeholder');
  fireEvent.click(placeholder);

  expect(queryByText('id')).not.toBeInTheDocument();
});

test('renders schema processing error', () => {
  const {
    wrapper: { getByText },
  } = render({ hasError: true });

  const placeholder = getByText('filter_settings.target_property_placeholder');
  fireEvent.click(placeholder);

  expect(
    getByText('filter_settings.schema_processing_error')
  ).toBeInTheDocument();
});

test('allows user to search property', async () => {
  const {
    wrapper: { getByText, getByTestId },
  } = render();

  const placeholder = getByText('filter_settings.target_property_placeholder');
  fireEvent.click(placeholder);

  const input = getByTestId('dropable-container-input');
  fireEvent.change(input, { target: { value: 'gender' } });

  await waitFor(() => getByText('gender'));

  expect(getByText('gender')).toBeInTheDocument();
});

test('renders empty search message', async () => {
  const {
    wrapper: { getByText, getByTestId },
  } = render();

  const placeholder = getByText('filter_settings.target_property_placeholder');
  fireEvent.click(placeholder);

  const input = getByTestId('dropable-container-input');
  fireEvent.change(input, { target: { value: 'property' } });

  await waitFor(() =>
    getByText('filter_settings.target_property_empty_search_results')
  );

  expect(
    getByText('filter_settings.target_property_empty_search_results')
  ).toBeInTheDocument();
});
