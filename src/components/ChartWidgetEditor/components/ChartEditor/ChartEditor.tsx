/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC, useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import deepEqual from 'deep-equal';
import { getAvailableWidgets } from '@keen.io/widget-picker';
import { Button, Alert, Anchor } from '@keen.io/ui-core';

import {
  Container,
  QuerySettings,
  ChartSettings,
  VisualizationContainer,
  NotificationBar,
  Cancel,
  NavBar,
  Footer,
} from './ChartEditor.styles';

import {
  applyConfiguration,
  setEditorSection,
  runQuery,
  setQueryDirty,
  setVisualizationSettings,
  restoreSavedQuery,
  updateWidgetSettings,
  getChartEditor,
  editorUnmounted,
  EditorSection,
} from '../../../../modules/chartEditor';
import { getActiveDashboardTheme } from '../../../../modules/theme';

import WidgetVisualization from '../WidgetVisualization';
import HeadingSettings from '../HeadingSettings';
import SaveQueryWarning from '../SaveQueryWarning';
import QueryEditor from '../QueryEditor';
import Navigation from '../Navigation';

import { CHART_EDITOR_ERRORS } from './constants';
import { TOOLTIP_MOTION } from '../../../../constants';

import { ChartEditorError } from './types';

type Props = {
  /** Close editor event handler */
  onClose: () => void;
};

const ChartEditor: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [localQuery, setLocalQuery] = useState(null);
  const [error, setError] = useState<ChartEditorError>(null);

  const {
    analysisResult,
    initialQuerySettings,
    querySettings,
    visualization,
    editorSection,
    isEditMode,
    isDirtyQuery,
    isSavedQuery,
    isQueryPerforming,
    hasQueryChanged,
  } = useSelector(getChartEditor);
  const baseTheme = useSelector(getActiveDashboardTheme);

  const { type: widgetType, widgetSettings } = visualization;

  const onApplyConfiguration = useCallback(() => {
    const availableWidgets = getAvailableWidgets(querySettings);
    if (availableWidgets.includes(widgetType) && analysisResult) {
      setError(null);
      dispatch(applyConfiguration());
    } else if (!analysisResult) {
      setError(ChartEditorError.CONFIGURATION);
    } else {
      setError(ChartEditorError.WIDGET);
    }
  }, [widgetType, querySettings, analysisResult]);

  useEffect(() => {
    if (initialQuerySettings && localQuery) {
      const isDirty = !deepEqual(localQuery, querySettings, {
        strict: true,
      });

      dispatch(setQueryDirty(isDirty));
    } else if (initialQuerySettings && !localQuery) {
      setLocalQuery(querySettings);
    }
  }, [initialQuerySettings, querySettings]);

  useEffect(() => {
    return () => {
      dispatch(editorUnmounted());
    };
  }, []);

  const outdatedAnalysisResults = !!(analysisResult !== null && isDirtyQuery);

  return (
    <Container id="chart-editor">
      <AnimatePresence>
        {error && (
          <NotificationBar {...TOOLTIP_MOTION}>
            <Alert type="error">{t(CHART_EDITOR_ERRORS[error])}</Alert>
          </NotificationBar>
        )}
      </AnimatePresence>
      <VisualizationContainer>
        <WidgetVisualization
          visualization={visualization}
          baseTheme={baseTheme}
          isQueryPerforming={isQueryPerforming}
          outdatedAnalysisResults={outdatedAnalysisResults}
          analysisResult={analysisResult}
          querySettings={querySettings}
          onRunQuery={() => {
            setError(null);
            dispatch(runQuery());
          }}
          onChangeVisualization={({
            type,
            chartSettings,
            widgetSettings: defaultWidgetSettings,
          }) => {
            const { title, subtitle } = widgetSettings;
            dispatch(
              setVisualizationSettings(type, chartSettings, {
                ...defaultWidgetSettings,
                title,
                subtitle,
              })
            );
          }}
        />
      </VisualizationContainer>
      <NavBar>
        <Navigation
          onChangeSection={(section) => {
            if (section !== EditorSection.QUERY) {
              setLocalQuery(null);
            }
            dispatch(setEditorSection(section));
          }}
          activeSection={editorSection}
        />
      </NavBar>
      {editorSection === EditorSection.QUERY ? (
        <QuerySettings>
          <QueryEditor
            initialQueryInitialized={!!initialQuerySettings}
            isEditMode={isEditMode}
          />
        </QuerySettings>
      ) : (
        <ChartSettings>
          <HeadingSettings
            title={widgetSettings.title}
            subtitle={widgetSettings.subtitle}
            onUpdateTitleSettings={(settings) =>
              dispatch(updateWidgetSettings({ title: settings }))
            }
            onUpdateSubtitleSettings={(settings) =>
              dispatch(updateWidgetSettings({ subtitle: settings }))
            }
          />
        </ChartSettings>
      )}
      <Footer>
        <Button
          variant="secondary"
          isDisabled={isQueryPerforming}
          onClick={onApplyConfiguration}
        >
          {isEditMode
            ? t('chart_widget_editor.save')
            : t('chart_widget_editor.add_to_dashboard')}
        </Button>
        <Cancel>
          <Anchor onClick={onClose}>{t('chart_widget_editor.cancel')}</Anchor>
        </Cancel>
        {isSavedQuery && hasQueryChanged && (
          <SaveQueryWarning
            onRestoreQuery={() => dispatch(restoreSavedQuery())}
          />
        )}
      </Footer>
    </Container>
  );
};
export default ChartEditor;
