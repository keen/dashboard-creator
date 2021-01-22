import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { Container } from './Widget.styles';

import ChartWidget from '../ChartWidget';
import TextWidget from '../TextWidget';
import ImageWidget from '../ImageWidget';

import ImageManagement from '../ImageManagement';
import ChartManagement from '../ChartManagement';
import TextManagement from '../TextManagement';

import { getWidget } from '../../modules/widgets';

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
};

const renderWidget = ({
  widgetType,
  widgetId,
  isEditorMode,
  isHoverActive,
  onRemoveWidget,
}: RenderOptions) => {
  switch (widgetType) {
    case 'text':
      if (isEditorMode) {
        return (
          <TextManagement
            id={widgetId}
            isHoverActive={isHoverActive}
            onRemoveWidget={onRemoveWidget}
          />
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
            isHoverActive={isHoverActive}
            onRemoveWidget={onRemoveWidget}
          />
        </Container>
      );
    case 'image':
      return (
        <Container>
          <ImageWidget id={widgetId} />
          <ImageManagement
            widgetId={widgetId}
            isHoverActive={isHoverActive}
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
  const {
    widget: { id: widgetId, type: widgetType },
  } = useSelector((rootState: RootState) => getWidget(rootState, id));

  return renderWidget({
    widgetType,
    widgetId,
    isEditorMode,
    isHoverActive,
    onRemoveWidget,
  });
};

export default Widget;
