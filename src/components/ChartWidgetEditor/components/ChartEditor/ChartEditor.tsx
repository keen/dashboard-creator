/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import deepEqual from 'deep-equal';
import QueryCreator from '@keen.io/query-creator';
import { getAvailableWidgets } from '@keen.io/widget-picker';
import { Button, Alert, Anchor } from '@keen.io/ui-core';
import { Query } from '@keen.io/query';

import {
  Container,
  QueryCreatorContainer,
  VisualizationContainer,
  NotificationBar,
  Cancel,
  Footer,
} from './ChartEditor.styles';

import {
  applyConfiguration,
  editorMounted,
  resetEditor,
  runQuery,
  setQuerySettings,
  setQueryDirty,
  setQueryChange,
  setVisualizationSettings,
  updateChartSettings,
  getChartEditor,
} from '../../../../modules/chartEditor';
import { getActiveDashboardTheme } from '../../../../modules/theme';

import { notificationBarMotion } from './motion';
import WidgetVisualization from '../WidgetVisualization';
import { AppContext } from '../../../../contexts';

type Props = {
  onClose: () => void;
};

// @TODO: Support host as context argument

const ChartEditor: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    modalContainer,
    project: { id, userKey, masterKey },
  } = useContext(AppContext);

  const [widgetError, setWidgetError] = useState(null);

  const {
    analysisResult,
    querySettings,
    visualization,
    isEditMode,
    isDirtyQuery,
    isQueryPerforming,
  } = useSelector(getChartEditor);
  const baseTheme = useSelector(getActiveDashboardTheme);

  const initialQueryRef = useRef(null);

  const [localQuery, setLocalQuery] = useState(null);
  const [initialQuery, setInitialQuery] = useState(null);

  initialQueryRef.current = initialQuery;

  const { type: widgetType } = visualization;

  const handleConfigurationApply = useCallback(() => {
    const availableWidgets = getAvailableWidgets(querySettings);
    if (availableWidgets.includes(widgetType)) {
      setWidgetError(null);
      dispatch(applyConfiguration());
    } else {
      setWidgetError(true);
    }
  }, [widgetType, querySettings]);

  const handleChartSettingsUpdate = useCallback(
    (chartSettings: Record<string, any>) => {
      dispatch(updateChartSettings(chartSettings));
    },
    []
  );

  useEffect(() => {
    if (initialQuery) {
      const hasQueryChanged = !deepEqual(initialQuery, querySettings, {
        strict: true,
      });
      dispatch(setQueryChange(hasQueryChanged));
    }
  }, [querySettings, initialQuery]);

  useEffect(() => {
    if (initialQuery && localQuery) {
      const isDirty = !deepEqual(localQuery, querySettings, {
        strict: true,
      });

      dispatch(setQueryDirty(isDirty));
    } else if (initialQuery && !localQuery) {
      setLocalQuery(querySettings);
    }
  }, [initialQuery, querySettings]);

  useEffect(() => {
    dispatch(editorMounted());

    return () => dispatch(resetEditor());
  }, []);

  const outdatedAnalysisResults = !!(analysisResult !== null && isDirtyQuery);

  return (
    <Container id="chart-editor">
      <AnimatePresence>
        {widgetError && (
          <NotificationBar {...notificationBarMotion}>
            <Alert type="error">{t('chart_widget_editor.widget_error')}</Alert>
          </NotificationBar>
        )}
      </AnimatePresence>
      <VisualizationContainer>
        <WidgetVisualization
          visualization={visualization}
          baseTheme={baseTheme}
          isQueryPerforming={isQueryPerforming}
          outdatedAnalysisResults={outdatedAnalysisResults}
          analysisResult={analysisResult}
          querySettings={querySettings}
          onRunQuery={() => {
            setWidgetError(null);
            dispatch(runQuery());
          }}
          onChangeVisualization={({ type, chartSettings, widgetSettings }) =>
            dispatch(
              setVisualizationSettings(type, chartSettings, widgetSettings)
            )
          }
        />
      </VisualizationContainer>
      <QueryCreatorContainer>
        <QueryCreator
          projectId={id}
          readKey={userKey}
          masterKey={masterKey}
          modalContainer={modalContainer}
          onUpdateChartSettings={handleChartSettingsUpdate}
          onUpdateQuery={(query: Query, isQueryReady: boolean) => {
            if (isEditMode) {
              if (isQueryReady) {
                dispatch(setQuerySettings(query));
                if (!initialQueryRef.current) {
                  setInitialQuery(query);
                }
              }
            } else {
              dispatch(setQuerySettings(query));
              if (!initialQueryRef.current) {
                setInitialQuery(query);
              }
            }
          }}
          host="staging-api.keen.io"
        />
      </QueryCreatorContainer>
      <Footer>
        <Button
          variant="secondary"
          isDisabled={isQueryPerforming}
          onClick={handleConfigurationApply}
        >
          {isEditMode
            ? t('chart_widget_editor.save')
            : t('chart_widget_editor.add_to_dashboard')}
        </Button>
        <Cancel>
          <Anchor onClick={onClose}>{t('chart_widget_editor.cancel')}</Anchor>
        </Cancel>
      </Footer>
    </Container>
  );
};
export default ChartEditor;
