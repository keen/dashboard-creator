import { clearInconsistentFiltersError as clearInconsistentFiltersErrorAction } from '../actions';
import { all, put, select } from 'redux-saga/effects';
import { getDashboardSettings } from '../../dashboards';
import { getWidget } from '../selectors';
import { WidgetErrors } from '../types';
import { widgetsActions } from '../index';

export function* clearInconsistentFiltersErrorFromWidgets({
  payload,
}: ReturnType<typeof clearInconsistentFiltersErrorAction>) {
  const { widgets: widgetIds } = yield select(
    getDashboardSettings,
    payload.dashboardId
  );
  const widgets = yield all(
    widgetIds.map((id: string) => select(getWidget, id))
  );
  const widgetsWithInconsistentFilterError = widgets.filter(
    (widget) =>
      widget.error && widget.error.code === WidgetErrors.INCONSISTENT_FILTER
  );
  yield all(
    widgetsWithInconsistentFilterError.map((widget) =>
      put(
        widgetsActions.setWidgetState({
          id: widget.widget.id,
          widgetState: { error: null },
        })
      )
    )
  );
}
