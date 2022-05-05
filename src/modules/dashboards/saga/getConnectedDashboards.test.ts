import sagaHelper from 'redux-saga-testing';
import { getContext, put } from 'redux-saga/effects';
import fetchMock from 'jest-fetch-mock';
import { getConnectedDashboards } from './getConnectedDashboards';
import { DASHBOARD_API } from '../../../constants';
import { dashboardsActions } from '../index';

describe('getConnectedDashboards', () => {
  const savedQuery = 'saved-query';
  const baseUrl = 'http://api.com';
  const readKey = '@read-key';

  const test = sagaHelper(getConnectedDashboards(savedQuery));

  const dashboardsMeta = [
    {
      id: '@id',
      title: '@title',
      widgets: 3,
      queries: 1,
      tags: [],
      lastModificationDate: 1,
      isPublic: false,
      publicAccessKey: null,
    },
  ];

  fetchMock.mockResponseOnce(JSON.stringify({}));

  test('get the Dashboards API context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return {
      baseUrl,
      readKey,
    };
  });

  test('resets connected dashboards', (result) => {
    expect(result).toEqual(put(dashboardsActions.setConnectedDashboards([])));
  });

  test('resets error state', (result) => {
    expect(result).toEqual(
      put(dashboardsActions.setConnectedDashboardsError(false))
    );
  });

  test('resets loading state', (result) => {
    expect(result).toEqual(
      put(dashboardsActions.setConnectedDashboardsLoading(true))
    );
  });

  test('fetch connected dashboards from api', () => {
    return dashboardsMeta;
  });

  test('update connected dashboards', (result) => {
    const dashboards = dashboardsMeta.map(({ id, title }) => ({ id, title }));
    expect(result).toEqual(
      put(dashboardsActions.setConnectedDashboards(dashboards))
    );
  });
});
