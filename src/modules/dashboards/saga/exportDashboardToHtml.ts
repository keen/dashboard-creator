import { exportDashboardToHtml as exportDashboardToHtmlAction } from '../actions';
import { getContext, select } from 'redux-saga/effects';
import { KEEN_ANALYSIS } from '../../../constants';
import { getDashboardMeta } from '../selectors';
import { createCodeSnippet } from '../utils';
import { exportToHtml } from '@keen.io/ui-core';

export function* exportDashboardToHtml({
  payload,
}: ReturnType<typeof exportDashboardToHtmlAction>) {
  const { dashboardId } = payload;
  const client = yield getContext(KEEN_ANALYSIS);

  const { publicAccessKey } = yield select(getDashboardMeta, dashboardId);
  const { projectId } = client.config;

  const codeSnippet = yield createCodeSnippet({
    projectId,
    userKey: publicAccessKey,
    dashboardId,
  });
  exportToHtml({ data: codeSnippet, fileName: dashboardId });
}
