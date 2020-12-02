import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@keen.io/ui-core';

import {
  Container,
  ButtonMotion,
  TopBar,
  Heading,
  Message,
} from './ManagementNavigation.styles';

import Title from '../Title';
import { pulseMotion } from './motion';

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
      <TopBar flexDirection={{ xs: 'column', md: 'row' }}>
        <Heading marginBottom={{ xs: 20, md: 0 }} marginRight={{ md: 10 }}>
          <Title>{t('dashbord_management.title')}</Title>
          <Message>{t('dashbord_management.description')}</Message>
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
