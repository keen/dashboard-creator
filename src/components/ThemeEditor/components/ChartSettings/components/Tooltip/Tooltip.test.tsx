import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { theme } from '@keen.io/charts';

import Tooltip from './Tooltip';

import { COLOR_MODES_ITEMS } from './constants';

const render = (overProps: any = {}) => {
  const { tooltip } = theme;
  const settings = {
    ...tooltip,
  };

  const props = {
    settings,
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<Tooltip {...props} />);

  return {
    wrapper,
    props,
  };
};

test('allows user to set "fontSize" for tooltip labels and values', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('tooltip-settings');
  const element = within(section).getByText(
    settings.labels.typography.fontSize
  );

  fireEvent.click(element);
  const fontSizeElement = getByText('16');

  fireEvent.click(fontSizeElement);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    labels: {
      typography: {
        ...settings.labels.typography,
        fontSize: 16,
      },
    },
    values: {
      typography: {
        ...settings.labels.typography,
        fontSize: 16,
      },
    },
  });
});

test('allows user to set "colorMode" for tooltip ', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('tooltip-settings');
  const element = within(section).getByText(COLOR_MODES_ITEMS[0].label);

  fireEvent.click(element);
  const colorModeElement = getByText(COLOR_MODES_ITEMS[1].label);

  fireEvent.click(colorModeElement);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    mode: COLOR_MODES_ITEMS[1].id,
  });
});
