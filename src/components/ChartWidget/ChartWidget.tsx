import React, {
  FC,
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { Loader } from '@keen.io/ui-core';
import { ErrorWidget } from '@keen.io/widgets';
import { colors } from '@keen.io/colors';

import WidgetPlaceholder from '../WidgetPlaceholder';
import { Container, LoaderWrapper } from './ChartWidget.styles';

import { EditorContext } from '../../contexts';
import {
  getWidget,
  ChartWidget as ChartWidgetType,
} from '../../modules/widgets';
import { getInterimQuery } from '../../modules/queries';
import {
  themeSelectors,
  mergeSettingsWithFontFallback,
} from '../../modules/theme';
import { getPresentationTimezone } from '../../modules/timezone';
import { RootState } from '../../rootReducer';

import { OBSERVER_DELAY } from './constants';
import { RESIZE_WIDGET_EVENT } from '../../constants';

import getChartInput from '../../utils/getChartInput';
import { createDataviz } from './utils';
import { useTranslation } from 'react-i18next';
import { WidgetItem } from '../../modules/widgets/types';

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

  const { t } = useTranslation();

  const [inViewRef, inView] = useInView({
    delay: OBSERVER_DELAY,
    triggerOnce: true,
  });

  const { editorPubSub } = useContext(EditorContext);
  const [placeholder, setPlaceholder] = useState({ width: 0, height: 0 });

  const {
    isConfigured,
    isInitialized,
    isLoading,
    error,
    data,
    widget,
  } = useSelector((state: RootState) =>
    getWidget(state, id)
  ) as WidgetItem<ChartWidgetType>;

  const { query: widgetQuery } = widget;
  const isSavedQuery = typeof widgetQuery === 'string';

  const interimQuery = useSelector((state: RootState) =>
    getInterimQuery(state, id)
  );

  const {
    theme,
    settings,
    settings: {
      page: { chartTitlesFont },
    },
  } = useSelector((state: RootState) =>
    themeSelectors.getActiveDashboardThemeSettings(state)
  );

  const dashboardSettings = useSelector((state: RootState) =>
    themeSelectors.getActiveDashboardThemeSettings(state)
  );
  const showVisualization =
    isConfigured && isInitialized && !isLoading && !error;
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

  const setContainerRef = useCallback(
    (node: HTMLDivElement) => {
      containerRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  const tags = [];
  if (isSavedQuery && disableInteractions) {
    tags.push({ label: t('tags.saved_query'), variant: 'gray' });
  }

  useEffect(() => {
    if (showVisualization && inView) {
      const widgetWithTheming = mergeSettingsWithFontFallback(
        chartTitlesFont,
        widget as ChartWidgetType
      );

      datavizRef.current = createDataviz({
        widget: widgetWithTheming,
        theme,
        tags,
        container: containerRef.current,
        presentationTimezone: getTimezone(chartData),
        dashboardSettings: dashboardSettings.settings,
      });

      datavizRef.current.render(getChartInput(chartData));
    }
  }, [showVisualization, inView, theme, settings, chartData]);

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
      {error && <ErrorWidget header={error.title} message={error.message} />}
      {showVisualization ? (
        <Container
          data-testid="chart-widget-container"
          ref={setContainerRef}
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
