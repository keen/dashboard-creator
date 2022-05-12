import { put, getContext } from 'redux-saga/effects';
import { DASHBOARD_API } from '../../../constants';
import { sortConnectedDashboards } from '../utils';
import { dashboardsActions } from '../index';

type DashboardMetaData = {
  id: string;
  title: null | string;
  widgets: number;
  queries: number;
  tags: string[];
  lastModificationDate: number;
  isPublic: boolean;
  publicAccessKey: null | string;
};

export function* getConnectedDashboards(queryName: string) {
  const { baseUrl, readKey } = yield getContext(DASHBOARD_API);

  yield put(dashboardsActions.setConnectedDashboards([]));
  yield put(dashboardsActions.setConnectedDashboardsError(false));
  yield put(dashboardsActions.setConnectedDashboardsLoading(true));

  try {
    const response: DashboardMetaData[] = yield fetch(
      `${baseUrl}/dashboards/metadata?savedQueryId=${queryName}`,
      {
        headers: {
          Authorization: readKey,
        },
      }
    ).then((res) => res.json());

    const dashboards = response.map(({ title, id }) => ({ title, id }));
    yield put(
      dashboardsActions.setConnectedDashboards(
        sortConnectedDashboards(dashboards)
      )
    );
  } catch (error) {
    yield put(dashboardsActions.setConnectedDashboardsLoading(false));
    yield put(dashboardsActions.setConnectedDashboardsError(true));
    yield put(dashboardsActions.setConnectedDashboards([]));
  } finally {
    yield put(dashboardsActions.setConnectedDashboardsLoading(false));
  }
}
