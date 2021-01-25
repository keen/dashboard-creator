import React, { FC, useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CircleButton, Dropdown } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import { Aside, ButtonWrapper, Container } from './ViewerNavigation.styles';

import DashboardDetails from '../DashboardDetails';

import ActionsMenu from './components/ActionsMenu';

type Props = {
  /** Dashboard Id */
  dashboardId: string;
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

const actionsMenuMotion = {
  initial: { opacity: 0, top: 20, left: -10 },
  animate: { opacity: 1, top: 2, left: -10 },
  exit: { opacity: 0, top: 30, left: -10 },
};

const ViewerNavigation: FC<Props> = ({
  dashboardId,
  title,
  tags,
  onBack,
  editPrivileges,
  onShowSettings,
  onEditDashboard,
}) => {
  const { t } = useTranslation();
  const [actionsOpen, setActionsOpen] = useState(false);

  const containerRef = useRef(null);
  const outsideClick = useCallback(
    (e) => {
      if (
        actionsOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setActionsOpen(false);
      }
    },
    [actionsOpen, containerRef]
  );

  useEffect(() => {
    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, [actionsOpen, containerRef]);

  return (
    <Container>
      <DashboardDetails title={title} tags={tags} onBack={onBack} />
      <Aside>
        {editPrivileges && (
          <>
            <ButtonWrapper data-testid="dashboard-settings">
              <CircleButton
                variant="secondary"
                icon={<Icon type="settings" />}
                onClick={onShowSettings}
              />
            </ButtonWrapper>
            <ButtonWrapper data-testid="dashboard-actions" ref={containerRef}>
              <CircleButton
                variant="secondary"
                icon={<Icon type="actions" />}
                onClick={() => setActionsOpen(true)}
              />
              <Dropdown
                isOpen={actionsOpen}
                fullWidth={false}
                motion={actionsMenuMotion}
              >
                <ActionsMenu
                  dashboardId={dashboardId}
                  onClose={() => setActionsOpen(false)}
                />
              </Dropdown>
            </ButtonWrapper>
            <Button variant="secondary" onClick={onEditDashboard}>
              {t('viewer.edit_dashboard_button')}
            </Button>
          </>
        )}
      </Aside>
    </Container>
  );
};
export default ViewerNavigation;
