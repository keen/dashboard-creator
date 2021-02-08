import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  Container,
  TextManagementContainer,
  DatePickerContainer,
} from './Widget.styles';

import ChartWidget from '../ChartWidget';
import TextWidget from '../TextWidget';
import ImageWidget from '../ImageWidget';
import DatePickerWidget from '../DatePickerWidget';

import ImageManagement from '../ImageManagement';
import ChartManagement from '../ChartManagement';
import TextManagement from '../TextManagement';
import DatePickerManagement from '../DatePickerManagement';

import WidgetCover from './components/WidgetCover';

import { getWidget } from '../../modules/widgets';
import { getActiveDashboard } from '../../modules/app';
import { getDashboardSettings } from '../../modules/dashboards';

import { RootState } from '../../rootReducer';
import { RenderOptions } from './types';
import ChartWidgetFilter from '../ChartWidgetFilter';
import { getInterimQuery } from '../../modules/queries';

type Props = {
  /** Widget identifier */
  id: string;
  /** Widget hover indicator */
  isHoverActive: boolean;
  /** Editor mode indicator */
  isEditorMode?: boolean;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
};

const renderWidget = ({
  widgetType,
  widgetId,
  isEditorMode,
  isHoverActive,
  isHighlighted,
  isFadeOut,
  title,
  datePickerData,
  hasInterimQuery,
  onRemoveWidget,
}: RenderOptions) => {
  const enableHover = isHoverActive && !isHighlighted && !isFadeOut && !title;
  switch (widgetType) {
    case 'date-picker':
      return (
        <DatePickerContainer isFadeOut={isFadeOut}>
          <DatePickerWidget id={widgetId} disableInteractions={isEditorMode} />
          {isEditorMode && (
            <DatePickerManagement
              id={widgetId}
              isHoverActive={isHoverActive}
              onRemoveWidget={onRemoveWidget}
            />
          )}
        </DatePickerContainer>
      );
    case 'text':
      if (isEditorMode) {
        return (
          <TextManagementContainer isFadeOut={isFadeOut}>
            <TextManagement
              id={widgetId}
              isHoverActive={enableHover}
              onRemoveWidget={onRemoveWidget}
            />
          </TextManagementContainer>
        );
      } else {
        return <TextWidget id={widgetId} />;
      }
    case 'visualization':
      return (
        <Container isFadeOut={isFadeOut}>
          <ChartWidget id={widgetId} disableInteractions={isEditorMode} />
          {isEditorMode && (
            <ChartManagement
              widgetId={widgetId}
              isHoverActive={enableHover}
              onRemoveWidget={onRemoveWidget}
            />
          )}
          {(isHighlighted || title) && (
            <WidgetCover isHighlighted={isHighlighted} title={title} />
          )}
          {!isEditorMode && hasInterimQuery && datePickerData && (
            <ChartWidgetFilter timeframe={datePickerData.timeframe} />
          )}
        </Container>
      );
    case 'image':
      return (
        <Container isFadeOut={isFadeOut}>
          <ImageWidget id={widgetId} />
          {isEditorMode && (
            <ImageManagement
              widgetId={widgetId}
              isHoverActive={enableHover}
              onRemoveWidget={onRemoveWidget}
            />
          )}
        </Container>
      );
    default:
      return null;
  }
};

const Widget: FC<Props> = ({
  id,
  isHoverActive,
  onRemoveWidget,
  isEditorMode = false,
}) => {
  const { t } = useTranslation();
  const {
    widget: { id: widgetId, type: widgetType },
    widget,
    isHighlighted,
    isFadeOut,
    isTitleCover,
  } = useSelector((rootState: RootState) => getWidget(rootState, id));

  const widgetTitle = useSelector((state: RootState) => {
    if (!isTitleCover) return;

    const activeDashboard = getActiveDashboard(state);
    const { widgets } = getDashboardSettings(state, activeDashboard);
    const index = widgets.findIndex((item) => item === id);

    return `${t('widget_item.chart')} ${index + 1}`;
  });

  const datePickerData = useSelector((state: RootState) => {
    if (!widget['datePickerId']) return;

    const { data } = getWidget(state, widget['datePickerId']);
    return data;
  });

  const hasInterimQuery = useSelector((state: RootState) => {
    const interimQuery = getInterimQuery(state, widgetId);
    return !!interimQuery;
  });

  return renderWidget({
    widgetType,
    widgetId,
    isEditorMode,
    isHoverActive,
    isHighlighted,
    isFadeOut,
    title: widgetTitle,
    datePickerData,
    hasInterimQuery,
    onRemoveWidget,
  });
};

export default Widget;
