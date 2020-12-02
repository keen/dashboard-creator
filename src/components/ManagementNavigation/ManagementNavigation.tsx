import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@keen.io/ui-core';

import {
  Container,
  TopBar,
  Heading,
  Message,
} from './ManagementNavigation.styles';

import Title from '../Title';

type Props = {
  /** Create dashboard event handler */
  onCreateDashboard: () => void;
};

const ManagementNavigation: FC<Props> = ({ onCreateDashboard }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <TopBar>
        <Heading>
          <Title>{t('dashboard_management.title')}</Title>
          <Message>{t('dashboard_management.description')}</Message>
        </Heading>
        <Button variant="success" onClick={onCreateDashboard}>
          {t('dashboard_management.create_dashboard')}
        </Button>
      </TopBar>
    </Container>
  );
};
export default ManagementNavigation;
