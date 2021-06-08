import { RootState } from '../../rootReducer';

export const getWidgetsPosition = (
  { widgets }: RootState,
  widgetsId: string[]
) =>
  widgetsId.map((id: string) => ({
    id,
    type: widgets.items[id].widget.type,
    position: widgets.items[id].widget.position,
  }));

export const getWidgetSettings = ({ widgets }: RootState, id: string) => {
  return widgets.items[id].widget;
};

export const getWidget = ({ widgets }: RootState, id: string) =>
  widgets.items[id];

export const widgetsSelectors = {
  getWidgetsPosition,
  getWidgetSettings,
  getWidget,
};
