/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC, useState, useEffect, useCallback, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import deepEqual from 'deep-equal';
import { transparentize } from 'polished';

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
  FadeLoader,
} from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';
import { BodyText } from '@keen.io/typography';
import { Icon } from '@keen.io/icons';

import {
  Container,
  SectionContainer,
  VisualizationContainer,
  NotificationBar,
  Cancel,
  NavBar,
  Footer,
  IconContainer,
  RunQuery,
} from './ChartEditor.styles';

import {
  chartEditorActions,
  chartEditorSelectors,
  EditorSection,
} from '../../../../modules/chartEditor';

import { themeHooks } from '../../../../modules/theme';
import { AppContext } from '../../../../contexts';

import WidgetVisualization from '../WidgetVisualization';
import QueryEditor from '../QueryEditor';
import Navigation from '../Navigation';

import { CHART_EDITOR_ERRORS } from './constants';
import { TOOLTIP_MOTION } from '../../../../constants';

import { ChartEditorError } from './types';

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
    isDirtyQuery,
    isQueryPerforming,
    queryError,
  } = useSelector(chartEditorSelectors.getChartEditor);

  const { modalContainer } = useContext(AppContext);
  const { type: widgetType, widgetSettings, chartSettings } = visualization;

  const customizationSections = useCustomizationSections(
    !!analysisResult,
    querySettings as Query,
    widgetType
  );

  const {
    themedChartSettings,
    themedWidgetSettings,
  } = themeHooks.useApplyWidgetTheming({
    chartSettings,
    widgetSettings,
    dependencies: [widgetType, chartSettings, widgetSettings],
  });

  const [
    widgetCustomization,
    setCustomizationSettings,
  ] = useState<SerializedSettings>(() =>
    serializeInputSettings(
      widgetType,
      themedChartSettings,
      themedWidgetSettings
    )
  );

  const onApplyConfiguration = useCallback(() => {
    const availableWidgets = getAvailableWidgets(querySettings);
    if (availableWidgets.includes(widgetType) && analysisResult) {
      setError(null);
      return dispatch(chartEditorActions.applyConfiguration());
    }
    setError(ChartEditorError.WIDGET);
  }, [widgetType, querySettings, analysisResult]);

  const onRunQuery = () => {
    setError(null);
    dispatch(chartEditorActions.runQuery());
  };

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

  const onChangeVisualization = ({
    type,
    chartSettings,
    widgetSettings: defaultWidgetSettings,
  }) => {
    dispatch(chartEditorActions.setQueryChange(true));
    const chart = serializeOutputSettings(type, widgetCustomization.chart);
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
          visualization={{
            ...visualization,
            widgetSettings: themedWidgetSettings,
            chartSettings: themedChartSettings,
          }}
          isQueryPerforming={isQueryPerforming}
          isSavedQuery={isSavedQuery}
          outdatedAnalysisResults={outdatedAnalysisResults}
          analysisResult={analysisResult}
          querySettings={querySettings}
          onRunQuery={onRunQuery}
          onChangeVisualization={onChangeVisualization}
        />
        <IconContainer onClick={onClose} data-testid="close-handler">
          <Icon
            type="close"
            width={16}
            height={16}
            fill={transparentize(0.5, colors.black[100])}
          />
        </IconContainer>
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
            widgetType={widgetType}
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
        <RunQuery>
          <Button
            variant="success"
            isDisabled={!outdatedAnalysisResults || isQueryPerforming}
            icon={isQueryPerforming && <FadeLoader />}
            onClick={onRunQuery}
          >
            {isQueryPerforming
              ? t('chart_widget_editor.run_query_loading')
              : t('chart_widget_editor.run_query')}
          </Button>
        </RunQuery>
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
      </Footer>
    </Container>
  );
};
export default ChartEditor;
