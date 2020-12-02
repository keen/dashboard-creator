import dashboardsReducer, { initialState } from './reducer';

import {
  registerDashboard,
  updateDashboard,
  addWidgetToDashboard,
  removeWidgetFromDashboard,
  fetchDashboardListSuccess,
} from './actions';

import { dashbordsMeta } from './fixtures';

test('register a new dashboard', () => {
  const action = registerDashboard('@dashboard/01');
  const { items } = dashboardsReducer(initialState, action);

  expect(items).toMatchInlineSnapshot(`
    Object {
      "@dashboard/01": Object {
        "initialized": false,
        "settings": null,
      },
    }
  `);
});

test('updates settings for dashboard', () => {
  const state = {
    ...initialState,
    items: {
      '@dashboard/01': {
        initialized: false,
        settings: null,
      },
    },
  };
  const dashboardSettings = {
    version: '0.0.1',
    widgets: ['@widget/01'],
  };

  const action = updateDashboard('@dashboard/01', dashboardSettings);
  const { items } = dashboardsReducer(state, action);

  expect(items).toMatchInlineSnapshot(`
    Object {
      "@dashboard/01": Object {
        "initialized": true,
        "settings": Object {
          "version": "0.0.1",
          "widgets": Array [
            "@widget/01",
          ],
        },
      },
    }
  `);
});

test('add widget to dashboard', () => {
  const action = addWidgetToDashboard('@dashboard/01', '@widget/01');
  const state = {
    ...initialState,
    metadata: {
      ...initialState.metadata,
      isLoaded: true,
      data: [
        {
          id: '@dashboard/01',
          widgets: 0,
          queries: 0,
          title: null,
          lastModificationDate: 0,
          tags: [],
          isPublic: false,
        },
      ],
    },
    items: {
      '@dashboard/01': {
        initialized: true,
        settings: {
          version: '0.0.1',
          widgets: [],
        },
      },
    },
  };

  const updatedState = dashboardsReducer(state, action);

  expect(updatedState).toMatchSnapshot();
});

test('removes widget from dashboard', () => {
  const action = removeWidgetFromDashboard('@dashboard/01', '@widget/01');
  const state = {
    ...initialState,
    metadata: {
      ...initialState.metadata,
      isLoaded: true,
      data: [
        {
          id: '@dashboard/01',
          widgets: 1,
          queries: 0,
          title: null,
          lastModificationDate: 0,
          tags: [],
          isPublic: false,
        },
      ],
    },
    items: {
      '@dashboard/01': {
        initialized: true,
        settings: {
          version: '0.0.1',
          widgets: ['@widget/01'],
        },
      },
    },
  };

  const updatedState = dashboardsReducer(state, action);

  expect(updatedState).toMatchSnapshot();
});

test('serializes dashboards metadata', () => {
  const action = fetchDashboardListSuccess(dashbordsMeta);
  const { metadata } = dashboardsReducer(initialState, action);

  expect(metadata).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "id": "@dashboard/01",
          "isPublic": true,
          "lastModificationDate": 1606895352390,
          "queries": 0,
          "tags": Array [],
          "title": "Dashboard 1",
          "widgets": 5,
        },
        Object {
          "id": "@dashboard/02",
          "isPublic": true,
          "lastModificationDate": 1606895352390,
          "queries": 2,
          "tags": Array [],
          "title": "Dashboard 2",
          "widgets": 0,
        },
      ],
      "error": null,
      "isInitiallyLoaded": true,
    }
  `);
});
