import React, { FC } from 'react';
import { Editor, EditorState } from 'draft-js';

import { EditorContainer } from './TextEditor.styles';
import { customStyleFn } from './customStyles';

type Props = {
  /** Draft editor state */
  editorState: EditorState;
  /** Change editor state event handler */
  onChange: (editorState: EditorState) => void;
  /** Placeholder text */
  placeholder: string;
};

const TextEditor: FC<Props> = ({ editorState, onChange, placeholder }) => (
  <EditorContainer>
    <Editor
      customStyleFn={customStyleFn}
      editorState={editorState}
      onChange={onChange}
      placeholder={placeholder}
    />
  </EditorContainer>
);

export default TextEditor;
