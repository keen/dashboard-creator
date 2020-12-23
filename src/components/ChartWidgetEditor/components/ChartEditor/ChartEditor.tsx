import React, { FC, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import QueryCreator from '@keen.io/query-creator';
import { Button, Anchor } from '@keen.io/ui-core';
import { Query } from '@keen.io/query';

import {
  Container,
  VisualizationContainer,
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

import WidgetVisualization from '../WidgetVisualization';
import { AppContext } from '../../../../contexts';

type Props = {
  onClose: () => void;
};

// @TODO: Modal container

const ChartEditor: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    project: { id, userKey, masterKey },
  } = useContext(AppContext);

  const {
    analysisResult,
    querySettings,
    visualization,
    isQueryPerforming,
  } = useSelector(getChartEditor);

  useEffect(() => {
    dispatch(editorMounted());
  }, []);

  return (
    <Container>
      <VisualizationContainer>
        <WidgetVisualization
          visualization={visualization}
          analysisResult={analysisResult}
          querySettings={querySettings}
          onChangeVisualization={({ type, chartSettings, widgetSettings }) =>
            dispatch(
              setVisualizationSettings(type, chartSettings, widgetSettings)
            )
          }
        />
      </VisualizationContainer>
      <QueryCreator
        projectId={id}
        readKey={userKey}
        masterKey={masterKey}
        onUpdateQuery={(query: Query) => dispatch(setQuerySettings(query))}
        host="staging-api.keen.io"
      />
      <Footer>
        <Button
          variant="success"
          isDisabled={isQueryPerforming}
          onClick={() => dispatch(runQuery())}
        >
          {t('chart_widget_editor.run_query')}
        </Button>
        <FooterAside>
          <Anchor onClick={onClose}>{t('chart_widget_editor.cancel')}</Anchor>
          <Button
            variant="secondary"
            isDisabled={isQueryPerforming}
            onClick={() => dispatch(applyConfiguration())}
          >
            {t('chart_widget_editor.add_to_dashboard')}
          </Button>
        </FooterAside>
      </Footer>
    </Container>
  );
};
export default ChartEditor;
