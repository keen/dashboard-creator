import React, { FC, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Portal, Modal, ModalHeader } from '@keen.io/ui-core';

import {
  getDashboardSettingsModal,
  hideDashboardSettingsModal,
  DashboardMetaData,
} from '../../modules/dashboards';

import DashboardSettings from '../DashboardSettings';

import { AppContext } from '../../contexts';

type Props = {
  /** Save dashobard event handler */
  onSaveDashboard: (dashboardId: string, metadata: DashboardMetaData) => void;
};

const DashboardSettingsModal: FC<Props> = ({ onSaveDashboard }) => {
  const dispatch = useDispatch();
  const { modalContainer } = useContext(AppContext);
  const { t } = useTranslation();

  const { isVisible, dashboardId } = useSelector(getDashboardSettingsModal);

  const closeHandler = useCallback(() => {
    dispatch(hideDashboardSettingsModal());
  }, []);

  return (
    <Portal modalContainer={modalContainer}>
      <Modal isOpen={isVisible} onClose={closeHandler}>
        {() => (
          <>
            <ModalHeader onClose={closeHandler}>
              {t('dashboard_settings.modal_title')}
            </ModalHeader>
            <DashboardSettings
              onSave={onSaveDashboard}
              onClose={closeHandler}
              dashboardId={dashboardId}
            />
          </>
        )}
      </Modal>
    </Portal>
  );
};

export default DashboardSettingsModal;
