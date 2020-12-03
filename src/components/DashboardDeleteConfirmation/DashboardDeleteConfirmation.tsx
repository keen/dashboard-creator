import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Anchor,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
} from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

import {
  Content,
  Cancel,
  FooterContent,
  Message,
  Title,
  ConfirmButton,
} from './DashboardDeleteConfirmation.styles';

import {
  hideDeleteConfirmation,
  confirmDashboardDelete,
  getDeleteConfirmation,
  getDashboardMeta,
} from '../../modules/dashboards';

import { RootState } from '../../rootReducer';

type Props = {};

const DashboardDeleteConfirmation: FC<Props> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isVisible, dashboardId } = useSelector(getDeleteConfirmation);

  const { title } = useSelector((state: RootState) => {
    if (dashboardId) return getDashboardMeta(state, dashboardId);
    return {
      title: null,
    };
  });

  const dashboardTitle = title
    ? title
    : t('delete_dashboard.untitled_dashboard');

  return (
    <Modal
      isOpen={isVisible}
      onClose={() => dispatch(hideDeleteConfirmation())}
    >
      {(_, closeHandler) => (
        <>
          <ModalHeader>
            <Title>{t('delete_dashboard.title')}</Title>
          </ModalHeader>
          <Content data-testid="delete-confirmation-content">
            <Message
              dangerouslySetInnerHTML={{
                __html: t('delete_dashboard.message', {
                  name: `<strong>${dashboardTitle}</strong>`,
                  interpolation: { escapeValue: false },
                }),
              }}
            />
          </Content>
          <ModalFooter>
            <FooterContent>
              <ConfirmButton>
                <Button
                  variant="danger"
                  htmlType="button"
                  onClick={() => dispatch(confirmDashboardDelete())}
                >
                  {t('delete_dashboard.confirm')}
                </Button>
              </ConfirmButton>
              <Cancel>
                <Anchor
                  onClick={closeHandler}
                  color={colors.blue[500]}
                  hoverColor={colors.blue[300]}
                >
                  {t('delete_dashboard.cancel')}
                </Anchor>
              </Cancel>
            </FooterContent>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
};

export default DashboardDeleteConfirmation;
