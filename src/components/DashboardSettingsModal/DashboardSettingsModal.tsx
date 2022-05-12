import React, { FC, useContext, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Portal, Modal, ModalHeader } from '@keen.io/ui-core';

import DashboardSettings from '../DashboardSettings';

import { AppContext } from '../../contexts';
import {
  DashboardMetaData,
  dashboardsActions,
  dashboardsSelectors,
} from '../../modules/dashboards';

type Props = {
  /** Save dashboard event handler */
  onSaveDashboard: (dashboardId: string, metadata: DashboardMetaData) => void;
};

const DashboardSettingsModal: FC<Props> = ({ onSaveDashboard }) => {
  const dispatch = useDispatch();
  const { modalContainer } = useContext(AppContext);
  const { t } = useTranslation();

  const { isVisible, dashboardId } = useSelector(
    dashboardsSelectors.getDashboardSettingsModal
  );

  const closeHandler = useCallback(() => {
    dispatch(dashboardsActions.hideDashboardSettingsModal());
  }, []);

  useEffect(() => {
    isVisible
      ? dispatch(dashboardsActions.prepareTagsPool())
      : dispatch(dashboardsActions.clearTagsPool());
  }, [isVisible]);

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
