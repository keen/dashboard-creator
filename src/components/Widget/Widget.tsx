import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  StyledCard,
  TextManagementContainer,
  FilterContainer,
  ChartVisualizationContainer,
} from './Widget.styles';

import ChartWidget from '../ChartWidget';
import TextWidget from '../TextWidget';
import ImageWidget from '../ImageWidget';
import DatePickerWidget from '../DatePickerWidget';

import ImageManagement from '../ImageManagement';
import ChartManagement from '../ChartManagement';
import TextManagement from '../TextManagement';
import ChartWidgetFilter from '../ChartWidgetFilter';
import FilterWidget from '../FilterWidget';
import FilterManagement from '../FilterManagement';

import WidgetCover from './components/WidgetCover';

import { cardSettings } from './utils';

import {
  editDatePickerWidget,
  getWidget,
  VisualizationSettings,
} from '../../modules/widgets';
import { getDashboardSettings } from '../../modules/dashboards';
import { editFilterWidget } from '../../modules/widgets/actions';
import { appSelectors } from '../../modules/app';
import { themeSelectors } from '../../modules/theme';

import { RootState } from '../../rootReducer';
import { RenderOptions } from './types';

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
  error,
  cardEnabled,
  onRemoveWidget,
  onEditWidget,
  dashboardSettings,
}: RenderOptions) => {
  const enableHover = isHoverActive && !isHighlighted && !isFadeOut && !title;

  const { tiles: tileSettings } = dashboardSettings;

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
      const node = (
        <ChartVisualizationContainer enableOverflow={!cardEnabled}>
          <ChartWidget id={widgetId} disableInteractions={isEditorMode} />
          {isEditorMode && (
            <ChartManagement
              widgetId={widgetId}
              error={error}
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
        </ChartVisualizationContainer>
      );

      return cardEnabled ? (
        <StyledCard
          isFadeOut={isFadeOut}
          isHighlighted={isHighlighted}
          background={tileSettings.background}
          borderWidth={tileSettings.borderWidth}
          borderRadius={tileSettings.borderRadius}
          borderColor={tileSettings.borderColor}
          hasShadow={tileSettings.hasShadow}
        >
          {node}
        </StyledCard>
      ) : (
        node
      );
    case 'image':
      return (
        <StyledCard
          isFadeOut={isFadeOut}
          isHighlighted={isHighlighted}
          background={tileSettings.background}
          borderWidth={tileSettings.borderWidth}
          borderRadius={tileSettings.borderRadius}
          borderColor={tileSettings.borderColor}
          padding={tileSettings.padding}
          hasShadow={tileSettings.hasShadow}
        >
          <ImageWidget
            id={widgetId}
            placeholderBackgroundColor={tileSettings.background}
          />
          {isEditorMode && (
            <ImageManagement
              widgetId={widgetId}
              isHoverActive={enableHover}
              onRemoveWidget={onRemoveWidget}
            />
          )}
        </StyledCard>
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
    widget: { id: widgetId, type: widgetType, settings },
    error,
    isHighlighted,
    isFadeOut,
    isDetached,
    isTitleCover,
  } = useSelector((rootState: RootState) => getWidget(rootState, id));

  const visualizationSettings = settings as VisualizationSettings;

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

  const { settings: dashboardWidgetSettings } = useSelector(
    themeSelectors.getActiveDashboardThemeSettings
  );

  return renderWidget({
    widgetType,
    widgetId,
    isEditorMode,
    isDetached,
    isHoverActive,
    isHighlighted,
    isFadeOut,
    onRemoveWidget,
    onEditWidget,
    error,
    title: widgetTitle,
    dashboardSettings: dashboardWidgetSettings,
    cardEnabled: cardSettings(widgetType, visualizationSettings),
  });
};

export default Widget;
