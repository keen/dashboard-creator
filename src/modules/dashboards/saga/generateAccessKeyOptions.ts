import { RootState } from '../../../rootReducer';
import { getContext, select } from 'redux-saga/effects';
import { getDashboard } from '../selectors';
import { DASHBOARD_API } from '../../../constants';
import { DashboardModel } from '../types';
import { widgetsSelectors } from '../../widgets';

export function* generateAccessKeyOptions(dashboardId: string) {
  const state: RootState = yield select();
  const dashboard = yield getDashboard(state, dashboardId);
  const queries = new Set();

  if (!dashboard) {
    const dashboardApi = yield getContext(DASHBOARD_API);

    try {
      const responseBody: DashboardModel = yield dashboardApi.getDashboardById(
        dashboardId
      );
      const { widgets } = responseBody;
      widgets.forEach((widget) => {
        if (
          widget.type === 'visualization' &&
          widget.query &&
          typeof widget.query === 'string'
        ) {
          queries.add(widget.query);
        }
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    const {
      settings: { widgets },
    } = dashboard;
    const dashboardWidgets = widgets.map((widgetId: string) =>
      widgetsSelectors.getWidget(state, widgetId)
    );
    dashboardWidgets.forEach((item) => {
      const {
        widget: { type, query },
      } = item;
      if (type === 'visualization' && query && typeof query === 'string') {
        queries.add(query);
      }
    });
  }

  const allowedQueries = Array.from(queries);
  return {
    options: {
      cached_queries: {
        allowed: allowedQueries,
      },
      saved_queries: {
        allowed: allowedQueries,
      },
    },
  };
}
