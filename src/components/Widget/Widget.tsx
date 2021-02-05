import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Container, TextManagementContainer } from './Widget.styles';

import ChartWidget from '../ChartWidget';
import TextWidget from '../TextWidget';
import ImageWidget from '../ImageWidget';

import ImageManagement from '../ImageManagement';
import ChartManagement from '../ChartManagement';
import TextManagement from '../TextManagement';

import WidgetCover from './components/WidgetCover';

import { getWidget } from '../../modules/widgets';
import { getActiveDashboard } from '../../modules/app';
import { getDashboardSettings } from '../../modules/dashboards';

import { RootState } from '../../rootReducer';
import { RenderOptions } from './types';
import ChartWidgetFilter from '../ChartWidgetFilter';

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
  onRemoveWidget,
}: RenderOptions) => {
  const enableHover = isHoverActive && !isHighlighted && !isFadeOut && !title;
  switch (widgetType) {
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
        <Container>
          <ChartWidget id={widgetId} disableInteractions={isEditorMode} />
          <ChartManagement
            widgetId={widgetId}
            isHoverActive={enableHover}
            onRemoveWidget={onRemoveWidget}
          />
          {(isHighlighted || title) && (
            <WidgetCover isHighlighted={isHighlighted} title={title} />
          )}
          {!isEditorMode && <ChartWidgetFilter />}
        </Container>
      );
    case 'image':
      return (
        <Container isFadeOut={isFadeOut}>
          <ImageWidget id={widgetId} />
          <ImageManagement
            widgetId={widgetId}
            isHoverActive={enableHover}
            onRemoveWidget={onRemoveWidget}
          />
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

  return renderWidget({
    widgetType,
    widgetId,
    isEditorMode,
    isHoverActive,
    isHighlighted,
    isFadeOut,
    title: widgetTitle,
    onRemoveWidget,
  });
};

export default Widget;
