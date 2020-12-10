import React, { FC, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import { Container } from './Toolbar.styles';

import ChartDragGhost from '../ChartDragGhost';
import WidgetItem from '../WidgetItem';
import { IconType } from '@keen.io/icons';

type Props = {
  /** Widget drag event handler */
  onWidgetDrag: (widgetType: string) => void;
};

const Toolbar: FC<Props> = ({ onWidgetDrag }) => {
  const { t } = useTranslation();
  const dragGhostElement = useRef<HTMLDivElement>(null);
  const dragEndHandler = useCallback(() => {
    if (dragGhostElement.current) dragGhostElement.current.remove();
  }, []);

  const dragStartHandler = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData('text/plain', '');
      const widgetType = e.currentTarget.getAttribute('data-widget-type');
      const element = document.createElement('div');

      dragGhostElement.current = element;
      ReactDOM.render(<ChartDragGhost />, element);

      document.body.appendChild(element);
      e.dataTransfer.setDragImage(element, 0, 0);

      onWidgetDrag(widgetType);
    },
    [onWidgetDrag]
  );

  const item = (type: string, icon: IconType, text: string): JSX.Element => {
    return (
      <div
        draggable
        unselectable="on"
        data-widget-type={type}
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
      >
        <WidgetItem icon={icon} text={text} />
      </div>
    );
  };

  return (
    <Container>
      {item('visualization', 'bar-widget-vertical', t('widget_item.chart'))}
      {item('text', 'text', t('widget_item.text'))}
      {item('visualization', 'image', t('widget_item.image'))}
      {item('visualization', 'funnel-widget-vertical', t('widget_item.filter'))}
      {item('visualization', 'date-picker', t('widget_item.date_picker'))}
    </Container>
  );
};

export default Toolbar;
