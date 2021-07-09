import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { theme } from '@keen.io/charts';

import Table from './Table';

const render = (overProps: any = {}) => {
  const { table } = theme;

  const props = {
    settings: table,
    onChange: jest.fn(),
    colorSuggestions: [],
    ...overProps,
  };

  const wrapper = rtlRender(<Table {...props} />);

  return {
    wrapper,
    props,
  };
};

beforeEach(() => {
  Element.prototype.getBoundingClientRect = jest
    .fn()
    .mockImplementation(() => ({
      x: 0,
      y: 0,
      height: 200,
    }));
});

test('allows user to set "fontSize" for header labels', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('table-header');
  const element = within(section).getByText(
    settings.header.typography.fontSize
  );

  fireEvent.click(element);
  const fontSizeElement = getByText('17');

  fireEvent.click(fontSizeElement);

  const updatedSettings = {
    ...settings,
    header: {
      typography: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontColor: settings.header.typography.fontColor,
        fontSize: 17,
      },
    },
  };

  expect(onChange).toHaveBeenCalledWith(updatedSettings);
});

test('allows user to set "bold" text for table values', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('table-values');
  const element = within(section).getByTestId('bold-font-style');

  fireEvent.click(element);

  const updatedSettings = {
    ...settings,
    body: {
      ...settings.body,
      typography: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontColor: settings.body.typography.fontColor,
        fontSize: settings.body.typography.fontSize,
      },
    },
  };

  expect(onChange).toHaveBeenCalledWith(updatedSettings);
});
