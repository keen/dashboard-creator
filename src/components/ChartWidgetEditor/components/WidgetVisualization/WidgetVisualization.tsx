import React, { FC, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

import {
  ChartSettings as WidgetPickerChartSettings,
  getAvailableWidgets,
  getSimpleOptionsWidgets,
  WidgetPicker,
} from '@keen.io/widget-picker';
import { Button, FadeLoader } from '@keen.io/ui-core';

import { getPresentationTimezone } from '../../../../modules/timezone';
import { themeSelectors } from '../../../../modules/theme';
import { getDefaultSettings } from '../../utils';
import Dataviz from '../DataViz';

import {
  Placeholder,
  DatavizContainer,
  FadeMask,
  Container,
  RunQuery,
} from './WidgetVisualization.styles';
import { fadeMaskMotion } from './motion';
import { DISABLE_WIDGETS } from './constants';
import { GaugeChartMessage } from './components';
import { VisualizationSettings } from './types';

type Props = {
  /** Query run indicator */
  isQueryPerforming: boolean;
  /** Visualization do not represents current query state */
  outdatedAnalysisResults: boolean;
  /** Visualization settings */
  visualization: VisualizationSettings;
  /** Query settings */
  querySettings: Record<string, any>;
  /** Change visualization settings event handler */
  onChangeVisualization: (settings: VisualizationSettings) => void;
  /** Run query event handler */
  onRunQuery: () => void;
  /** Query results */
  analysisResult?: Record<string, any>;
  /** Is saved query */
  isSavedQuery?: boolean;
  /** Determines if chart is in edit mode */
  inEditMode?: boolean;
};

const WidgetVisualization: FC<Props> = ({
  visualization,
  outdatedAnalysisResults,
  isQueryPerforming,
  querySettings,
  analysisResult,
  isSavedQuery,
  inEditMode,
  onRunQuery,
  onChangeVisualization,
}) => {
  const { t } = useTranslation();
  const widgets = useMemo(
    () =>
      getAvailableWidgets(querySettings).filter(
        (widget) => !DISABLE_WIDGETS.includes(widget)
      ),
    [analysisResult]
  );

  const { type, chartSettings, widgetSettings } = visualization;

  const tags = [];

  if (isSavedQuery) {
    tags.push({ label: t('tags.saved_query'), variant: 'gray' });
  }

  useEffect(() => {
    if (!!analysisResult && !widgets.includes(type)) {
      const [defaultWidget] = widgets;
      const { chartSettings, widgetSettings } = getDefaultSettings(
        defaultWidget
      );

      onChangeVisualization({
        type: defaultWidget,
        chartSettings,
        widgetSettings,
      });
    }
  }, [widgets, type]);

  const getTimezone = useCallback((queryResults) => {
    if (
      queryResults &&
      queryResults.query.analysis_type !== 'funnel' &&
      queryResults.result
    ) {
      return getPresentationTimezone(queryResults);
    }
    return null;
  }, []);

  const { settings: dashboardWidgetSettings } = useSelector(
    themeSelectors.getActiveDashboardThemeSettings
  );

  return (
    <Container>
      {analysisResult ? (
        <>
          <div>
            <WidgetPicker
              widgets={widgets}
              currentWidget={type}
              chartSettings={chartSettings as WidgetPickerChartSettings}
              widgetSettings={visualization.widgetSettings}
              disabledWidgetOptions={getSimpleOptionsWidgets(querySettings)}
              onUpdateSettings={(widgetType, chartSettings, widgetSettings) =>
                onChangeVisualization({
                  type: widgetType,
                  chartSettings,
                  widgetSettings,
                })
              }
            />
          </div>
          {widgets.includes(type) && type !== 'json' && (
            <>
              {type === 'gauge' && !chartSettings['maxValue'] && (
                <GaugeChartMessage />
              )}
              <DatavizContainer>
                <Dataviz
                  visualization={type}
                  chartSettings={chartSettings}
                  tags={tags}
                  widgetSettings={widgetSettings}
                  analysisResults={analysisResult}
                  presentationTimezone={getTimezone(analysisResult)}
                  dashboardSettings={dashboardWidgetSettings}
                  inEditMode={inEditMode}
                />
                <AnimatePresence>
                  {outdatedAnalysisResults && (
                    <FadeMask {...fadeMaskMotion} data-testid="chart-fade-mask">
                      <Button
                        variant="success"
                        isDisabled={isQueryPerforming}
                        icon={isQueryPerforming && <FadeLoader />}
                        onClick={onRunQuery}
                      >
                        {isQueryPerforming
                          ? t('chart_widget_editor.run_query_loading')
                          : t('chart_widget_editor.run_query')}
                      </Button>
                    </FadeMask>
                  )}
                </AnimatePresence>
              </DatavizContainer>
            </>
          )}
        </>
      ) : (
        <Placeholder>
          {t('chart_widget_editor.run_query_placeholder')}
          <RunQuery>
            <Button
              variant="success"
              isDisabled={isQueryPerforming}
              icon={isQueryPerforming && <FadeLoader />}
              onClick={onRunQuery}
            >
              {isQueryPerforming
                ? t('chart_widget_editor.run_query_loading')
                : t('chart_widget_editor.run_query')}
            </Button>
          </RunQuery>
        </Placeholder>
      )}
    </Container>
  );
};

export default WidgetVisualization;
