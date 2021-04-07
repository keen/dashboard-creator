import React, { FC, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import {
  getAvailableWidgets,
  getSimpleOptionsWidgets,
  WidgetPicker,
} from '@keen.io/widget-picker';
import { Button, FadeLoader } from '@keen.io/ui-core';
import { Theme } from '@keen.io/charts';

import {
  Placeholder,
  DatavizContainer,
  FadeMask,
  Container,
  RunQuery,
} from './WidgetVisualization.styles';

import Dataviz from '../DataViz';
import { getDefaultSettings } from '../../utils';

import { fadeMaskMotion } from './motion';
import { DISABLE_WIDGETS } from './constants';

import { VisualizationSettings } from './types';
import { getPresentationTimezone } from '../../../../modules/timezone';

type Props = {
  /** Query run indocator */
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
  /** Base theme */
  baseTheme: Partial<Theme>;
  /** Query results */
  analysisResult?: Record<string, any>;
};

const WidgetVisualization: FC<Props> = ({
  visualization,
  outdatedAnalysisResults,
  isQueryPerforming,
  baseTheme,
  querySettings,
  analysisResult,
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

  useEffect(() => {
    if (!widgets.includes(type)) {
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
      analysisResult &&
      analysisResult.query.analysis_type !== 'funnel' &&
      analysisResult.result
    ) {
      return getPresentationTimezone(queryResults);
    }
    return null;
  }, []);

  return (
    <Container>
      {analysisResult ? (
        <>
          <div>
            <WidgetPicker
              widgets={widgets}
              currentWidget={type}
              chartSettings={chartSettings}
              widgetSettings={widgetSettings}
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
            <DatavizContainer>
              <Dataviz
                visualization={type}
                visualizationTheme={baseTheme}
                chartSettings={chartSettings}
                widgetSettings={widgetSettings}
                analysisResults={analysisResult}
                presentationTimezone={getTimezone(analysisResult)}
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
