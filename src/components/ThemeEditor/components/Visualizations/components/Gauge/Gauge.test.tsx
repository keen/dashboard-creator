import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { theme } from '@keen.io/charts';

import Gauge from './Gauge';

const render = (overProps: any = {}) => {
  const { gauge } = theme;

  const props = {
    settings: gauge,
    onChange: jest.fn(),
    colorSuggestions: [],
    ...overProps,
  };

  const wrapper = rtlRender(<Gauge {...props} />);

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

test('allows user to set "fontSize" for primary value', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('gauge-primary-value');
  const element = within(section).getByText(settings.total.typography.fontSize);

  fireEvent.click(element);
  const fontSizeElement = getByText('27');

  fireEvent.click(fontSizeElement);

  const updatedSettings = {
    ...settings,
    total: {
      ...settings.total,
      typography: {
        fontColor: '#31627A',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 27,
      },
    },
  };

  expect(onChange).toHaveBeenCalledWith(updatedSettings);
});

test('allows user to set "bold" text for gauge range values', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('gauge-range-values');
  const element = within(section).getByTestId('bold-font-style');

  fireEvent.click(element);

  const updatedSettings = {
    ...settings,
    labels: {
      ...settings.labels,
      typography: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontColor: settings.labels.typography.fontColor,
        fontSize: settings.labels.typography.fontSize,
      },
    },
  };

  expect(onChange).toHaveBeenCalledWith(updatedSettings);
});
