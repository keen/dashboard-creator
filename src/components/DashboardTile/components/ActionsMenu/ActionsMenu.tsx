import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { DropdownMenu } from '@keen.io/ui-core';

import { Container, DeleteDashboard } from './ActionsMenu.styles';

import PermissionGate from '../../../PermissionGate';

import { Scopes } from '../../../../modules/app';
import { dashboardsActions } from '../../../../modules/dashboards';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
  /** Close menu event handler */
  onClose: () => void;
};

const ActionsMenu: FC<Props> = ({ dashboardId, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <Container>
      <DropdownMenu.Container>
        <PermissionGate scopes={[Scopes.SHARE_DASHBOARD]}>
          <DropdownMenu.Item
            onClick={() => {
              onClose();
              dispatch(dashboardsActions.showDashboardShareModal(dashboardId));
            }}
          >
            {t('actions_menu.share_dashboard')}
          </DropdownMenu.Item>
          <DropdownMenu.Divider />
        </PermissionGate>
        <DropdownMenu.Item
          onClick={() => {
            onClose();
            dispatch(dashboardsActions.editDashboard(dashboardId));
          }}
        >
          {t('actions_menu.edit_dashboard')}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() => {
            onClose();
            dispatch(dashboardsActions.cloneDashboard(dashboardId));
          }}
        >
          {t('actions_menu.clone_dashboard')}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() => {
            onClose();
            dispatch(dashboardsActions.deleteDashboard(dashboardId));
          }}
        >
          <DeleteDashboard>
            {t('actions_menu.delete_dashboard')}
          </DeleteDashboard>
        </DropdownMenu.Item>
      </DropdownMenu.Container>
    </Container>
  );
};

export default ActionsMenu;
