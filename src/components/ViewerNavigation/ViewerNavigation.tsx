import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CircleButton } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import { Aside, ButtonWrapper, Container } from './ViewerNavigation.styles';

type Props = {
  /** User privilages */
  editPrivileges?: boolean;
  /** Edit dashboard event handler */
  onEditDashboard: () => void;
  /** Show dashboard settings */
  onShowSettings: () => void;
};

const ViewerNavigation: FC<Props> = ({
  editPrivileges,
  onShowSettings,
  onEditDashboard,
}) => {
  const { t } = useTranslation();

  return (
    <Container>
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
