import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CircleButton, Dropdown, UI_LAYERS } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import {
  Card,
  PreviewMotion,
  ActionsMotion,
  ThumbnailContainer,
  PreviewButton,
} from './DashboardTile.styles';

import PermissionGate from '../PermissionGate';
import { ActionsMenu, Header, Thumbnail } from './components';
import { actionsMotion, actionsMenuMotion, previewMotion } from './motions';

import { Scopes } from '../../modules/app';

type Props = {
  /** Dashboard identifer */
  id: string;
  /** Last dashboard modification date */
  lastModificationDate: string;
  /** Queries used on dashboardr */
  queriesCount: number;
  /** Dashboard title */
  title: string;
  /** Default thumbnail indicator */
  useDefaultThumbnail: boolean;
  /** Public dashboard indicator */
  isPublic?: boolean;
  /** Dashboard tags pool */
  tags?: string[];
  /** Preview event handler */
  onPreview: () => void;
  /** Show dashboard settings event handler */
  onShowSettings: () => void;
};

const DashboardTile: FC<Props> = ({
  id,
  title,
  queriesCount,
  lastModificationDate,
  useDefaultThumbnail,
  isPublic,
  tags,
  onPreview,
  onShowSettings,
}) => {
  const { t } = useTranslation();
  const [showActionsMenu, setActionsMenuVisibility] = useState(false);
  const [isActive, setActive] = useState(null);
  const actionsMenuContainer = useRef(null);

  const outsideActionsMenuClick = useCallback(
    (e) => {
      if (
        showActionsMenu &&
        actionsMenuContainer.current &&
        !actionsMenuContainer.current.contains(e.target)
      ) {
        setActionsMenuVisibility(false);
      }
    },
    [actionsMenuContainer, showActionsMenu]
  );

  useEffect(() => {
    if (showActionsMenu) {
      document.addEventListener('click', outsideActionsMenuClick);
    }

    return () => document.removeEventListener('click', outsideActionsMenuClick);
  }, [showActionsMenu, actionsMenuContainer]);

  const getExcerpt = () => {
    if (isActive) {
      if (queriesCount > 1)
        return `${queriesCount} ${t('dashboard_tile.queries')}`;
      if (queriesCount === 1)
        return `${queriesCount} ${t('dashboard_tile.query')}`;
      return t('dashboard_tile.no_queries');
    }
    return lastModificationDate;
  };

  return (
    <Card
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActionsMenuVisibility(false);
        setActive(false);
      }}
    >
      <Header
        title={title}
        excerpt={getExcerpt()}
        isPublic={isPublic}
        tags={tags}
      >
        <AnimatePresence>
          {isActive && (
            <PermissionGate scopes={[Scopes.EDIT_DASHBOARD]}>
              <ActionsMotion data-testid="dashboard-actions" {...actionsMotion}>
                <CircleButton
                  variant="success"
                  icon={<Icon type="settings" />}
                  onClick={onShowSettings}
                />
                <div
                  ref={actionsMenuContainer}
                  style={{ zIndex: UI_LAYERS.dropdown - 1 }}
                >
                  <CircleButton
                    variant="success"
                    icon={<Icon type="actions" />}
                    onClick={() => setActionsMenuVisibility(!showActionsMenu)}
                  />

                  <Dropdown
                    isOpen={showActionsMenu}
                    fullWidth={false}
                    motion={actionsMenuMotion}
                  >
                    <ActionsMenu
                      dashboardId={id}
                      onClose={() => setActionsMenuVisibility(false)}
                    />
                  </Dropdown>
                </div>
              </ActionsMotion>
            </PermissionGate>
          )}
        </AnimatePresence>
      </Header>
      <ThumbnailContainer>
        <Thumbnail
          useDefaultThumbnail={useDefaultThumbnail}
          defaultThumbnailMessage={t('dashboard_tile.add_widgets')}
          dashboardId={id}
        />
        <AnimatePresence>
          {isActive && (
            <PreviewMotion {...previewMotion} onClick={onPreview}>
              <PreviewButton>
                {t('dashboard_tile.preview_dashboard')}
              </PreviewButton>
            </PreviewMotion>
          )}
        </AnimatePresence>
      </ThumbnailContainer>
    </Card>
  );
};

export default DashboardTile;
