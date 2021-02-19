import React from 'react';
import { render as rtlRender } from '@testing-library/react';

import FiltersContent from './FiltersContent';

const filter = {
  propertyName: 'propertyName',
  propertyValue: 'propertyValue',
};

const render = (overProps: any = {}) => {
  const props = {
    data: [filter],
    ...overProps,
  };

  const wrapper = rtlRender(<FiltersContent {...props} />);

  return {
    props,
    wrapper,
  };
};

test('renders title', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText(filter.propertyName)).toBeInTheDocument();
});

test('not renders connector for single filter value', () => {
  const {
    wrapper: { queryByText },
  } = render();

  expect(queryByText('dashboard_timepicker.connector')).toBeNull();
});

test('renders titles and connector for multiple filters', () => {
  const data = [
    {
      propertyName: 'propertyName1',
      propertyValue: 'propertyValue1',
    },
    {
      propertyName: 'propertyName2',
      propertyValue: 'propertyValue2',
    },
  ];

  const {
    wrapper: { getByText },
  } = render({ data });

  data.forEach((el) => expect(getByText(el.propertyName)).toBeInTheDocument());
  expect(getByText('dashboard_timepicker.connector')).toBeInTheDocument();
});
