/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';

import Titles from './Titles';

const render = (overProps: any = {}) => {
  const settings = {
    title: {
      typography: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        fontFamily: 'Lato',
        fontColor: 'teal',
      },
    },
    subtitle: {
      typography: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        fontFamily: 'Lato',
        fontColor: 'aqua',
      },
    },
  };

  const props = {
    settings,
    onChange: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<Titles {...props} />);

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

test('allows user to set "fontSize" for widget titles', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('title-settings');
  const element = within(section).getByText(settings.title.typography.fontSize);

  fireEvent.click(element);
  const fontSizeElement = getByText('12');

  fireEvent.click(fontSizeElement);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    title: {
      typography: {
        ...settings.title.typography,
        fontSize: 12,
      },
    },
  });
});

test('allows user to set "bold" text for widget titles', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('title-settings');
  const element = within(section).getByTestId('bold-font-style');

  fireEvent.click(element);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    title: {
      typography: {
        ...settings.title.typography,
        fontWeight: 'bold',
      },
    },
  });
});

test('allows user to set "fontSize" for widget subtitles', () => {
  const {
    wrapper: { getByTestId, getByText },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('subtitle-settings');
  const element = within(section).getByText(
    settings.subtitle.typography.fontSize
  );

  fireEvent.click(element);
  const fontSizeElement = getByText('14');

  fireEvent.click(fontSizeElement);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    subtitle: {
      typography: {
        ...settings.subtitle.typography,
        fontSize: 14,
      },
    },
  });
});

test('allows user to set "italic" text for widget subtitles', () => {
  const {
    wrapper: { getByTestId },
    props: { settings, onChange },
  } = render();

  const section = getByTestId('subtitle-settings');
  const element = within(section).getByTestId('italic-font-style');

  fireEvent.click(element);

  expect(onChange).toHaveBeenCalledWith({
    ...settings,
    subtitle: {
      typography: {
        ...settings.subtitle.typography,
        fontStyle: 'italic',
      },
    },
  });
});
