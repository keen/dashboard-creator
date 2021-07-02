import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { theme } from '@keen.io/charts';

import Axis from './Axis';

const render = (overProps: any = {}) => {
  const props = {
    settings: theme.axisX,
    sectionTitle: 'Axis',
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<Axis {...props} />);

  return {
    wrapper,
    props,
  };
};

test('allows user to set "fontSize" for axis labels', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('axis-settings');
  const element = within(section).getByText(
    settings.labels.typography.fontSize
  );

  fireEvent.click(element);
  const fontSizeElement = getByText('12');

  fireEvent.click(fontSizeElement);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    labels: {
      ...settings.labels,
      typography: {
        ...settings.labels.typography,
        fontSize: 12,
      },
    },
  });
});

test('allows user to set "bold" text for axis labels', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('axis-settings');
  const element = within(section).getByTestId('bold-font-style');

  fireEvent.click(element);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    labels: {
      ...settings.labels,
      typography: {
        ...settings.labels.typography,
        fontWeight: 'bold',
      },
    },
  });
});
