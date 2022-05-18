import React, { FC, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { colors } from '@keen.io/colors';
import { ErrorContainer } from '@keen.io/forms';
import { TagManagement } from '@keen.io/ui-core';
import {
  Anchor,
  Input,
  Label,
  Button,
  Error,
  ModalFooter,
  FadeLoader,
} from '@keen.io/ui-core';

import {
  Settings,
  TagManager,
  Cancel,
  FooterContent,
} from './DashboardSettings.styles';

import {
  DashboardMetaData,
  dashboardsSelectors,
} from '../../modules/dashboards';
import { RootState } from '../../rootReducer';

type Props = {
  /** Save query event handler */
  onSave: (dashboardId: string, metadata: DashboardMetaData) => void;
  /** Close settings event handler */
  onClose: () => void;
  /** Dashboard identifier */
  dashboardId: string;
};

const DashboardSettings: FC<Props> = ({ onSave, onClose, dashboardId }) => {
  const { t } = useTranslation();

  const dashboardMeta = useSelector((state: RootState) =>
    dashboardsSelectors.getDashboardMeta(state, dashboardId)
  );
  const dashboards = useSelector(dashboardsSelectors.getDashboardsMetadata);
  const tagsPool = useSelector(dashboardsSelectors.getTagsPool);
  const isSavingDashboardMeta = useSelector(
    dashboardsSelectors.getDashboardMetaSaving
  );

  const { title, tags } = dashboardMeta;
  const [dashboardSettings, setDashboardSettings] = useState({ title, tags });
  const [dashboardNameError, setDashboardNameError] = useState<
    string | boolean
  >(null);

  const handleDashboardNameUpdate = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setDashboardNameError(
        value ? false : (t('dashboard_settings.dashboard_name_error') as string)
      );
      setDashboardSettings((settings) => ({
        ...settings,
        title: value,
      }));
    },
    []
  );

  const hasTitleChanged = dashboardMeta.title !== dashboardSettings.title;

  return (
    <>
      <Settings>
        <Label
          htmlFor="dashboardName"
          variant="secondary"
          showAsterisk
          hasError={!!dashboardNameError}
        >
          {t('dashboard_settings.dashboard_name_label')}
        </Label>
        <Input
          data-testid="dashboard-name-input"
          type="text"
          variant="solid"
          id="dashboardName"
          hasError={!!dashboardNameError}
          placeholder={t('dashboard_settings.dashboard_name_input_placeholder')}
          value={dashboardSettings.title || ''}
          onChange={handleDashboardNameUpdate}
        />
        <ErrorContainer>
          {dashboardNameError && <Error>{dashboardNameError}</Error>}
        </ErrorContainer>
        <TagManager>
          <TagManagement
            tags={dashboardSettings.tags}
            tagsPool={tagsPool}
            onAddTag={(tag) => {
              setDashboardSettings((settings) => ({
                ...settings,
                tags: [...settings.tags, tag],
              }));
            }}
            onRemoveTag={(tag) => {
              setDashboardSettings((settings) => ({
                ...settings,
                tags: settings.tags.filter((tagName) => tagName !== tag),
              }));
            }}
            newTagLabel={t('dashboard_settings.new_tag')}
            tagsLabel={t('dashboard_settings.tags')}
            placeholderLabel={t('dashboard_settings.input_placeholder')}
          />
        </TagManager>
      </Settings>
      <ModalFooter>
        <FooterContent>
          <Button
            data-testid="save-dashboard"
            variant="secondary"
            style="solid"
            isDisabled={!!dashboardNameError || isSavingDashboardMeta}
            icon={isSavingDashboardMeta && <FadeLoader />}
            onClick={() => {
              const { title, tags } = dashboardSettings;
              if (title) {
                const validateTitleUniqueness = hasTitleChanged;
                if (
                  validateTitleUniqueness &&
                  dashboards.find((dashboard) => dashboard.title === title)
                ) {
                  setDashboardNameError(
                    t(
                      'dashboard_settings.dashboard_unique_name_error'
                    ) as string
                  );
                  return;
                }
              }
              const metadata = {
                ...dashboardMeta,
                title,
                tags,
              };
              onSave(dashboardId, metadata);
              onClose();
            }}
          >
            {isSavingDashboardMeta
              ? t('dashboard_settings.saving_dashboard')
              : t('dashboard_settings.save_dashboard_button')}
          </Button>
          {!isSavingDashboardMeta && (
            <Cancel>
              <Anchor
                onClick={onClose}
                color={colors.blue[500]}
                hoverColor={colors.blue[300]}
              >
                {t('dashboard_settings.cancel')}
              </Anchor>
            </Cancel>
          )}
        </FooterContent>
      </ModalFooter>
    </>
  );
};

export default DashboardSettings;
