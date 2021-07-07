import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { theme } from '@keen.io/charts';

import Funnel from './Funnel';

const render = (overProps: any = {}) => {
  const { funnel } = theme;

  const props = {
    settings: funnel,
    onChange: jest.fn(),
    colorSuggestions: [],
    ...overProps,
  };

  const wrapper = rtlRender(<Funnel {...props} />);

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

test('allows user to set "fontSize" for step values', async () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('funnel-value');
  const element = within(section).getByText(
    settings.header.value.typography.fontSize
  );

  fireEvent.click(element);
  const fontSizeElement = getByText('18');

  fireEvent.click(fontSizeElement);

  const updatedSettings = {
    ...settings,
    header: {
      ...settings.header,
      value: {
        ...settings.header.value,
        typography: {
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontColor: settings.header.value.typography.fontColor,
          fontSize: 18,
        },
      },
    },
  };

  expect(onChange).toHaveBeenCalledWith(updatedSettings);
});

test('allows user to set "bold" text for funnel step label', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('funnel-label');
  const element = within(section).getByTestId('bold-font-style');

  fireEvent.click(element);

  const updatedSettings = {
    ...settings,
    header: {
      ...settings.header,
      title: {
        ...settings.header.title,
        typography: {
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontColor: settings.header.title.typography.fontColor,
          fontSize: settings.header.title.typography.fontSize,
        },
      },
    },
  };

  expect(onChange).toHaveBeenCalledWith(updatedSettings);
});

test('allows user to set "italic" text for funnel step badge', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('funnel-badge');
  const element = within(section).getByTestId('italic-font-style');

  fireEvent.click(element);

  const updatedSettings = {
    ...settings,
    header: {
      ...settings.header,
      badge: {
        ...settings.header.badge,
        typography: {
          fontStyle: 'italic',
          fontWeight: 'normal',
          fontColor: settings.header.badge.typography.fontColor,
          fontSize: settings.header.badge.typography.fontSize,
        },
      },
    },
  };

  expect(onChange).toHaveBeenCalledWith(updatedSettings);
});
