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
  WIDGETS_WITH_OVERLAY_DRAG,
  DRAGGED_WIDGET_Z_INDEX,
  GRID_MARGIN,
  GRID_BREAKPOINTS,
  GRID_COLS_EDIT_MODE,
  GRID_COLS_VIEW_MODE,
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

  const [draggedWidget, setDraggedWidget] = useState<string>(null);
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

  // This useEffect handles use case when user decides to cancel widget drop
  useEffect(() => {
    if (!droppableWidget && draggedWidget) setDraggedWidget(null);
  }, [droppableWidget]);

  // This function creates mapped grid for ReactResponsiveGrid component, which cannot detect all the changes between rerenders in some cases, with only data-grid attribute provided.
  // This allows new element to be positioned correctly inside the grid after drop.
  const generateLayouts = () => {
    return {
      lg: widgets.map((widget) => {
        let widgetPosition = widget.position;
        if (widget.type === 'filter') {
          widgetPosition = {
            ...widgetPosition,
            minW: 1,
            minH: 2,
            maxH: 2,
          };
        } else if (widget.type === 'date-picker') {
          widgetPosition = {
            ...widgetPosition,
            minW: 1,
            minH: 2,
            maxH: 2,
          };
        }
        return {
          i: widget.id,
          static: false,
          isResizable: isEditorMode,
          ...widgetPosition,
        };
      }),
    };
  };

  return (
    <Container id={GRID_CONTAINER_ID} ref={containerRef}>
      <ResponsiveReactGridLayout
        draggableHandle={`.${DRAG_HANDLE_ELEMENT}`}
        isDraggable={isEditorMode}
        isResizable={isEditorMode}
        isDroppable={isEditorMode}
        onDragStop={(elements) => {
          onWidgetDrag && onWidgetDrag(elements);
          setDraggedWidget(null);
        }}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        onDrop={(widgetsPosition, droppedItem) => {
          onWidgetDrop && onWidgetDrop(widgetsPosition, droppedItem);
          setDraggedWidget(null);
        }}
        onDragStart={(_elements, gridItem) => {
          const { i: id } = gridItem;
          setDraggedWidget(id);
        }}
        layouts={generateLayouts()}
        breakpoints={GRID_BREAKPOINTS}
        cols={isEditorMode ? GRID_COLS_EDIT_MODE : GRID_COLS_VIEW_MODE}
        containerPadding={GRID_CONTAINER_PADDING as [number, number]}
        rowHeight={ROW_HEIGHT}
        margin={
          gridGap
            ? [gridGap, GRID_MARGIN[1]]
            : (GRID_MARGIN as [number, number])
        }
        resizeHandle={
          <div className="react-resizable-handle react-resizable-handle-se">
            <Icon
              type="resize"
              width={15}
              height={15}
              fill={colors.white[400]}
            />
          </div>
        }
        droppingItem={getDroppingItemSize(droppableWidget)}
        onWidthChange={(containerWidth) =>
          setContainerWidth && setContainerWidth(containerWidth)
        }
        measureBeforeMount
      >
        {widgets.map(({ id, position, type }) => {
          const isActiveWidget = id === activeWidget && isEditorMode;

          return (
            <div
              key={id}
              id={id}
              onMouseEnter={() => !isResize && setActiveWidget(id)}
              onMouseLeave={() => setActiveWidget(null)}
              style={getGridItemStyles(
                position,
                isEditorMode && id === draggedWidget,
                DRAGGED_WIDGET_Z_INDEX
              )}
            >
              <Widget
                id={id}
                onRemoveWidget={() => onRemoveWidget(id)}
                isDragged={id === draggedWidget}
                isHoverActive={
                  WIDGETS_WITH_OVERLAY_DRAG.includes(type)
                    ? isActiveWidget
                    : !draggedWidget && isActiveWidget
                }
                isEditorMode={isEditorMode}
              />
            </div>
          );
        })}
      </ResponsiveReactGridLayout>
    </Container>
  );
};

export default Grid;
