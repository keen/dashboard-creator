import { createContext } from 'react';
import { PubSub } from '@keen.io/pubsub';

import { WidgetType } from '../types';

export const EditorContext = createContext<{
  droppableWidget: WidgetType;
  containerWidth: number;
  setContainerWidth: (width: number) => void;
  editorPubSub: PubSub;
}>({
  droppableWidget: null,
  containerWidth: null,
  setContainerWidth: null,
  editorPubSub: null,
});
