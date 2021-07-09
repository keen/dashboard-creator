import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { theme } from '@keen.io/charts';

import Metric from './Metric';

const render = (overProps: any = {}) => {
  const { metric } = theme;

  const props = {
    settings: metric,
    onChange: jest.fn(),
    colorSuggestions: [],
    ...overProps,
  };

  const wrapper = rtlRender(<Metric {...props} />);

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

test('allows user to set "fontSize" for primary value', async () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('metric-primary-value');
  const element = within(section).getByText(settings.value.typography.fontSize);

  fireEvent.click(element);
  const fontSizeElement = getByText('55');

  fireEvent.click(fontSizeElement);

  const updatedSettings = {
    ...settings,
    value: {
      typography: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontColor: settings.value.typography.fontColor,
        fontSize: 55,
      },
    },
  };

  expect(onChange).toHaveBeenCalledWith(updatedSettings);
});

test('allows user to set "bold" text for secondary value', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('metric-secondary-value');
  const element = within(section).getByTestId('bold-font-style');

  fireEvent.click(element);

  const updatedSettings = {
    ...settings,
    excerpt: {
      ...settings.excerpt,
      typography: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontColor: settings.excerpt.typography.fontColor,
        fontSize: settings.excerpt.typography.fontSize,
      },
    },
  };

  expect(onChange).toHaveBeenCalledWith(updatedSettings);
});
