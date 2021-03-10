import React, { FC, useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { colors } from '@keen.io/colors';
import { Button, CircleButton } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import {
  Container,
  DragHandle,
  EditorContainer,
  RemoveContainer,
  ManagementContainer,
  ButtonsContainer,
} from './TextManagement.styles';

import TextEditor from '../TextEditor';
import RemoveWidget from '../RemoveWidget';
import PreventDragPropagation from '../PreventDragPropagation';
import {
  editInlineTextWidget,
  editTextWidget,
  getWidget,
  cloneWidget,
  TextWidget,
} from '../../modules/widgets';

import { DRAG_HANDLE_ELEMENT } from '../Widget';

import { settingsMotion } from './motions';

import { RootState } from '../../rootReducer';

type Props = {
  /** Widget identifier */
  id: string;
  /** Hover state indicator */
  isHoverActive: boolean;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
  /** Update trigger time delay */
  updateDebounceTime?: number;
};

// TODO: Integrate widget clone functionality
const TextManagement: FC<Props> = ({
  id,
  isHoverActive,
  onRemoveWidget,
  updateDebounceTime = 500,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const updateWidget = useRef(null);

  const { widget, isInitialized } = useSelector((state: RootState) =>
    getWidget(state, id)
  );
  const {
    settings: { content, textAlignment },
  } = widget as TextWidget;

  const [removeConfirmation, setRemoveConfirmation] = useState(false);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(content))
  );

  useEffect(() => {
    if (isInitialized) {
      setEditorState(EditorState.createWithContent(convertFromRaw(content)));
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!isHoverActive) {
      setRemoveConfirmation(false);
    }
  }, [isHoverActive]);

  const showManagementSettings = isHoverActive && !removeConfirmation;
  const showRemoveConfirmation = isHoverActive && removeConfirmation;

  return (
    <Container>
      <EditorContainer>
        <TextEditor
          placeholder={t('text_management.placeholder')}
          editorState={editorState}
          textAlignment={textAlignment}
          onChange={(state) => {
            if (state.getCurrentContent() !== editorState.getCurrentContent()) {
              if (updateWidget.current) clearTimeout(updateWidget.current);
              updateWidget.current = setTimeout(() => {
                const draftObject = convertToRaw(state.getCurrentContent());

                dispatch(editInlineTextWidget(id, draftObject));
              }, updateDebounceTime);
            }

            setEditorState(state);
          }}
        />
      </EditorContainer>
      <AnimatePresence>
        {showRemoveConfirmation && (
          <RemoveContainer {...settingsMotion}>
            <RemoveWidget
              onConfirm={onRemoveWidget}
              onDismiss={() => setRemoveConfirmation(false)}
            >
              {t('text_management.delete_confirmation')}
            </RemoveWidget>
          </RemoveContainer>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showManagementSettings && (
          <ManagementContainer
            className={DRAG_HANDLE_ELEMENT}
            {...settingsMotion}
          >
            <DragHandle>
              <Icon
                type="drag"
                width={15}
                height={15}
                fill={colors.white[500]}
              />
            </DragHandle>
            <ButtonsContainer>
              <PreventDragPropagation>
                <Button
                  variant="blank"
                  onClick={() => dispatch(editTextWidget(id))}
                >
                  {t('widget.edit_text')}
                </Button>
              </PreventDragPropagation>
              <PreventDragPropagation>
                <div data-testid="remove-text-widget">
                  <CircleButton
                    variant="blank"
                    onClick={() => setRemoveConfirmation(true)}
                    icon={<Icon type="delete" fill={colors.red[500]} />}
                  />
                </div>
              </PreventDragPropagation>
              <PreventDragPropagation>
                <div data-testid="clone-text-widget">
                  <CircleButton
                    variant="blank"
                    onClick={() => dispatch(cloneWidget(id))}
                    icon={<Icon type="clone" fill={colors.black[500]} />}
                  />
                </div>
              </PreventDragPropagation>
            </ButtonsContainer>
          </ManagementContainer>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default TextManagement;
