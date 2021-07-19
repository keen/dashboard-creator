/* eslint-disable react/display-name */
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import Loadable from 'react-loadable';
import { RawDraftContentState } from 'draft-js';
import { Modal } from '@keen.io/ui-core';

import { Container } from './TextWidgetEditor.styles';
import {
  textEditorActions,
  TextAlignment,
  textEditorSagaActions,
} from '../../modules/textEditor';

const Editor = Loadable({
  loader: () =>
    import(/* webpackChunkName: "text-widget-editor" */ './components/Editor'),
  loading: () => <div>loading</div>,
});

type Props = {
  /** Open indicator */
  isOpen: boolean;
  /** Initial HTML state */
  textEditorContent: RawDraftContentState;
  /** Initial HTML state */
  editorTextAlignment: TextAlignment;
};

const TextWidgetEditor: FC<Props> = ({
  isOpen,
  editorTextAlignment,
  textEditorContent,
}) => {
  const dispatch = useDispatch();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(textEditorActions.closeEditor())}
    >
      {(_, closeHandler) => (
        <Container>
          <Editor
            initialContent={textEditorContent}
            initialTextAlignment={editorTextAlignment}
            onUpdateText={(content, textAlignment) =>
              dispatch(
                textEditorSagaActions.applyTextEditorSettings(
                  content,
                  textAlignment
                )
              )
            }
            onCancel={closeHandler}
          />
        </Container>
      )}
    </Modal>
  );
};

export default TextWidgetEditor;
