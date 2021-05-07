import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  Container,
  TextManagementContainer,
  FilterContainer,
} from './Widget.styles';

import ChartWidget from '../ChartWidget';
import TextWidget from '../TextWidget';
import ImageWidget from '../ImageWidget';
import DatePickerWidget from '../DatePickerWidget';

import ImageManagement from '../ImageManagement';
import ChartManagement from '../ChartManagement';
import TextManagement from '../TextManagement';

import WidgetCover from './components/WidgetCover';

import { editDatePickerWidget, getWidget } from '../../modules/widgets';
import { getDashboardSettings } from '../../modules/dashboards';

import { RootState } from '../../rootReducer';
import { RenderOptions } from './types';
import ChartWidgetFilter from '../ChartWidgetFilter';
import FilterWidget from '../FilterWidget/FilterWidget';
import FilterManagement from '../FilterManagement';
import { editFilterWidget } from '../../modules/widgets/actions';
import { appSelectors } from '../../modules/app';

type Props = {
  /** Widget identifier */
  id: string;
  /** Widget hover indicator */
  isHoverActive: boolean;
  /** Editor mode indicator */
  isEditorMode?: boolean;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
  /** Edit widget event handler */
  onEditWidget?: () => void;
};

const renderWidget = ({
  widgetType,
  widgetId,
  isEditorMode,
  isHoverActive,
  isHighlighted,
  isDetached,
  isFadeOut,
  title,
  onRemoveWidget,
  onEditWidget,
}: RenderOptions) => {
  const enableHover = isHoverActive && !isHighlighted && !isFadeOut && !title;
  switch (widgetType) {
    case 'date-picker':
      return (
        <FilterContainer isFadeOut={isFadeOut}>
          <DatePickerWidget id={widgetId} disableInteractions={isEditorMode} />
          {isEditorMode && (
            <FilterManagement
              id={widgetId}
              isHoverActive={isHoverActive}
              onRemoveWidget={onRemoveWidget}
              onEditWidget={onEditWidget}
            />
          )}
        </FilterContainer>
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
        <Container isFadeOut={isFadeOut} isHighlighted={isHighlighted}>
          <ChartWidget id={widgetId} disableInteractions={isEditorMode} />
          {isEditorMode && (
            <ChartManagement
              widgetId={widgetId}
              isHoverActive={enableHover}
              onRemoveWidget={onRemoveWidget}
            />
          )}
          {(isHighlighted || isDetached || title) && (
            <WidgetCover
              isHighlighted={isHighlighted}
              isDetached={isDetached}
              title={title}
            />
          )}
          {!isEditorMode && <ChartWidgetFilter widgetId={widgetId} />}
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
    case 'filter':
      return (
        <FilterContainer isFadeOut={isFadeOut}>
          <FilterWidget id={widgetId} disableInteractions={isEditorMode} />
          {isEditorMode && (
            <FilterManagement
              id={widgetId}
              isHoverActive={isHoverActive}
              onRemoveWidget={onRemoveWidget}
              onEditWidget={onEditWidget}
            />
          )}
        </FilterContainer>
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
  const dispatch = useDispatch();
  const {
    widget: { id: widgetId, type: widgetType },
    isHighlighted,
    isFadeOut,
    isDetached,
    isTitleCover,
  } = useSelector((rootState: RootState) => getWidget(rootState, id));

  const widgetTitle = useSelector((state: RootState) => {
    if (!isTitleCover) return;

    const activeDashboard = appSelectors.getActiveDashboard(state);
    const { widgets } = getDashboardSettings(state, activeDashboard);
    const index = widgets.findIndex((item) => item === id);

    return `${t('widget_item.chart')} ${index + 1}`;
  });

  let onEditWidget = null;
  if (widgetType === 'filter') {
    onEditWidget = () => dispatch(editFilterWidget(id));
  }
  if (widgetType === 'date-picker') {
    onEditWidget = () => dispatch(editDatePickerWidget(id));
  }

  return renderWidget({
    widgetType,
    widgetId,
    isEditorMode,
    isDetached,
    isHoverActive,
    isHighlighted,
    isFadeOut,
    title: widgetTitle,
    onRemoveWidget,
    onEditWidget,
  });
};

export default Widget;
