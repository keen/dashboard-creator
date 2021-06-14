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
  SectionContainer,
  VisualizationContainer,
  NotificationBar,
  Cancel,
  NavBar,
  Footer,
} from './ChartEditor.styles';

import {
  chartEditorActions,
  chartEditorSelectors,
  EditorSection,
} from '../../../../modules/chartEditor';

import { themeSelectors } from '../../../../modules/theme';
import { AppContext } from '../../../../contexts';

import WidgetVisualization from '../WidgetVisualization';
import QueryEditor from '../QueryEditor';
import Navigation from '../Navigation';

import { CHART_EDITOR_ERRORS } from './constants';
import { TOOLTIP_MOTION } from '../../../../constants';

import { ChartEditorError } from './types';
import SaveQueryWarning from '../SaveQueryWarning';

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
    isSavedQuery,
    hasQueryChanged,
    isDirtyQuery,
    isQueryPerforming,
    queryError,
  } = useSelector(chartEditorSelectors.getChartEditor);

  const baseTheme = useSelector(themeSelectors.getActiveDashboardTheme);
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
      return dispatch(chartEditorActions.applyConfiguration());
    }
    setError(ChartEditorError.WIDGET);
  }, [widgetType, querySettings, analysisResult]);

  useEffect(() => {
    if (initialQuerySettings && localQuery) {
      const isDirty = !deepEqual(localQuery, querySettings, {
        strict: true,
      });
      if (isDirty) setLocalQuery(querySettings);
      dispatch(chartEditorActions.setQueryDirty(isDirty));
    } else if (initialQuerySettings && !localQuery) {
      setLocalQuery(querySettings);
    }
  }, [initialQuerySettings, querySettings]);

  useEffect(() => {
    return () => {
      dispatch(chartEditorActions.editorUnmounted());
    };
  }, []);

  const outdatedAnalysisResults = !!(analysisResult !== null && isDirtyQuery);

  const updateWidgetSettings = (widgetSettings) => {
    dispatch(chartEditorActions.setQueryChange(true));
    dispatch(chartEditorActions.updateWidgetSettings(widgetSettings));
    setCustomizationSettings((state) => ({
      ...state,
      widget: widgetSettings,
    }));
  };

  const updateChartSettings = (chartSettings) => {
    dispatch(chartEditorActions.setQueryChange(true));
    const chart = serializeOutputSettings(widgetType, chartSettings);
    dispatch(chartEditorActions.updateChartSettings(chart));
    setCustomizationSettings((state) => ({
      ...state,
      chart: chartSettings,
    }));
  };

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
          isSavedQuery={isSavedQuery}
          outdatedAnalysisResults={outdatedAnalysisResults}
          analysisResult={analysisResult}
          querySettings={querySettings}
          onRunQuery={() => {
            setError(null);
            dispatch(chartEditorActions.runQuery());
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
              chartEditorActions.setVisualizationSettings({
                type,
                chartSettings: {
                  ...chartSettings,
                  ...chart,
                },
                widgetSettings: {
                  ...defaultWidgetSettings,
                  ...(widgetCustomization.widget as WidgetSettings),
                },
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
            dispatch(chartEditorActions.setEditorSection(section));
          }}
          activeSection={editorSection}
        />
      </NavBar>
      {editorSection === EditorSection.QUERY ? (
        <SectionContainer>
          <QueryEditor
            initialQueryInitialized={!!initialQuerySettings}
            isEditMode={isEditMode}
          />
        </SectionContainer>
      ) : (
        <SectionContainer>
          <WidgetCustomization
            customizationSections={customizationSections}
            chartSettings={widgetCustomization.chart}
            widgetSettings={widgetCustomization.widget}
            savedQueryName={analysisResult?.metadata?.display_name}
            onUpdateWidgetSettings={(widgetSettings) =>
              updateWidgetSettings(widgetSettings)
            }
            onUpdateChartSettings={(chartSettings) =>
              updateChartSettings(chartSettings)
            }
            modalContainer={modalContainer}
          />
        </SectionContainer>
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
        {isSavedQuery && hasQueryChanged && <SaveQueryWarning />}
      </Footer>
    </Container>
  );
};
export default ChartEditor;
