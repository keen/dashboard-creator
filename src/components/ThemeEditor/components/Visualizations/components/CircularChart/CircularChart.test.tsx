/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { theme } from '@keen.io/charts';

import CircularChart from './CircularChart';

const render = (overProps: any = {}) => {
  const { pie, donut } = theme;

  const props = {
    settings: {
      pie,
      donut,
    },
    onChange: jest.fn(),
    colorSuggestions: [],
    ...overProps,
  };

  const wrapper = rtlRender(<CircularChart {...props} />);

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
      height: 100,
    }));
});

test('allows user to set "fontSize" for values', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('circular-chart-values');
  const element = within(section).getByText(
    settings.donut.labels.typography.fontSize
  );

  fireEvent.click(element);
  const fontSizeElement = getByText('13');

  fireEvent.click(fontSizeElement);

  const {
    fontFamily: _pieFontFamily,
    ...pieLabelsTypography
  } = settings.pie.labels.typography;
  const {
    fontFamily: _donutFontFamily,
    ...donutLabelsTypography
  } = settings.donut.labels.typography;

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    pie: {
      labels: {
        ...settings.pie.labels,
        typography: {
          ...pieLabelsTypography,
          fontSize: 13,
        },
      },
    },
    donut: {
      ...settings.donut,
      labels: {
        ...settings.donut.labels,
        typography: {
          ...donutLabelsTypography,
          fontSize: 13,
        },
      },
    },
  });
});

test('allows user to set "bold" text for donut total label', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('donut-total-label');
  const element = within(section).getByTestId('bold-font-style');

  fireEvent.click(element);

  const {
    fontFamily: _donutFontFamily,
    ...donutLabelsTypography
  } = settings.donut.total.label.typography;

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    donut: {
      ...settings.donut,
      total: {
        ...settings.donut.total,
        label: {
          ...settings.donut.total.label,
          typography: {
            ...donutLabelsTypography,
            fontWeight: 'bold',
          },
        },
      },
    },
  });
});

test('allows user to set "italic" text for donut total value', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('donut-total-value');
  const element = within(section).getByTestId('italic-font-style');

  fireEvent.click(element);

  const {
    fontFamily: _donutFontFamily,
    ...donutLabelsTypography
  } = settings.donut.total.value.typography;

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    donut: {
      ...settings.donut,
      total: {
        ...settings.donut.total,
        value: {
          ...settings.donut.total.value,
          typography: {
            ...donutLabelsTypography,
            fontStyle: 'italic',
          },
        },
      },
    },
  });
});
