import React, { FC, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import deepMerge from 'deepmerge';
import { KeenDataviz } from '@keen.io/dataviz';

import { Container } from './ChartWidget.styles';

import { getWidget, ChartWidget } from '../../modules/widgets';
import { getBaseTheme, getDashboardTheme } from '../../modules/theme';
import { RootState } from '../../rootReducer';

type Props = {
  /** Widget identifier */
  id: string;
};

const ChartWidget: FC<Props> = ({ id }) => {
  const containerRef = useRef(null);
  const {
    isConfigured,
    isInitialized,
    isLoading,
    data,
    widget,
  } = useSelector((state: RootState) => getWidget(state, id));
  const baseTheme = useSelector(getBaseTheme);
  const dashboardTheme = useSelector((state: RootState) =>
    getDashboardTheme(state, id)
  );
  const theme = deepMerge(baseTheme, dashboardTheme);

  const showVisualization = isConfigured && isInitialized && !isLoading;

  useEffect(() => {
    if (showVisualization) {
      const {
        settings: { visualizationType, chartSettings, widgetSettings },
      } = widget as ChartWidget;

      new KeenDataviz({
        container: containerRef.current,
        type: visualizationType as any,
        settings: {
          ...chartSettings,
          theme,
        },
        widget: widgetSettings,
      }).render(data);
    }
  }, [showVisualization]);

  return (
    <>
      {showVisualization ? (
        <Container ref={containerRef}></Container>
      ) : (
        <>
          {!isConfigured && <div>config in progress</div>}
          {isLoading && <div>Loading</div>}
        </>
      )}
    </>
  );
};

export default ChartWidget;
