import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import {
  WidthProvider,
  Responsive,
  Layout as LayoutItem,
} from 'react-grid-layout';

import { Container } from './Grid.styles';
import Widget from '../Widget';

import { getWidgetsPosition, WidgetsPosition } from '../../modules/widgets';
import { RootState } from '../../rootReducer';

import { GRID_CONTAINER_ID } from './constants';

type Props = {
  /** Widgets identifiers used on grid layout */
  widgetsId: string[];
  /** Resize widgets event handler */
  onWidgetResize?: (widgetsPosition: WidgetsPosition) => void;
  /** Drag widget event handler */
  onWidgetDrag?: (widgetsPosition: WidgetsPosition) => void;
  /** Widget drop event handler */
  onWidgetDrop?: (
    widgetsPosition: WidgetsPosition,
    droppedItem: LayoutItem
  ) => void;
  /** Remove widget event handler */
  onRemoveWidget?: (widgetId: string) => void;
  /** Edit mode indicator */
  isEditorMode?: boolean;
};

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Grid: FC<Props> = ({
  widgetsId,
  onWidgetDrag,
  onWidgetResize,
  onWidgetDrop,
  onRemoveWidget,
  isEditorMode = false,
}) => {
  const widgets = useSelector((state: RootState) =>
    getWidgetsPosition(state, widgetsId)
  );

  return (
    <Container id={GRID_CONTAINER_ID}>
      <ResponsiveReactGridLayout
        isDraggable={isEditorMode}
        isResizable={isEditorMode}
        isDroppable={isEditorMode}
        onDragStop={onWidgetDrag}
        onResizeStop={onWidgetResize}
        onDrop={onWidgetDrop}
      >
        {widgets.map(({ id, position }) => (
          <div key={id} data-grid={{ ...position, i: id, static: false }}>
            <Widget id={id} onRemoveWidget={() => onRemoveWidget(id)} />
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </Container>
  );
};

export default Grid;
