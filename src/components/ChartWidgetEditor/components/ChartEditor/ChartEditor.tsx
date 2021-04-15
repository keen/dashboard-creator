/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC, useState, useEffect, useCallback, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import deepEqual from 'deep-equal';
import { getAvailableWidgets, WidgetSettings } from '@keen.io/widget-picker';
import WidgetCustomization, {
  SerializedSettings,
  serializeInputSettings,
  serializeOutputSettings,
  useCustomizationSections,
} from '@keen.io/widget-customization';
import { Query } from '@keen.io/query';
import {
  Button,
  Alert,
  Anchor,
  MousePositionedTooltip,
} from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';
import { BodyText } from '@keen.io/typography';

import {
  Container,
  QuerySettings,
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
  updateChartSettings,
} from '../../../../modules/chartEditor';
import { getActiveDashboardTheme } from '../../../../modules/theme';
import { AppContext } from '../../../../contexts';

import WidgetVisualization from '../WidgetVisualization';
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
    queryError,
    hasQueryChanged,
  } = useSelector(getChartEditor);

  const baseTheme = useSelector(getActiveDashboardTheme);

  const { modalContainer } = useContext(AppContext);

  const { type: widgetType, widgetSettings, chartSettings } = visualization;

  const customizationSections = useCustomizationSections(
    !!analysisResult,
    querySettings as Query,
    widgetType
  );

  const [
    widgetCustomization,
    setCustomizationSettings,
  ] = useState<SerializedSettings>(() =>
    serializeInputSettings(widgetType, chartSettings, widgetSettings)
  );

  const onApplyConfiguration = useCallback(() => {
    const availableWidgets = getAvailableWidgets(querySettings);
    if (availableWidgets.includes(widgetType) && analysisResult) {
      setError(null);
      return dispatch(applyConfiguration());
    }
    setError(ChartEditorError.WIDGET);
  }, [widgetType, querySettings, analysisResult]);

  useEffect(() => {
    if (initialQuerySettings && localQuery) {
      const isDirty = !deepEqual(localQuery, querySettings, {
        strict: true,
      });
      if (isDirty) setLocalQuery(querySettings);
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
            const chart = serializeOutputSettings(
              type,
              widgetCustomization.chart
            );
            dispatch(
              setVisualizationSettings(
                type,
                {
                  ...chartSettings,
                  ...chart,
                },
                {
                  ...defaultWidgetSettings,
                  ...(widgetCustomization.widget as WidgetSettings),
                }
              )
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
        <WidgetCustomization
          customizationSections={customizationSections}
          chartSettings={widgetCustomization.chart}
          widgetSettings={widgetCustomization.widget}
          savedQueryName={analysisResult?.query_name}
          onUpdateWidgetSettings={(widgetSettings) => {
            dispatch(updateWidgetSettings(widgetSettings));
            setCustomizationSettings((state) => ({
              ...state,
              widget: widgetSettings,
            }));
          }}
          onUpdateChartSettings={(chartSettings) => {
            const chart = serializeOutputSettings(widgetType, chartSettings);
            dispatch(updateChartSettings(chart));
            setCustomizationSettings((state) => ({
              ...state,
              chart: chartSettings,
            }));
          }}
          modalContainer={modalContainer}
        />
      )}
      <Footer>
        <MousePositionedTooltip
          isActive={isDirtyQuery || !analysisResult}
          renderContent={() => (
            <BodyText
              variant="body2"
              fontWeight="normal"
              color={colors.white[500]}
            >
              {t('chart_widget_editor.run_query_first')}
            </BodyText>
          )}
          tooltipPortal={modalContainer}
          tooltipTheme="dark"
        >
          <Button
            variant="secondary"
            isDisabled={
              isQueryPerforming ||
              isDirtyQuery ||
              !!queryError ||
              !analysisResult
            }
            onClick={onApplyConfiguration}
          >
            {isEditMode
              ? t('chart_widget_editor.save')
              : t('chart_widget_editor.add_to_dashboard')}
          </Button>
        </MousePositionedTooltip>
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
