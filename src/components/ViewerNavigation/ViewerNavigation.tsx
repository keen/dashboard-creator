import React, { FC, useState, useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Button, CircleButton, Dropdown, Tooltip } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { RootState } from '../../rootReducer';

import { showDashboardShareModal } from '../../modules/dashboards';
import { Scopes, appSelectors } from '../../modules/app';
import {
  getInterimQueriesLength,
  removeInterimQueries,
} from '../../modules/queries';
import {
  clearInconsistentFiltersError,
  resetDatePickerWidgets,
  resetFilterWidgets,
} from '../../modules/widgets/actions';

import TooltipContent from '../TooltipContent';
import PermissionGate from '../PermissionGate';
import DashboardDetails from '../DashboardDetails';
import { ActionsMenu } from './components';

import {
  Aside,
  ButtonWrapper,
  Container,
  TooltipMotion,
  ClearFilters,
} from './ViewerNavigation.styles';

import { TOOLTIP_MOTION } from '../../constants';

type Props = {
  /** Dashboard Id */
  dashboardId: string;
  /** Dashboard tags */
  tags: string[];
  /** Dashboard title */
  title?: string;
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
  onShowSettings,
  onEditDashboard,
}) => {
  const { t } = useTranslation();
  const activeDashboard = useSelector(appSelectors.getActiveDashboard);
  const hasInterimQueries = useSelector((state: RootState) => {
    const interimQueriesLength = getInterimQueriesLength(state);
    return !!interimQueriesLength;
  });
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
        {hasInterimQueries && (
          <ClearFilters
            onClick={() => {
              dispatch(resetDatePickerWidgets(activeDashboard));
              dispatch(resetFilterWidgets(activeDashboard));
              dispatch(clearInconsistentFiltersError(activeDashboard));
              dispatch(removeInterimQueries());
            }}
          >
            <BodyText
              variant="body2"
              fontWeight="bold"
              color={colors.blue[500]}
            >
              {t('viewer.clear_filters')}
            </BodyText>
          </ClearFilters>
        )}
        <PermissionGate scopes={[Scopes.EDIT_DASHBOARD]}>
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
          <PermissionGate scopes={[Scopes.SHARE_DASHBOARD]}>
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
          </PermissionGate>
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
        </PermissionGate>
      </Aside>
    </Container>
  );
};
export default ViewerNavigation;
