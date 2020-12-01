import { RootState } from '../../rootReducer';

export const getWidgetsPosition = (
  { widgets }: RootState,
  widgetsId: string[]
) =>
  widgetsId.map((id: string) => ({
    id,
    position: widgets.items[id].widget.position,
  }));

export const getWidgetSettings = ({ widgets }: RootState, id: string) =>
  widgets.items[id].widget;

export const getWidget = ({ widgets }: RootState, id: string) =>
  widgets.items[id];
