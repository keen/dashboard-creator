/* eslint-disable react/display-name */
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import Loadable from 'react-loadable';
import { RawDraftContentState } from 'draft-js';
import { Modal } from '@keen.io/ui-core';

import { Container } from './TextWidgetEditor.styles';

import { closeEditor, applyTextEditorSettings } from '../../modules/textEditor';

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
};

const TextWidgetEditor: FC<Props> = ({ isOpen, textEditorContent }) => {
  const dispatch = useDispatch();

  return (
    <Modal
      isOpen={isOpen}
      adjustPositionToScroll={false}
      onClose={() => dispatch(closeEditor())}
    >
      {(_, closeHandler) => (
        <Container>
          <Editor
            initialContent={textEditorContent}
            onUpdateText={(html) => dispatch(applyTextEditorSettings(html))}
            onCancel={closeHandler}
          />
        </Container>
      )}
    </Modal>
  );
};

export default TextWidgetEditor;
