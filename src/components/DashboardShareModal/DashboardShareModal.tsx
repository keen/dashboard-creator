/* eslint-disable @typescript-eslint/camelcase */
import React, { FC, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Portal, Modal } from '@keen.io/ui-core';

import {
  hideDashboardShareModal,
  getDashboardShareModal,
} from '../../modules/dashboards';

import { AppContext } from '../../contexts';

import DashboardShare from '../DashboardShare';

const DashboardShareModal: FC = () => {
  const dispatch = useDispatch();
  const { modalContainer } = useContext(AppContext);

  const { isVisible, dashboardId } = useSelector(getDashboardShareModal);

  const closeHandler = useCallback(() => {
    dispatch(hideDashboardShareModal());
  }, []);

  return (
    <Portal modalContainer={modalContainer}>
      <Modal isOpen={isVisible} onClose={closeHandler}>
        {() => <DashboardShare dashboardId={dashboardId} />}
      </Modal>
    </Portal>
  );
};

export default DashboardShareModal;
