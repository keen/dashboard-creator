import React, { FC, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import QueryCreator from '@keen.io/query-creator';
import { Button, Anchor, FadeLoader } from '@keen.io/ui-core';
import { Query } from '@keen.io/query';

import {
  Container,
  QueryCreatorContainer,
  VisualizationContainer,
  Cancel,
  Footer,
  FooterAside,
} from './ChartEditor.styles';

import {
  applyConfiguration,
  editorMounted,
  runQuery,
  setQuerySettings,
  setVisualizationSettings,
  getChartEditor,
} from '../../../../modules/chartEditor';
import { getActiveDashboardTheme } from '../../../../modules/theme';

import WidgetVisualization from '../WidgetVisualization';
import { AppContext } from '../../../../contexts';

type Props = {
  onClose: () => void;
};

// @TODO: Host

const ChartEditor: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    modalContainer,
    project: { id, userKey, masterKey },
  } = useContext(AppContext);

  const {
    analysisResult,
    querySettings,
    visualization,
    isEditMode,
    isQueryPerforming,
  } = useSelector(getChartEditor);
  const baseTheme = useSelector(getActiveDashboardTheme);

  useEffect(() => {
    dispatch(editorMounted());
  }, []);

  return (
    <Container>
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
          onUpdateQuery={(query: Query) => dispatch(setQuerySettings(query))}
          host="staging-api.keen.io"
        />
      </QueryCreatorContainer>
      <Footer>
        <Button
          variant="success"
          isDisabled={isQueryPerforming}
          icon={isQueryPerforming && <FadeLoader />}
          onClick={() => dispatch(runQuery())}
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
            onClick={() => dispatch(applyConfiguration())}
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
