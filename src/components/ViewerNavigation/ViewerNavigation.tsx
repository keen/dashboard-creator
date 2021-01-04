import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CircleButton } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import { Aside, ButtonWrapper, Container } from './ViewerNavigation.styles';

import DashboardDetails from '../DashboardDetails';

type Props = {
  /** Dashboard tags */
  tags: string[];
  /** Dashboard title */
  title?: string;
  /** User privilages */
  editPrivileges?: boolean;
  /** Edit dashboard event handler */
  onEditDashboard: () => void;
  /** Show dashboard settings */
  onShowSettings: () => void;
  /** Back event handler */
  onBack: () => void;
};

const ViewerNavigation: FC<Props> = ({
  title,
  tags,
  onBack,
  editPrivileges,
  onShowSettings,
  onEditDashboard,
}) => {
  const { t } = useTranslation();

  return (
    <Container>
      <DashboardDetails title={title} tags={tags} onBack={onBack} />
      <Aside>
        {editPrivileges && (
          <ButtonWrapper data-testid="dashboard-settings">
            <CircleButton
              variant="secondary"
              icon={<Icon type="settings" />}
              onClick={onShowSettings}
            />
          </ButtonWrapper>
        )}

        {editPrivileges && (
          <Button variant="secondary" onClick={onEditDashboard}>
            {t('viewer.edit_dashboard_button')}
          </Button>
        )}
      </Aside>
    </Container>
  );
};
export default ViewerNavigation;
