import dashboardsReducer, { initialState } from './reducer';

import {
  saveDashboard,
  registerDashboard,
  updateDashboard,
  updateDashboardMeta,
  addWidgetToDashboard,
  removeWidgetFromDashboard,
  fetchDashboardListSuccess,
} from './actions';

import { dashboardsMeta } from './fixtures';

test('updates dashboard save indicator', () => {
  const state = {
    ...initialState,
    items: {
      '@dashboard/01': {
        initialized: false,
        isSaving: false,
        settings: null,
      },
    },
  };

  const action = saveDashboard('@dashboard/01');
  const { items } = dashboardsReducer(state, action);

  expect(items).toMatchInlineSnapshot(`
    Object {
      "@dashboard/01": Object {
        "initialized": false,
        "isSaving": true,
        "settings": null,
      },
    }
  `);
});

test('updates dashboard metadata', () => {
  const action = updateDashboardMeta('@dashboard/01', {
    title: 'Title',
    queries: 30,
  });
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
  };

  const { metadata } = dashboardsReducer(state, action);

  expect(metadata).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "id": "@dashboard/01",
          "isPublic": false,
          "lastModificationDate": 0,
          "queries": 30,
          "tags": Array [],
          "title": "Title",
          "widgets": 1,
        },
      ],
      "error": null,
      "isInitiallyLoaded": false,
      "isLoaded": true,
    }
  `);
});

test('register a new dashboard', () => {
  const action = registerDashboard('@dashboard/01');
  const { items } = dashboardsReducer(initialState, action);

  expect(items).toMatchInlineSnapshot(`
    Object {
      "@dashboard/01": Object {
        "initialized": false,
        "isSaving": false,
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
        isSaving: false,
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
        "isSaving": false,
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
        isSaving: false,
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
        isSaving: false,
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
  const action = fetchDashboardListSuccess(dashboardsMeta);
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
        Object {
          "id": "@dashboard/03",
          "isPublic": true,
          "lastModificationDate": 1606895352390,
          "queries": 0,
          "tags": Array [],
          "title": null,
          "widgets": 0,
        },
      ],
      "error": null,
      "isInitiallyLoaded": true,
    }
  `);
});
