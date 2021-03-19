/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import HeadingSettings from './HeadingSettings';

import { createHeadingSettings } from '../../../../modules/chartEditor';

const render = (overProps: any = {}) => {
  const { title, subtitle } = createHeadingSettings();

  const props = {
    onUpdateTitleSettings: jest.fn(),
    onUpdateSubtitleSettings: jest.fn(),
    title,
    subtitle,
    ...overProps,
  };

  const wrapper = rtlRender(<HeadingSettings {...props} />);

  return {
    props,
    wrapper,
    title,
    subtitle,
  };
};

test('allows user to edit widget title', () => {
  const {
    wrapper: { getByPlaceholderText },
    props,
    title,
  } = render();

  const input = getByPlaceholderText(
    'widget_heading_settings.title_placeholder'
  );
  fireEvent.change(input, { target: { value: '@title' } });

  expect(props.onUpdateTitleSettings).toHaveBeenCalledWith({
    ...title,
    content: '@title',
  });
});

test('allows user to edit widget subtitle', () => {
  const {
    wrapper: { getByPlaceholderText },
    props,
    subtitle,
  } = render();

  const input = getByPlaceholderText(
    'widget_heading_settings.subtitle_placeholder'
  );
  fireEvent.change(input, { target: { value: '@subtitle' } });

  expect(props.onUpdateSubtitleSettings).toHaveBeenCalledWith({
    ...subtitle,
    content: '@subtitle',
  });
});
