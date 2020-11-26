import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { DropdownMenu } from '@keen.io/ui-core';

import { Container, DeleteDashboard } from './ActionsMenu.styles';

import {
  cloneDashboard,
  shareDashboard,
  deleteDashboard,
} from '../../../../modules/dashboards';

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
        <DropdownMenu.Item
          onClick={() => {
            onClose();
            dispatch(shareDashboard(dashboardId));
          }}
        >
          {t('actions_menu.share_dashboard')}
        </DropdownMenu.Item>
        <DropdownMenu.Divider />
        <DropdownMenu.Item
          onClick={() => {
            onClose();
            dispatch(cloneDashboard(dashboardId));
          }}
        >
          {t('actions_menu.clone_dashboard')}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() => {
            onClose();
            dispatch(deleteDashboard(dashboardId));
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
