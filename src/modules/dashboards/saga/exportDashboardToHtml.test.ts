import { exportDashboardToHtml as exportDashboardToHtmlAction } from '../actions';
import sagaHelper from 'redux-saga-testing';
import { exportDashboardToHtml } from './exportDashboardToHtml';
import { getContext, select } from 'redux-saga/effects';
import { KEEN_ANALYSIS } from '../../../constants';
import { getDashboardMeta } from '../selectors';
import { createCodeSnippet } from '../utils';

const dashboardId = '@dashboard/01';

describe('exportDashboardToHtml()', () => {
  const action = exportDashboardToHtmlAction(dashboardId);
  const test = sagaHelper(exportDashboardToHtml(action));

  const projectId = 'projectId';
  const userKey = 'userKey';

  const keenAnalysisMock = {
    config: {
      projectId,
      readKey: userKey,
    },
  };

  const snippet = 'snippet';

  test('get Keen client from context', (result) => {
    expect(result).toEqual(getContext(KEEN_ANALYSIS));

    return keenAnalysisMock;
  });

  test('get dashboard metadata', (result) => {
    expect(result).toEqual(select(getDashboardMeta, dashboardId));

    return {
      publicAccessKey: '@public-access-key',
    };
  });

  test('creates code snippet', (result) => {
    expect(result).toEqual(
      createCodeSnippet({
        projectId,
        userKey: '@public-access-key',
        dashboardId,
      })
    );
    return snippet;
  });
});
