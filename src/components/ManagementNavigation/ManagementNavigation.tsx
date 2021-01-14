import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@keen.io/ui-core';

import {
  ButtonMotion,
  Container,
  Heading,
  Message,
} from './ManagementNavigation.styles';

import Title from '../Title';
import { pulseMotion } from './motion';

type Props = {
  /** Create dashboard event handler */
  onCreateDashboard: () => void;
  /** Pulse button to attract user attention */
  attractCreateDashboardButton?: boolean;
  /** Shows create dashboard button */
  showCreateDashboardButton: boolean;
};

const ManagementNavigation: FC<Props> = ({
  onCreateDashboard,
  showCreateDashboardButton = false,
  attractCreateDashboardButton = false,
}) => {
  const { t } = useTranslation();

  const buttonMotion = attractCreateDashboardButton ? pulseMotion : {};

  return (
    <Container flexDirection={{ xs: 'column', md: 'row' }}>
      <Heading marginBottom={{ xs: 20, md: 0 }} marginRight={{ md: 10 }}>
        <Title>{t('dashboard_management.title')}</Title>
        <Message>{t('dashboard_management.description')}</Message>
      </Heading>
      {showCreateDashboardButton && (
        <ButtonMotion {...buttonMotion}>
          <Button variant="success" onClick={onCreateDashboard}>
            {t('dashboard_management.create_dashboard')}
          </Button>
        </ButtonMotion>
      )}
    </Container>
  );
};
export default ManagementNavigation;
