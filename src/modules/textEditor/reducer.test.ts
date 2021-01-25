import textEditorReducer, { initialState } from './reducer';

import {
  setEditorContent,
  setTextAlignment,
  openEditor,
  closeEditor,
} from './actions';

test('opens text editor', () => {
  const action = openEditor();
  const { isOpen } = textEditorReducer(initialState, action);

  expect(isOpen).toEqual(true);
});

test('closes editor and restores initial editor settings', () => {
  const action = closeEditor();
  const result = textEditorReducer(
    { ...initialState, isOpen: false, textAlignment: 'right' },
    action
  );

  expect(result).toMatchInlineSnapshot(`
    Object {
      "content": Object {
        "blocks": Array [],
        "entityMap": Object {},
      },
      "isOpen": false,
      "textAlignment": "left",
    }
  `);
});

test('set editor content', () => {
  const editorContent = {
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
  };

  const action = setEditorContent(editorContent);
  const { content } = textEditorReducer(initialState, action);

  expect(content).toEqual(editorContent);
});

test('set text alignment', () => {
  const alignment = 'center';
  const action = setTextAlignment(alignment);
  const { textAlignment } = textEditorReducer(initialState, action);

  expect(textAlignment).toEqual(alignment);
});
