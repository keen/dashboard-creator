import { put, getContext } from 'redux-saga/effects';
import { DASHBOARD_API } from '../../../constants';
import { sortConnectedDashboards } from '../utils';
import {
  setConnectedDashboards,
  setConnectedDashboardsLoading,
  setConnectedDashboardsError,
} from '../actions';

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

  yield put(setConnectedDashboards([]));
  yield put(setConnectedDashboardsError(false));
  yield put(setConnectedDashboardsLoading(true));

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
    yield put(setConnectedDashboards(sortConnectedDashboards(dashboards)));
  } catch (error) {
    yield put(setConnectedDashboardsLoading(false));
    yield put(setConnectedDashboardsError(true));
    yield put(setConnectedDashboards([]));
  } finally {
    yield put(setConnectedDashboardsLoading(false));
  }
}
