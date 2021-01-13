import React, { FC, useRef, useEffect } from 'react';
import {
  PickerWidgets,
  ChartSettings,
  WidgetSettings,
} from '@keen.io/widget-picker';
import { KeenDataviz } from '@keen.io/dataviz';
import { Theme } from '@keen.io/charts';

import { Container } from './DataViz.styles';

import getChartInput from '../../../../utils/getChartInput';

import { CONTAINER_ID } from './constants';

type Props = {
  /** Query execution results */
  analysisResults: Record<string, any>;
  /** Visualization type */
  visualization: Exclude<PickerWidgets, 'json'>;
  /** Chart plot settings */
  chartSettings: ChartSettings;
  /** Widget settings */
  widgetSettings: WidgetSettings;
  /** Visualizations theme settings */
  visualizationTheme?: Partial<Theme>;
};

const Dataviz: FC<Props> = ({
  analysisResults,
  visualization,
  chartSettings,
  widgetSettings,
  visualizationTheme,
}) => {
  const datavizRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const themeSettings = visualizationTheme
      ? {
          theme: visualizationTheme,
        }
      : {};

    datavizRef.current = new KeenDataviz({
      container: containerRef.current,
      type: visualization,
      settings: {
        ...chartSettings,
        ...themeSettings,
      },
      widget: widgetSettings,
    });

    datavizRef.current.render(getChartInput(analysisResults));
  }, [visualization, chartSettings, widgetSettings, analysisResults]);

  return <Container id={CONTAINER_ID} ref={containerRef} />;
};

Dataviz.displayName = 'Dataviz';

export default Dataviz;
