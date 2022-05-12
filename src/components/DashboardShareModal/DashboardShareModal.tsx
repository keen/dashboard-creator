/* eslint-disable @typescript-eslint/naming-convention */
import React, { FC, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Portal, Modal } from '@keen.io/ui-core';

import { AppContext } from '../../contexts';

import DashboardShare from '../DashboardShare';
import {
  dashboardsActions,
  dashboardsSelectors,
} from '../../modules/dashboards';

const DashboardShareModal: FC = () => {
  const dispatch = useDispatch();
  const { modalContainer } = useContext(AppContext);

  const { isVisible, dashboardId } = useSelector(
    dashboardsSelectors.getDashboardShareModal
  );

  const closeHandler = useCallback(() => {
    dispatch(dashboardsActions.hideDashboardShareModal());
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
