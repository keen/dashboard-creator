import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  RawDraftContentState,
} from 'draft-js';
import { Button } from '@keen.io/ui-core';

import {
  Header,
  Description,
  Footer,
  CancelButton,
  EditorContainer,
} from './Editor.styles';

import TextEditor, { styles } from '../../../TextEditor';
import Toolbar from '../Toolbar';

type Props = {
  /** Initial HTML state */
  initialContent: RawDraftContentState;
  /** Update text event handler */
  onUpdateText: (content: RawDraftContentState) => void;
  /** Cancel event handler */
  onCancel: () => void;
};

const Editor: FC<Props> = ({ onUpdateText, initialContent, onCancel }) => {
  const { t } = useTranslation();
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(initialContent))
  );

  return (
    <div>
      <Header>
        <Description>{t('text_widget_editor.description')}</Description>
        <Toolbar
          currentInlineStyle={editorState.getCurrentInlineStyle()}
          onUpdateInlineStyleAttribute={(inlineStyleType) => {
            const updatedEditorState = RichUtils.toggleInlineStyle(
              editorState,
              inlineStyleType
            );
            setEditorState(updatedEditorState);
          }}
          onUpdateColor={(color) => {
            const updatedEditorState = styles.color.toggle(editorState, color);
            setEditorState(updatedEditorState);
          }}
          onUpdateFontSize={(fontSize) => {
            const updatedEditorState = styles.fontSize.toggle(
              editorState,
              `${fontSize}px`
            );
            setEditorState(updatedEditorState);
          }}
        />
      </Header>
      <EditorContainer>
        <TextEditor
          editorState={editorState}
          onChange={(state) => setEditorState(state)}
          placeholder={t('text_widget_editor.placeholder')}
        />
      </EditorContainer>
      <Footer>
        <Button
          variant="secondary"
          onClick={() => {
            onUpdateText(convertToRaw(editorState.getCurrentContent()));
          }}
        >
          {t('text_widget_editor.update_button')}
        </Button>
        <CancelButton>
          <Button variant="blank" onClick={onCancel}>
            {t('text_widget_editor.cancel_button')}
          </Button>
        </CancelButton>
      </Footer>
    </div>
  );
};

export default Editor;
