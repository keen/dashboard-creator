import React from 'react';
import { useDispatch } from 'react-redux';
import { Trans } from 'react-i18next';

import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';
import { MENU_ITEMS_ENUM } from '@keen.io/widget-customization';

import {
  GoToSection,
  VisualizationMessage,
  VisualizationMessageWrapper,
} from './GaugeChart.styles';

import {
  chartEditorActions,
  EditorSection,
} from '../../../../../../modules/chartEditor';

const GaugeChartMessage = () => {
  const dispatch = useDispatch();

  const goToChartElements = () => {
    dispatch(chartEditorActions.setEditorSection(EditorSection.SETTINGS));
    dispatch(
      chartEditorActions.setChartSettingsSection(MENU_ITEMS_ENUM.CHART_ELEMENTS)
    );
  };

  return (
    <VisualizationMessageWrapper data-testid="gauge-chart-message">
      <VisualizationMessage
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <BodyText variant="body2" color={colors.black[500]}>
          <Trans
            i18nKey={
              'query_visualization.go_to_chart_elements_to_define_target_value'
            }
            components={[
              <GoToSection
                onClick={goToChartElements}
                key="go-to-section"
              ></GoToSection>,
            ]}
          />
        </BodyText>
      </VisualizationMessage>
    </VisualizationMessageWrapper>
  );
};

export default GaugeChartMessage;
