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
import { getDroppingItemSize, getGridItemStyles } from '../../utils';

import {
  GRID_CONTAINER_ID,
  ROW_HEIGHT,
  GRID_MARGIN,
  GRID_BREAKPOINTS,
  GRID_COLS_EDIT_MODE,
  GRID_COLS_VIEW_MODE,
  GRID_CONTAINER_PADDING,
  DISABLED_WIDGET_RESIZE,
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
  /** Grid gap settings */
  gridGap?: number;
};

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Grid: FC<Props> = ({
  widgetsId,
  onWidgetDrag,
  onWidgetResize,
  onWidgetDrop,
  onRemoveWidget,
  gridGap,
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

  // This function creates mapped grid for ReactResponsiveGrid component, which cannot detect all the changes between rerenders in some cases, with only data-grid attribute provided.
  // This allows new element to be positioned correctly inside the grid after drop.
  const generateLayouts = () => {
    return {
      lg: widgets.map((widget) => ({
        i: widget.id,
        static: false,
        isResizable:
          isEditorMode && !DISABLED_WIDGET_RESIZE.includes(widget.type),
        ...widget.position,
      })),
    };
  };

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
        layouts={generateLayouts()}
        breakpoints={GRID_BREAKPOINTS}
        cols={isEditorMode ? GRID_COLS_EDIT_MODE : GRID_COLS_VIEW_MODE}
        containerPadding={GRID_CONTAINER_PADDING as [number, number]}
        rowHeight={ROW_HEIGHT}
        margin={
          gridGap ? [gridGap, gridGap] : (GRID_MARGIN as [number, number])
        }
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
            onMouseEnter={() => !isResize && setActiveWidget(id)}
            onMouseLeave={() => setActiveWidget(null)}
            style={getGridItemStyles(position)}
          >
            <Widget
              id={id}
              onRemoveWidget={() => onRemoveWidget(id)}
              isHoverActive={isEditorMode && id === activeWidget}
              isEditorMode={isEditorMode}
            />
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </Container>
  );
};

export default Grid;
