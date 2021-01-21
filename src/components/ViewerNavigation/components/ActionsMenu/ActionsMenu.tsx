import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { DropdownMenu } from '@keen.io/ui-core';

import { Container } from './ActionsMenu.styles';

import { cloneDashboard } from '../../../../modules/dashboards';

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
            dispatch(cloneDashboard(dashboardId));
          }}
        >
          {t('viewer.clone_dashboard')}
        </DropdownMenu.Item>
      </DropdownMenu.Container>
    </Container>
  );
};

export default ActionsMenu;
