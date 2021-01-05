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

import ChartPlaceholder from '../ChartPlaceholder';
import { Container, LoaderWrapper } from './ChartWidget.styles';

import { EditorContext } from '../../contexts';
import { getWidget, ChartWidget } from '../../modules/widgets';
import { getActiveDashboardTheme } from '../../modules/theme';
import { RootState } from '../../rootReducer';

import { RESIZE_WIDGET_EVENT } from '../../constants';
import createDataviz from './utils/createDataviz';

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

  const getChartInput = useCallback((data: Record<string, any>) => {
    const isSavedQuery = 'query_name' in data;
    const { result } = data;

    if (isSavedQuery && typeof result === 'object' && 'steps' in result) {
      const {
        query,
        result: { steps, result: analysisResult },
      } = data;
      return {
        query,
        steps,
        result: analysisResult,
      };
    }

    return data;
  }, []);

  const {
    isConfigured,
    isInitialized,
    isLoading,
    error,
    data,
    widget,
  } = useSelector((state: RootState) => getWidget(state, id));
  const theme = useSelector((state: RootState) =>
    getActiveDashboardTheme(state)
  );

  const showVisualization = isConfigured && isInitialized && !isLoading;

  useEffect(() => {
    if (showVisualization) {
      datavizRef.current = createDataviz(
        widget as ChartWidget,
        theme,
        containerRef.current
      );

      if (error) {
        datavizRef.current.error(error.message, error.title);
      } else {
        datavizRef.current.render(getChartInput(data));
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
            datavizRef.current.render(getChartInput(data));
          }
          break;
      }
    });

    return () => dispose();
  }, [error, data, editorPubSub]);

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
            <ChartPlaceholder
              width={placeholder.width}
              height={placeholder.height}
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
