/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import deepEqual from 'deep-equal';
import QueryCreator from '@keen.io/query-creator';
import { getAvailableWidgets } from '@keen.io/widget-picker';
import { Button, Alert, Anchor, FadeLoader } from '@keen.io/ui-core';
import { Query } from '@keen.io/query';

import {
  Container,
  QueryCreatorContainer,
  VisualizationContainer,
  Cancel,
  Footer,
  FooterAside,
  WidgetError,
} from './ChartEditor.styles';

import {
  applyConfiguration,
  editorMounted,
  runQuery,
  setQuerySettings,
  setQueryChange,
  setVisualizationSettings,
  updateChartSettings,
  getChartEditor,
} from '../../../../modules/chartEditor';
import { getActiveDashboardTheme } from '../../../../modules/theme';

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
    isQueryPerforming,
  } = useSelector(getChartEditor);
  const baseTheme = useSelector(getActiveDashboardTheme);

  const queryRef = useRef(null);
  const [initialQuery, setInitialQuery] = useState(null);
  queryRef.current = initialQuery;

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
    dispatch(editorMounted());
  }, []);

  useEffect(() => {
    if (initialQuery) {
      const hasQueryChanged = !deepEqual(initialQuery, querySettings, {
        strict: true,
      });
      dispatch(setQueryChange(hasQueryChanged));
    }
  }, [querySettings, initialQuery]);

  return (
    <Container>
      {widgetError && (
        <WidgetError>
          <Alert type="error">{t('chart_widget_editor.widget_error')}</Alert>
        </WidgetError>
      )}
      <VisualizationContainer>
        <WidgetVisualization
          visualization={visualization}
          baseTheme={baseTheme}
          analysisResult={analysisResult}
          querySettings={querySettings}
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
          onUpdateQuery={(query: Query) => {
            dispatch(setQuerySettings(query));
            if (!queryRef.current) {
              setInitialQuery(query);
            }
          }}
          host="staging-api.keen.io"
        />
      </QueryCreatorContainer>
      <Footer>
        <Button
          variant="success"
          isDisabled={isQueryPerforming}
          icon={isQueryPerforming && <FadeLoader />}
          onClick={() => {
            setWidgetError(null);
            dispatch(runQuery());
          }}
        >
          {isQueryPerforming
            ? t('chart_widget_editor.run_query_loading')
            : t('chart_widget_editor.run_query')}
        </Button>
        <FooterAside>
          <Cancel>
            <Anchor onClick={onClose}>{t('chart_widget_editor.cancel')}</Anchor>
          </Cancel>
          <Button
            variant="secondary"
            isDisabled={isQueryPerforming}
            onClick={handleConfigurationApply}
          >
            {isEditMode
              ? t('chart_widget_editor.save')
              : t('chart_widget_editor.add_to_dashboard')}
          </Button>
        </FooterAside>
      </Footer>
    </Container>
  );
};
export default ChartEditor;
