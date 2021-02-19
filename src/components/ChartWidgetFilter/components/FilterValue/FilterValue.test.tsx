import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import FilterValue from './FilterValue';

const render = (overProps: any = {}) => {
  const props = {
    propertyValue: 'value',
    ...overProps,
  };

  const wrapper = rtlRender(<FilterValue {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders single filter value', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  expect(getByText(props.propertyValue)).toBeInTheDocument();
});

test('renders mulitple values', () => {
  const values = ['value1', 'value2', 'value3'];
  const {
    wrapper: { getByText },
  } = render({ propertyValue: values });

  values.forEach((value) => expect(getByText(value)).toBeInTheDocument());
});
