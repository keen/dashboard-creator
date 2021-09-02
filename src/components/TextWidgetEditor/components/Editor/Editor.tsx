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
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { BodyText } from '@keen.io/typography';
import { transparentize } from 'polished';

import {
  Header,
  Description,
  Footer,
  CancelButton,
  EditorContainer,
  IconContainer,
} from './Editor.styles';

import { TextAlignment } from '../../../../modules/textEditor';
import TextEditor, { styles } from '../../../TextEditor';
import Toolbar from '../Toolbar';

type Props = {
  /** Initial content state */
  initialContent: RawDraftContentState;
  /** Initial text alignment */
  initialTextAlignment: TextAlignment;
  /** Update text event handler */
  onUpdateText: (
    content: RawDraftContentState,
    textAlignment: TextAlignment
  ) => void;
  /** Cancel event handler */
  onCancel: () => void;
};

const Editor: FC<Props> = ({
  onUpdateText,
  initialContent,
  initialTextAlignment,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [textAlignment, setTextAlignment] = useState(initialTextAlignment);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(initialContent))
  );

  return (
    <div>
      <Header>
        <div>
          <Description>
            <BodyText variant="body3" fontWeight="normal">
              {t('text_widget_editor.description')}
            </BodyText>
          </Description>
          <Toolbar
            editorState={editorState}
            textAlignment={textAlignment}
            onUpdateInlineStyleAttribute={(inlineStyleType) => {
              const updatedEditorState = RichUtils.toggleInlineStyle(
                editorState,
                inlineStyleType
              );
              setEditorState(updatedEditorState);
            }}
            onUpdateColor={(color) => {
              const updatedEditorState = styles.color.toggle(
                editorState,
                color
              );
              setEditorState(updatedEditorState);
            }}
            onUpdateTextAlignment={(alignment) => setTextAlignment(alignment)}
            onUpdateFontSize={(fontSize) => {
              const updatedEditorState = styles.fontSize.toggle(
                editorState,
                `${fontSize}px`
              );
              setEditorState(updatedEditorState);
            }}
          />
        </div>
        <IconContainer onClick={onCancel} data-testid="cancel-handler">
          <Icon
            type="close"
            width={16}
            height={16}
            fill={transparentize(0.5, colors.black[100])}
          />
        </IconContainer>
      </Header>
      <EditorContainer>
        <TextEditor
          editorState={editorState}
          textAlignment={textAlignment}
          onChange={(state) => setEditorState(state)}
          placeholder={t('text_widget_editor.placeholder')}
        />
      </EditorContainer>
      <Footer>
        <Button
          variant="secondary"
          onClick={() => {
            onUpdateText(
              convertToRaw(editorState.getCurrentContent()),
              textAlignment
            );
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
