import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { CircleButton, Tooltip } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import {
  Aside,
  Container,
  TooltipMotion,
  ButtonContainer,
} from './EditorNavigation.styles';

import TooltipContent from '../TooltipContent';
import DashboardDetails from '../DashboardDetails';
import PermissionGate from '../PermissionGate';

import {
  showDashboardShareModal,
  showDashboardSettingsModal,
} from '../../modules/dashboards';
import { appSelectors, Scopes } from '../../modules/app';

import { TOOLTIP_MOTION } from '../../constants';
import { TOOLTIP } from './constants';

type Props = {
  /** Back to management view */
  onBack: () => void;
  /** Dashboard tags */
  tags: string[];
  /** Dashboard title */
  title?: string;
  /** Dashboard is public identifier */
  isPublic?: boolean;
};

const EditorNavigation: FC<Props> = ({ title, tags, isPublic, onBack }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const activeDashboard = useSelector(appSelectors.getActiveDashboard);

  const [tooltip, setTooltip] = useState(null);

  return (
    <Container>
      <DashboardDetails
        title={title}
        tags={tags}
        isPublic={isPublic}
        onBack={onBack}
      />
      <Aside>
        <ButtonContainer
          onMouseEnter={() => setTooltip(TOOLTIP.settings)}
          onMouseLeave={() => setTooltip(null)}
        >
          <CircleButton
            variant="secondary"
            icon={<Icon type="settings" />}
            onClick={() => {
              setTooltip(null);
              dispatch(showDashboardSettingsModal(activeDashboard));
            }}
          />
          <AnimatePresence>
            {tooltip === TOOLTIP.settings && (
              <TooltipMotion {...TOOLTIP_MOTION}>
                <Tooltip hasArrow={false} mode="light">
                  <TooltipContent color={colors.black[500]}>
                    {t('editor_navigation.settings_tooltip')}
                  </TooltipContent>
                </Tooltip>
              </TooltipMotion>
            )}
          </AnimatePresence>
        </ButtonContainer>
        <PermissionGate scopes={[Scopes.SHARE_DASHBOARD]}>
          <ButtonContainer
            data-testid="share-dashboard"
            marginLeft="10px"
            onMouseEnter={() => setTooltip(TOOLTIP.share)}
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
              {tooltip === TOOLTIP.share && (
                <TooltipMotion {...TOOLTIP_MOTION}>
                  <Tooltip hasArrow={false} mode="light">
                    <TooltipContent color={colors.black[500]}>
                      {t('editor_navigation.share_tooltip')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipMotion>
              )}
            </AnimatePresence>
          </ButtonContainer>
        </PermissionGate>
      </Aside>
    </Container>
  );
};

export default EditorNavigation;
