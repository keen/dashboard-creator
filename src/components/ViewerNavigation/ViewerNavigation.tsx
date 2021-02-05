import React, { FC, useState, useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Button, CircleButton, Dropdown, Tooltip } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import TooltipContent from '../TooltipContent';
import {
  Aside,
  ButtonWrapper,
  Container,
  TooltipMotion,
} from './ViewerNavigation.styles';

import DashboardDetails from '../DashboardDetails';

import { getActiveDashboard } from '../../modules/app';
import { showDashboardShareModal } from '../../modules/dashboards';

import ActionsMenu from './components/ActionsMenu';
import { TOOLTIP_MOTION } from '../../constants';
import TimeframeLabel from '../TimeframeLabel';

type Props = {
  /** Dashboard Id */
  dashboardId: string;
  /** Dashboard tags */
  tags: string[];
  /** Dashboard title */
  title?: string;
  /** User privilages */
  editPrivileges?: boolean;
  /** Dashboard is public identifier */
  isPublic?: boolean;
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

type Tooltip = 'share' | 'settings' | 'actions';

const ViewerNavigation: FC<Props> = ({
  dashboardId,
  title,
  tags,
  isPublic,
  onBack,
  editPrivileges,
  onShowSettings,
  onEditDashboard,
}) => {
  const { t } = useTranslation();
  const activeDashboard = useSelector(getActiveDashboard);
  const dispatch = useDispatch();

  const [actionsOpen, setActionsOpen] = useState(false);
  const [tooltip, setTooltip] = useState<Tooltip>(null);

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
      <DashboardDetails
        title={title}
        tags={tags}
        isPublic={isPublic}
        onBack={onBack}
      />
      <Aside>
        <TimeframeLabel
          start="2020-07-11  12:00"
          end="2020-08-11  12:00"
          onRemove={() => console.log('remove')}
        />
        {editPrivileges && (
          <>
            <ButtonWrapper
              onMouseEnter={() => setTooltip('settings')}
              onMouseLeave={() => setTooltip(null)}
              data-testid="dashboard-settings"
            >
              <CircleButton
                variant="secondary"
                icon={<Icon type="settings" />}
                onClick={() => {
                  setTooltip(null);
                  onShowSettings();
                }}
              />
              <AnimatePresence>
                {tooltip === 'settings' && (
                  <TooltipMotion {...TOOLTIP_MOTION}>
                    <Tooltip hasArrow={false} mode="light">
                      <TooltipContent color={colors.black[500]}>
                        {t('viewer.settings_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipMotion>
                )}
              </AnimatePresence>
            </ButtonWrapper>
            <ButtonWrapper
              onMouseEnter={() => setTooltip('share')}
              onMouseLeave={() => setTooltip(null)}
            >
              <CircleButton
                variant="secondary"
                icon={<Icon type="share" />}
                onClick={() => {
                  setTooltip(null);
                  dispatch(showDashboardShareModal(activeDashboard));
                }}
              />
              <AnimatePresence>
                {tooltip === 'share' && (
                  <TooltipMotion {...TOOLTIP_MOTION}>
                    <Tooltip hasArrow={false} mode="light">
                      <TooltipContent color={colors.black[500]}>
                        {t('viewer.share_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipMotion>
                )}
              </AnimatePresence>
            </ButtonWrapper>
            <ButtonWrapper
              onMouseEnter={() => setTooltip('actions')}
              onMouseLeave={() => setTooltip(null)}
              data-testid="dashboard-actions"
              ref={containerRef}
            >
              <CircleButton
                variant="secondary"
                icon={<Icon type="actions" />}
                onClick={() => {
                  setTooltip(null);
                  setActionsOpen(true);
                }}
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
              <AnimatePresence>
                {tooltip === 'actions' && !actionsOpen && (
                  <TooltipMotion {...TOOLTIP_MOTION}>
                    <Tooltip hasArrow={false} mode="light">
                      <TooltipContent color={colors.black[500]}>
                        {t('viewer.actions_tooltip')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipMotion>
                )}
              </AnimatePresence>
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
