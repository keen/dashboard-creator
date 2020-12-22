import React, { FC, useCallback, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import { EditorContext } from '../../contexts';

import { Container } from './Toolbar.styles';

import ChartPlaceholder from '../ChartPlaceholder';
import DraggableItem from '../DraggableItem';

import { calculateGhostSize } from './utils';

import { WidgetType } from '../../types';

type Props = {
  /** Widget drag event handler */
  onWidgetDrag: (widgetType: string) => void;
};

const Toolbar: FC<Props> = ({ onWidgetDrag }) => {
  const { t } = useTranslation();
  const dragGhostElement = useRef<HTMLDivElement>(null);
  const dragEndHandler = useCallback(() => {
    if (dragGhostElement.current) {
      dragGhostElement.current.remove();
      ReactDOM.unmountComponentAtNode(dragGhostElement.current);
      dragGhostElement.current = null;
    }
  }, []);

  const { containerWidth } = useContext(EditorContext);

  const dragStartHandler = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData('text/plain', '');
      const widgetType = e.currentTarget.getAttribute(
        'data-widget-type'
      ) as WidgetType;
      const { width, height } = calculateGhostSize(containerWidth, widgetType);
      const element = document.createElement('div');

      const styles = {
        width,
        height,
        transform: 'translateX(-100%)',
        overflow: 'hidden',
      };
      Object.assign(element.style, styles);

      dragGhostElement.current = element;
      ReactDOM.render(
        <ChartPlaceholder width={width} height={height} />,
        element
      );

      document.body.appendChild(element);
      e.dataTransfer.setDragImage(element, 0, 0);

      onWidgetDrag(widgetType);
    },
    [onWidgetDrag]
  );

  return (
    <Container>
      <DraggableItem
        type="visualization"
        icon="bar-widget-vertical"
        text={t('widget_item.chart')}
        dragStartHandler={dragStartHandler}
        dragEndHandler={dragEndHandler}
        key="chart"
      />
      <DraggableItem
        type="text"
        icon="text"
        text={t('widget_item.text')}
        dragStartHandler={dragStartHandler}
        dragEndHandler={dragEndHandler}
        key="text"
      />
      <DraggableItem
        type="visualization"
        icon="image"
        text={t('widget_item.image')}
        dragStartHandler={dragStartHandler}
        dragEndHandler={dragEndHandler}
        key="image"
      />
      <DraggableItem
        type="visualization"
        icon="funnel-widget-vertical"
        text={t('widget_item.filter')}
        dragStartHandler={dragStartHandler}
        dragEndHandler={dragEndHandler}
        key="filter"
      />
      <DraggableItem
        type="visualization"
        icon="date-picker"
        text={t('widget_item.date_picker')}
        dragStartHandler={dragStartHandler}
        dragEndHandler={dragEndHandler}
        key="date_picker"
      />
    </Container>
  );
};

export default Toolbar;
