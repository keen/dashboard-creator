import React, {
  FC,
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

import WidgetPlaceholder from '../WidgetPlaceholder';
import { Container, LoaderWrapper } from './ChartWidget.styles';

import { EditorContext } from '../../contexts';
import { getWidget, ChartWidget } from '../../modules/widgets';
import { getInterimQuery } from '../../modules/queries';
import { getActiveDashboardTheme } from '../../modules/theme';
import { RootState } from '../../rootReducer';

import { RESIZE_WIDGET_EVENT } from '../../constants';

import getChartInput from '../../utils/getChartInput';
import createDataviz from './utils/createDataviz';
import { getPresentationTimezone } from '../../modules/timezone';

type Props = {
  /** Widget identifier */
  id: string;
  /** Disable chart interactions */
  disableInteractions?: boolean;
};

const ChartWidget: FC<Props> = ({ id, disableInteractions }) => {
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const datavizRef = useRef(null);

  const { editorPubSub } = useContext(EditorContext);
  const [placeholder, setPlaceholder] = useState({ width: 0, height: 0 });

  const {
    isConfigured,
    isInitialized,
    isLoading,
    error,
    data,
    widget,
  } = useSelector((state: RootState) => getWidget(state, id));
  const interimQuery = useSelector((state: RootState) =>
    getInterimQuery(state, id)
  );
  const theme = useSelector((state: RootState) =>
    getActiveDashboardTheme(state)
  );

  const showVisualization = isConfigured && isInitialized && !isLoading;
  const chartData = interimQuery ? interimQuery : data;

  const getTimezone = useCallback((chartData) => {
    if (
      chartData &&
      chartData.query &&
      chartData.query.analysis_type !== 'funnel'
    ) {
      return getPresentationTimezone(chartData);
    }
    return null;
  }, []);

  useEffect(() => {
    if (showVisualization) {
      datavizRef.current = createDataviz(
        widget as ChartWidget,
        theme,
        containerRef.current,
        getTimezone(chartData)
      );

      if (error) {
        datavizRef.current.error(error.message, error.title);
      } else {
        datavizRef.current.render(getChartInput(chartData));
      }
    }
  }, [showVisualization, error]);

  useEffect(() => {
    if (!editorPubSub) return;
    const dispose = editorPubSub.subscribe((eventName, meta) => {
      switch (eventName) {
        case RESIZE_WIDGET_EVENT:
          const { id: widgetId } = meta;
          if (datavizRef.current && widgetId === id && !error) {
            datavizRef.current.destroy();
            datavizRef.current.render(getChartInput(chartData));
          }
          break;
      }
    });

    return () => dispose();
  }, [error, chartData, editorPubSub]);

  useEffect(() => {
    if (loaderRef.current) {
      const { offsetWidth: width, offsetHeight: height } = loaderRef.current;
      setPlaceholder({ width, height });
    }
  }, [loaderRef]);

  return (
    <>
      {showVisualization ? (
        <Container
          ref={containerRef}
          data-testid="chart-widget-container"
          disableInteractions={disableInteractions}
        />
      ) : (
        <LoaderWrapper ref={loaderRef}>
          {!isConfigured && (
            <WidgetPlaceholder
              width={placeholder.width}
              height={placeholder.height}
              iconType="bar-widget-vertical"
            />
          )}
          {isLoading && (
            <div data-testid="chart-widget-loader">
              <Loader width={50} height={50} fill={colors.blue['500']} />
            </div>
          )}
        </LoaderWrapper>
      )}
    </>
  );
};

export default ChartWidget;
