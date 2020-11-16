import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { WidthProvider, Responsive } from 'react-grid-layout';

import { Container } from './Grid.styles';
import Widget from '../Widget';

import { getWidgetsPosition, WidgetsPosition } from '../../modules/widgets';
import { RootState } from '../../rootReducer';

type Props = {
  /** Widgets identifiers used on grid layout */
  widgetsId: string[];
  /** Resize widgets event handler */
  onWidgetResize?: (widgetsPosition: WidgetsPosition) => void;
  /** Drag widget event handler */
  onWidgetDrag?: (widgetsPosition: WidgetsPosition) => void;
  /** Edit mode indicator */
  isEditorMode?: boolean;
};

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Grid: FC<Props> = ({
  widgetsId,
  onWidgetDrag,
  onWidgetResize,
  isEditorMode = false,
}) => {
  const widgets = useSelector((state: RootState) =>
    getWidgetsPosition(state, widgetsId)
  );

  return (
    <Container>
      <ResponsiveReactGridLayout
        isDraggable={isEditorMode}
        isResizable={isEditorMode}
        isDroppable={isEditorMode}
        onDragStop={onWidgetDrag}
        onResizeStop={onWidgetResize}
        onDrop={onWidgetDrag}
      >
        {widgets.map(({ id, position }) => (
          <div key={id} data-grid={{ ...position, i: id, static: false }}>
            <Widget id={id} />
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </Container>
  );
};

export default Grid;
