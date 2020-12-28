import React, { FC, useContext, useState, useRef, useEffect } from 'react';
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

import {
  getWidgetsPosition,
  WidgetsPosition,
  GridPosition,
} from '../../modules/widgets';
import { RootState } from '../../rootReducer';
import { getDroppingItemSize } from '../../utils';

import {
  GRID_CONTAINER_ID,
  ROW_HEIGHT,
  GRID_MARGIN,
  GRID_BREAKPOINTS,
  GRID_COLS,
  GRID_CONTAINER_PADDING,
} from './constants';

type Props = {
  /** Widgets identifiers used on grid layout */
  widgetsId: string[];
  /** Resize widgets event handler */
  onWidgetResize?: (widgetsPosition: WidgetsPosition, widgetId: string) => void;
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
  const containerRef = useRef(null);

  const { droppableWidget, setContainerWidth } = useContext(EditorContext);
  const [activeWidget, setActiveWidget] = useState(null);
  const [isResize, setResize] = useState(false);

  const onResizeStart = () => {
    setResize(true);
  };

  const onResizeStop = (
    items: WidgetsPosition,
    item: GridPosition & {
      i: string;
    }
  ) => {
    const { i: id } = item;
    setResize(false);
    if (onWidgetResize) onWidgetResize(items, id);
  };

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth && setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef.current]);

  return (
    <Container id={GRID_CONTAINER_ID} ref={containerRef}>
      <ResponsiveReactGridLayout
        draggableHandle={`.${DRAG_HANDLE_ELEMENT}`}
        isDraggable={isEditorMode}
        isResizable={isEditorMode}
        isDroppable={isEditorMode}
        onDragStop={onWidgetDrag}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        onDrop={onWidgetDrop}
        breakpoints={GRID_BREAKPOINTS}
        cols={GRID_COLS}
        containerPadding={GRID_CONTAINER_PADDING as [number, number]}
        rowHeight={ROW_HEIGHT}
        margin={GRID_MARGIN as [number, number]}
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
        onWidthChange={(containerWidth) =>
          setContainerWidth && setContainerWidth(containerWidth)
        }
        measureBeforeMount
      >
        {widgets.map(({ id, position }) => (
          <div
            key={id}
            data-grid={{ ...position, i: id, static: false }}
            onMouseEnter={() => !isResize && setActiveWidget(id)}
            onMouseLeave={() => setActiveWidget(null)}
          >
            <Widget
              id={id}
              onRemoveWidget={() => onRemoveWidget(id)}
              isHoverActive={isEditorMode && id === activeWidget}
              disableInteractions={isEditorMode}
            />
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </Container>
  );
};

export default Grid;
