import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import Editor from './Editor';

const render = (overProps: any = {}) => {
  const editorContent = '@text';

  const props = {
    initialContent: {
      blocks: [
        {
          key: '@key',
          text: '@text',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
        },
      ],
      entityMap: {},
    },
    initialTextAlignment: 'left',
    onUpdateText: jest.fn(),
    onCancel: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<Editor {...props} />);

  return {
    props,
    wrapper,
    editorContent,
  };
};

test('renders text editor', () => {
  const {
    wrapper: { getByText },
    editorContent,
  } = render({});

  expect(getByText(editorContent)).toBeInTheDocument();
});

test('allows user to update text widget settings', () => {
  const {
    props: { onUpdateText, initialTextAlignment },
    wrapper: { getByText },
  } = render({});

  const button = getByText('text_widget_editor.update_button');
  fireEvent.click(button);

  expect(onUpdateText).toHaveBeenCalledWith(
    {
      blocks: [
        {
          key: '@key',
          text: '@text',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    },
    initialTextAlignment
  );
});

test('allows user to cancel text edit', () => {
  const {
    props,
    wrapper: { getByText },
  } = render({});

  const button = getByText('text_widget_editor.cancel_button');
  fireEvent.click(button);

  expect(props.onCancel).toHaveBeenCalled();
});
