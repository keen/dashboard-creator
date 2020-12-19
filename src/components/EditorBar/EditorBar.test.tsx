import React from 'react';
import moment from 'moment';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import EditorBar from './EditorBar';

const render = (overProps: any = {}) => {
  const props = {
    onFinishEdit: jest.fn(),
    lastSaveTime: null,
    isSaving: false,
    ...overProps,
  };

  const wrapper = rtlRender(
    <EditorBar {...props}>
      <div>Children Element</div>
    </EditorBar>
  );

  return {
    props,
    wrapper,
  };
};

test('renders information about last save time', () => {
  const timestamp = 1607525787826;
  const timeAgo = moment(timestamp).fromNow();
  const {
    wrapper: { getByText },
  } = render({ lastSaveTime: timestamp });

  expect(getByText(`editor_bar.saved ${timeAgo}`)).toBeInTheDocument();
});

test('renders children nodes', () => {
  const {
    wrapper: { getByText },
  } = render();

  expect(getByText('Children Element')).toBeInTheDocument();
});

test('renders saving indicator', () => {
  const {
    wrapper: { getByText },
  } = render({ isSaving: true });

  expect(getByText('editor_bar.is_saving')).toBeInTheDocument();
});

test('allows user to finish dashboard edition', () => {
  const {
    wrapper: { getByText },
    props,
  } = render();

  const finishButton = getByText(`editor_bar.finish_edition`);
  fireEvent.click(finishButton);

  expect(props.onFinishEdit).toHaveBeenCalled();
});
