import { RootState } from '../../rootReducer';

export const getWidgetsPosition = (
  { widgets }: RootState,
  widgetsId: string[]
) =>
  widgetsId.map((id: string) => ({
    id,
    position: widgets.items[id].data.position,
  }));

export const getWidgetSettings = ({ widgets }: RootState, id: string) =>
  widgets.items[id].data;

export const getWidget = ({ widgets }: RootState, id: string) =>
  widgets.items[id];
