import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getAvailableWidgets, WidgetPicker } from '@keen.io/widget-picker';

import { Placeholder, Container } from './WidgetVisualization.styles';

type Props = {
  /** Query results */
  analysisResult?: Record<string, any>;
  /** Query settings */
  querySettings: Record<string, any>;
};

const WidgetVisualization: FC<Props> = ({ querySettings, analysisResult }) => {
  const { t } = useTranslation();
  const widgets = useMemo(() => getAvailableWidgets(querySettings), [
    analysisResult,
  ]);

  return (
    <Container>
      {analysisResult ? (
        <>
          <div>
            <WidgetPicker
              widgets={widgets}
              currentWidget={null}
              chartSettings={{}}
              widgetSettings={{}}
              onUpdateSettings={(widgetType, chartSettings, widgetSettings) => {
                console.log(
                  'onUpdateSettings',
                  widgetType,
                  chartSettings,
                  widgetSettings
                );
              }}
            />
          </div>
          <div>chart</div>
        </>
      ) : (
        <Placeholder>
          {t('chart_widget_editor.run_query_placeholder')}
        </Placeholder>
      )}
    </Container>
  );
};

export default WidgetVisualization;
