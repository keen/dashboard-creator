import { textEditorActions, textEditorReducer } from './index';
import { initialState } from './reducer';

test('opens text editor', () => {
  const action = textEditorActions.openEditor();
  const { isOpen } = textEditorReducer(initialState, action);

  expect(isOpen).toEqual(true);
});

test('closes editor and restores initial editor settings', () => {
  const action = textEditorActions.closeEditor();
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

  const action = textEditorActions.setEditorContent(editorContent);
  const { content } = textEditorReducer(initialState, action);

  expect(content).toEqual(editorContent);
});

test('set text alignment', () => {
  const alignment = 'center';
  const action = textEditorActions.setTextAlignment(alignment);
  const { textAlignment } = textEditorReducer(initialState, action);

  expect(textAlignment).toEqual(alignment);
});
