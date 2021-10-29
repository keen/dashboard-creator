import React, { FC, createContext, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Modal, ModalHeader } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import ThemeEditor from '../ThemeEditor';
import {
  Container,
  Content,
  Cancel,
  Footer,
  Preview,
} from './ThemeEditorModal.styles';

import {
  themeActions,
  themeSagaActions,
  themeSelectors,
} from '../../modules/theme';

export const ThemeModalContext = createContext({ modalContentRef: null });

const ThemeEditorModal: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const modalContentRef = useRef(null);
  const { isOpen, inPreviewMode } = useSelector(themeSelectors.getThemeModal);
  const [containerOverflow, setContainerOverflow] = useState({
    top: false,
    bottom: false,
  });

  const { top: overflowTop, bottom: overflowBottom } = containerOverflow;

  const onScroll = () => {
    if (!modalContentRef.current) return;

    const scrollTop = modalContentRef.current.scrollTop;
    const offsetHeight = modalContentRef.current.offsetHeight;
    const scrollHeight = modalContentRef.current.scrollHeight;

    const top = scrollTop > 0;
    const bottom = scrollHeight > offsetHeight + scrollTop;

    setContainerOverflow({ top, bottom });
  };

  return (
    <ThemeModalContext.Provider value={{ modalContentRef }}>
      <Modal
        adjustPositionToScroll={false}
        closeOnFadeMaskClick={false}
        isOpen={isOpen}
        isMaskTransparent={inPreviewMode}
        onClose={() =>
          dispatch(
            themeActions.setModalVisibility({
              isOpen: false,
              inPreviewMode: false,
            })
          )
        }
      >
        {(_, closeHandler) => (
          <>
            <ModalHeader onClose={closeHandler}>
              {t('theme_editor.title')}
            </ModalHeader>
            <Container
              overflowTop={overflowTop}
              overflowBottom={overflowBottom}
            >
              {!inPreviewMode && (
                <Content ref={modalContentRef} onScroll={onScroll}>
                  <ThemeEditor />
                </Content>
              )}
            </Container>
            <Footer hasBorder={!inPreviewMode}>
              <Button
                variant="secondary"
                onClick={() => dispatch(themeSagaActions.saveDashboardTheme())}
              >
                {t('theme_editor.save')}
              </Button>
              <Preview>
                <Button
                  style="outline"
                  variant="secondary"
                  onClick={() => {
                    if (!inPreviewMode) {
                      dispatch(themeSagaActions.previewTheme());
                    }
                    dispatch(
                      themeActions.setModalVisibility({
                        isOpen,
                        inPreviewMode: !inPreviewMode,
                      })
                    );
                  }}
                >
                  {inPreviewMode
                    ? t('theme_editor.expand')
                    : t('theme_editor.preview')}
                </Button>
              </Preview>
              <Cancel
                onClick={() => dispatch(themeSagaActions.cancelEdition())}
              >
                <BodyText
                  fontWeight="bold"
                  variant="body2"
                  color={colors.blue[500]}
                >
                  {t('theme_editor.cancel')}
                </BodyText>
              </Cancel>
            </Footer>
          </>
        )}
      </Modal>
    </ThemeModalContext.Provider>
  );
};

export default ThemeEditorModal;
