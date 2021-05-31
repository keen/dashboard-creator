import React, { FC } from 'react';
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

const ThemeEditorModal: FC<{}> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOpen, inPreviewMode } = useSelector(themeSelectors.getThemeModal);

  return (
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
          <Container>
            {!inPreviewMode && (
              <Content>
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
            <Cancel onClick={() => dispatch(themeSagaActions.cancelEdition())}>
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
  );
};

export default ThemeEditorModal;
