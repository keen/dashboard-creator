import React, { FC, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Alert,
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
  DisclaimerContainer,
  FooterContent,
  Message,
  Title,
  ConfirmButton,
} from './DashboardDeleteConfirmation.styles';
import DeleteDisclaimer from '../DeleteDisclaimer';

import {
  hideDeleteConfirmation,
  confirmDashboardDelete,
  getDeleteConfirmation,
  getDashboardMeta,
} from '../../modules/dashboards';

import { RootState } from '../../rootReducer';

const DashboardDeleteConfirmation: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isVisible, dashboardId } = useSelector(getDeleteConfirmation);

  const { title, isPublic } = useSelector((state: RootState) => {
    if (dashboardId) return getDashboardMeta(state, dashboardId);
    return {
      isPublic: null,
      title: null,
    };
  });

  const [disclaimerAccepted, setDisclaimer] = useState(false);
  const [disclaimerError, setDisclaimerError] = useState(false);

  const deleteHandler = useCallback(() => {
    if (isPublic) {
      setDisclaimerError(false);
      if (disclaimerAccepted) {
        dispatch(confirmDashboardDelete());
      } else {
        setDisclaimerError(true);
      }
    } else {
      dispatch(confirmDashboardDelete());
    }
  }, [isPublic, disclaimerAccepted]);

  useEffect(() => {
    setDisclaimerError(false);
    setDisclaimer(false);
  }, [isVisible]);

  const dashboardTitle = title
    ? title
    : t('delete_dashboard.untitled_dashboard');

  return (
    <Modal
      isOpen={isVisible}
      adjustPositionToScroll={false}
      onClose={() => dispatch(hideDeleteConfirmation())}
    >
      {(_, closeHandler) => (
        <>
          <ModalHeader onClose={closeHandler}>
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
            {isPublic && (
              <DisclaimerContainer>
                <DeleteDisclaimer
                  onChange={(isAccepted) => setDisclaimer(isAccepted)}
                />
              </DisclaimerContainer>
            )}
            {disclaimerError && (
              <Alert type="error">
                {t('delete_dashboard.public_dashboard_confirmation_error')}
              </Alert>
            )}
          </Content>
          <ModalFooter>
            <FooterContent>
              <ConfirmButton>
                <Button
                  variant="danger"
                  htmlType="button"
                  onClick={deleteHandler}
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
