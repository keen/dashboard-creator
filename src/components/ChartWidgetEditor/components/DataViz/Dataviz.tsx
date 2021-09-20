import React, { FC, useRef, useEffect, useContext } from 'react';
import { PickerWidgets } from '@keen.io/widget-picker';
import { KeenDataviz } from '@keen.io/dataviz';
import { WidgetSettings, Tag } from '@keen.io/widgets';

import { Container } from './DataViz.styles';

import getChartInput from '../../../../utils/getChartInput';

import { CONTAINER_ID } from './constants';
import { DashboardSettings } from '../../../../modules/dashboards';

import { ChartSettings } from '../../../../types';
import { AppContext } from '../../../../contexts';

type Props = {
  /** Query execution results */
  analysisResults: Record<string, any>;
  /** Visualization type */
  visualization: Exclude<PickerWidgets, 'json'>;
  /** Chart plot settings */
  chartSettings: ChartSettings;
  /** Widget settings */
  widgetSettings: WidgetSettings;
  /** Presentation timezone */
  presentationTimezone?: string | number;
  /** Dashboard settings for tiles */
  dashboardSettings?: Pick<DashboardSettings, 'tiles'>;
  /** Tags */
  tags?: Tag[];
  /** Determines if chart is in edit mode */
  inEditMode?: boolean;
};

const Dataviz: FC<Props> = ({
  analysisResults,
  visualization,
  chartSettings,
  widgetSettings,
  presentationTimezone,
  dashboardSettings = {},
  tags = [],
  inEditMode,
}) => {
  const datavizRef = useRef(null);
  const containerRef = useRef(null);
  const { chartEventsPubSub } = useContext(AppContext);
  const { tiles } = dashboardSettings;

  useEffect(() => {
    datavizRef.current = new KeenDataviz({
      container: containerRef.current,
      inEditMode,
      eventBus: chartEventsPubSub,
      type: visualization,
      settings: chartSettings,
      widget: {
        ...widgetSettings,
        tags,
        card: {
          enabled: widgetSettings.card?.enabled,
          ...(widgetSettings.card?.enabled
            ? {
                backgroundColor: tiles.background,
                borderColor: tiles.borderColor,
                borderWidth: tiles.borderWidth,
                borderRadius: tiles.borderRadius,
                padding: tiles.padding,
                hasShadow: tiles.hasShadow,
              }
            : {}),
        },
      },
      presentationTimezone,
    });

    datavizRef.current.render(getChartInput(analysisResults));
  }, [
    visualization,
    chartSettings,
    widgetSettings,
    analysisResults,
    inEditMode,
  ]);

  return <Container id={CONTAINER_ID} ref={containerRef} />;
};

Dataviz.displayName = 'Dataviz';

export default Dataviz;
