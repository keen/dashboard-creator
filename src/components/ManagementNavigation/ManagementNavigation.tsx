import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { transparentize } from 'polished';
import { Button } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

import {
  Container,
  ButtonMotion,
  TopBar,
  Heading,
  Message,
} from './ManagementNavigation.styles';

import Title from '../Title';

const pulseMotion = {
  animate: {
    boxShadow: `0 0 2px 4px ${transparentize(0.6, colors.green[400])}`,
  },
  transition: { yoyo: Infinity, repeatDelay: 0.3, duration: 0.5 },
};

type Props = {
  /** Create dashboard event handler */
  onCreateDashboard: () => void;
  /** Pulse button to attract user attention */
  attractNewDashboardButton?: boolean;
};

const ManagementNavigation: FC<Props> = ({
  onCreateDashboard,
  attractNewDashboardButton = false,
}) => {
  const { t } = useTranslation();

  const buttonMotion = attractNewDashboardButton ? pulseMotion : {};

  return (
    <Container>
      <TopBar>
        <Heading>
          <Title>{t('dashboard_management.title')}</Title>
          <Message>{t('dashboard_management.description')}</Message>
        </Heading>
        <ButtonMotion {...buttonMotion}>
          <Button variant="success" onClick={onCreateDashboard}>
            {t('dashbord_management.create_dashboard')}
          </Button>
        </ButtonMotion>
      </TopBar>
    </Container>
  );
};
export default ManagementNavigation;
