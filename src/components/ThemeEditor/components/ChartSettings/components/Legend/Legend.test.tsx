import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';

import Legend from './Legend';

const render = (overProps: any = {}) => {
  const settings = {
    legend: {
      typography: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        fontFamily: 'Lato',
        fontColor: 'teal',
      },
    },
  };

  const props = {
    settings,
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<Legend {...props} />);

  return {
    wrapper,
    props,
  };
};

<<<<<<< HEAD
beforeEach(() => {
  Element.prototype.getBoundingClientRect = jest
    .fn()
    .mockImplementation(() => ({
      x: 0,
      y: 0,
      height: 100,
    }));
});

=======
>>>>>>> 4948e35... chore: 🤖 unit tests for charts
test('allows user to set "fontSize" for legend labels', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('legend-settings');
  const element = within(section).getByText(
    settings.legend.typography.fontSize
  );

  fireEvent.click(element);
  const fontSizeElement = getByText('12');

  fireEvent.click(fontSizeElement);

  expect(onChange).toHaveBeenCalledWith({
    typography: {
      ...settings.legend.typography,
      fontSize: 12,
    },
  });
});

test('allows user to set "bold" text for legend labels', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('legend-settings');
  const element = within(section).getByTestId('bold-font-style');

  fireEvent.click(element);

  expect(onChange).toHaveBeenCalledWith({
    typography: {
      ...settings.legend.typography,
      fontWeight: 'bold',
    },
  });
});
