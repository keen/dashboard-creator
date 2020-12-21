import { createContext } from 'react';
import { PubSub } from '@keen.io/pubsub';

import { GridSize, WidgetType } from '../types';

export const EditorContext = createContext<{
  gridSize: GridSize;
  droppableWidget: WidgetType;
  setGridSize: (gridSize: GridSize) => void;
  editorPubSub: PubSub;
}>({
  gridSize: null,
  droppableWidget: null,
  setGridSize: null,
  editorPubSub: null,
});
