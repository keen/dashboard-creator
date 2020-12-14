import React, { FC, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  WidthProvider,
  Responsive,
  Layout as LayoutItem,
} from 'react-grid-layout';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { EditorContext } from '../../contexts';

import { Container } from './Grid.styles';
import Widget, { DRAG_HANDLE_ELEMENT } from '../Widget';

import { getWidgetsPosition, WidgetsPosition } from '../../modules/widgets';
import { RootState } from '../../rootReducer';
import { getDroppingItemSize } from '../../utils';

import { RESIZE_WIDGET_EVENT } from '../../constants';
import { GRID_CONTAINER_ID, ROW_HEIGHT, GRID_MARGIN } from './constants';

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

  const { setGridSize, droppableWidget, editorPubSub } = useContext(
    EditorContext
  );
  const [cover, showCover] = useState(null);
  const [isResize, setResize] = useState(false);

  const onResizeStart = () => {
    setResize(true);
  };

  const onResizeStop = (_items, item) => {
    const { i: id } = item;
    setResize(false);
    editorPubSub.publish(RESIZE_WIDGET_EVENT, { id });
    if (onWidgetResize) onWidgetResize;
  };

  return (
    <Container id={GRID_CONTAINER_ID}>
      <ResponsiveReactGridLayout
        draggableHandle={`.${DRAG_HANDLE_ELEMENT}`}
        isDraggable={isEditorMode}
        isResizable={isEditorMode}
        isDroppable={isEditorMode}
        onDragStop={onWidgetDrag}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        onDrop={onWidgetDrop}
        rowHeight={ROW_HEIGHT}
        margin={GRID_MARGIN}
        measureBeforeMount
        resizeHandle={
          <div className="react-resizable-handle react-resizable-handle-se">
            <Icon
              type="resize"
              width={15}
              height={15}
              fill={colors.white[500]}
            />
          </div>
        }
        droppingItem={getDroppingItemSize(droppableWidget)}
        onWidthChange={(containerWidth, margin, cols, containerPadding) =>
          setGridSize &&
          setGridSize({ containerWidth, margin, cols, containerPadding })
        }
      >
        {widgets.map(({ id, position }) => (
          <div
            key={id}
            data-grid={{ ...position, i: id, static: false }}
            onMouseOver={() => !isResize && showCover(id)}
            onMouseLeave={() => showCover(null)}
          >
            <Widget
              id={id}
              onRemoveWidget={() => onRemoveWidget(id)}
              showCover={isEditorMode && id === cover}
            />
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </Container>
  );
};

export default Grid;
