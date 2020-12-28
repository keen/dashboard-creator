import React, { FC, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAvailableWidgets, WidgetPicker } from '@keen.io/widget-picker';
import { Theme } from '@keen.io/charts';

import { Placeholder, Container } from './WidgetVisualization.styles';

import Dataviz from '../DataViz';
import { getDefaultSettings } from '../../utils';

import { DISABLE_WIDGETS } from './constants';

import { VisualizationSettings } from './types';

type Props = {
  visualization: VisualizationSettings;
  /** Query settings */
  querySettings: Record<string, any>;
  /** Change visualization settings event handler */
  onChangeVisualization: (settings: VisualizationSettings) => void;
  /** Base theme */
  baseTheme: Partial<Theme>;
  /** Query results */
  analysisResult?: Record<string, any>;
};

const WidgetVisualization: FC<Props> = ({
  visualization,
  baseTheme,
  querySettings,
  analysisResult,
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
            <Dataviz
              visualization={type}
              visualizationTheme={baseTheme}
              chartSettings={chartSettings}
              widgetSettings={widgetSettings}
              analysisResults={analysisResult}
            />
          )}
        </>
      ) : (
        <Placeholder>
          {t('chart_widget_editor.run_query_placeholder')}
        </Placeholder>
      )}
    </Container>
  );
};

export default WidgetVisualization;
