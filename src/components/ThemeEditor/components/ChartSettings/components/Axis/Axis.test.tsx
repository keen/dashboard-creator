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

beforeEach(() => {
  Element.prototype.getBoundingClientRect = jest
    .fn()
    .mockImplementation(() => ({
      x: 0,
      y: 0,
      height: 100,
    }));
});

test('allows user to set "fontSize" for axis labels', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('axis-labels-settings');
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

  const section = getByTestId('axis-labels-settings');
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

test('allows user to set "italic" text for axis titles', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('axis-titles-settings');
  const element = within(section).getByTestId('italic-font-style');

  fireEvent.click(element);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    title: {
      ...settings.title,
      typography: {
        ...settings.title.typography,
        fontStyle: 'italic',
      },
    },
  });
});

test('allows user to set "fontSize" for axis titles', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('axis-titles-settings');
  const element = within(section).getByText(settings.title.typography.fontSize);

  fireEvent.click(element);
  const fontSizeElement = getByText('12');

  fireEvent.click(fontSizeElement);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    title: {
      ...settings.title,
      typography: {
        ...settings.title.typography,
        fontSize: 12,
      },
    },
  });
});
