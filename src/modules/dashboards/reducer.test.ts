import { dashboardsActions, dashboardsReducer, initialState } from './index';
import { dashboardsMeta } from './fixtures';

import { DashboardError } from './types';

test('creates dashboard', () => {
  const action = dashboardsActions.createDashboard('@dashboard/01');
  const {
    metadata: { data },
  } = dashboardsReducer(initialState, action);

  expect(data).toMatchObject([
    {
      id: '@dashboard/01',
      isPublic: false,
      publicAccessKey: null,
      queries: 0,
      tags: [],
      title: null,
      widgets: 0,
    },
  ]);
});

test('updates cached dashboards identifiers', () => {
  const action = dashboardsActions.updateCachedDashboardIds(['@dashboard/01']);
  const { cachedDashboardIds } = dashboardsReducer(initialState, action);

  expect(cachedDashboardIds).toMatchInlineSnapshot(`
    Array [
      "@dashboard/01",
    ]
  `);
});

test('set dashboard error', () => {
  const state = {
    ...initialState,
    items: {
      '@dashboard/01': {
        initialized: false,
        isSaving: false,
        error: null,
        settings: null,
      },
    },
  };

  const action = dashboardsActions.setDashboardError({
    dashboardId: '@dashboard/01',
    error: DashboardError.ACCESS_NOT_PUBLIC,
  });
  const { items } = dashboardsReducer(state, action);

  expect(items).toMatchInlineSnapshot(`
    Object {
      "@dashboard/01": Object {
        "error": "ACCESS_NOT_PUBLIC",
        "initialized": false,
        "isSaving": false,
        "settings": null,
      },
    }
  `);
});

test('updates dashboard save indicator', () => {
  const state = {
    ...initialState,
    items: {
      '@dashboard/01': {
        initialized: false,
        isSaving: false,
        error: null,
        settings: null,
      },
    },
  };

  const action = dashboardsActions.saveDashboard('@dashboard/01');
  const { items } = dashboardsReducer(state, action);

  expect(items).toMatchInlineSnapshot(`
    Object {
      "@dashboard/01": Object {
        "error": null,
        "initialized": false,
        "isSaving": true,
        "settings": null,
      },
    }
  `);
});

test('updates dashboard metadata and sort it by recent', () => {
  const action = dashboardsActions.updateDashboardMetadata({
    dashboardId: '@dashboard/01',
    metadata: {
      title: 'Title',
      queries: 30,
    },
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
          publicAccessKey: null,
          savedQueries: [],
        },
        {
          id: '@dashboard/02',
          widgets: 1,
          queries: 0,
          title: null,
          lastModificationDate: 1,
          tags: [],
          isPublic: false,
          publicAccessKey: null,
          savedQueries: [],
        },
      ],
    },
  };

  const { metadata } = dashboardsReducer(state, action);

  expect(metadata).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "id": "@dashboard/02",
          "isPublic": false,
          "lastModificationDate": 1,
          "publicAccessKey": null,
          "queries": 0,
          "savedQueries": Array [],
          "tags": Array [],
          "title": null,
          "widgets": 1,
        },
        Object {
          "id": "@dashboard/01",
          "isPublic": false,
          "lastModificationDate": 0,
          "publicAccessKey": null,
          "queries": 30,
          "savedQueries": Array [],
          "tags": Array [],
          "title": "Title",
          "widgets": 1,
        },
      ],
      "error": null,
      "isInitiallyLoaded": false,
      "isLoaded": true,
      "isRegeneratingAccessKey": false,
      "isSavingMetadata": false,
    }
  `);
});

test('register a new dashboard', () => {
  const action = dashboardsActions.registerDashboard('@dashboard/01');
  const { items } = dashboardsReducer(initialState, action);

  expect(items).toMatchInlineSnapshot(`
    Object {
      "@dashboard/01": Object {
        "error": null,
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
        error: null,
        settings: null,
      },
    },
  };
  const dashboardSettings = {
    version: '0.0.1',
    widgets: ['@widget/01'],
  };

  const action = dashboardsActions.updateDashboard({
    dashboardId: '@dashboard/01',
    settings: dashboardSettings,
  });
  const { items } = dashboardsReducer(state, action);

  expect(items).toMatchInlineSnapshot(`
    Object {
      "@dashboard/01": Object {
        "error": null,
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
  const action = dashboardsActions.addWidgetToDashboard({
    dashboardId: '@dashboard/01',
    widgetId: '@widget/01',
  });
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
          publicAccessKey: null,
          savedQueries: [],
        },
      ],
    },
    items: {
      '@dashboard/01': {
        initialized: true,
        isSaving: false,
        error: null,
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
  const action = dashboardsActions.removeWidgetFromDashboard({
    dashboardId: '@dashboard/01',
    widgetId: '@widget/01',
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
          publicAccessKey: null,
          savedQueries: [],
        },
      ],
    },
    items: {
      '@dashboard/01': {
        initialized: true,
        isSaving: false,
        error: null,
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
  const action = dashboardsActions.fetchDashboardsListSuccess(dashboardsMeta);
  const { metadata } = dashboardsReducer(initialState, action);

  expect(metadata).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        Object {
          "id": "@dashboard/01",
          "isPublic": true,
          "lastModificationDate": 1606895352390,
          "publicAccessKey": "@public/1",
          "queries": 0,
          "tags": Array [],
          "title": "Dashboard 1",
          "widgets": 5,
        },
        Object {
          "id": "@dashboard/02",
          "isPublic": true,
          "lastModificationDate": 1606895352390,
          "publicAccessKey": "@public/2",
          "queries": 2,
          "tags": Array [],
          "title": "Dashboard 2",
          "widgets": 0,
        },
        Object {
          "id": "@dashboard/03",
          "isPublic": true,
          "lastModificationDate": 1606895352390,
          "publicAccessKey": "@public/3",
          "queries": 0,
          "tags": Array [],
          "title": null,
          "widgets": 0,
        },
      ],
      "error": null,
      "isInitiallyLoaded": true,
      "isRegeneratingAccessKey": false,
      "isSavingMetadata": false,
    }
  `);
});

test('opens dashboard settings', () => {
  const state = {
    ...initialState,
    metadata: {
      ...initialState.metadata,
      data: dashboardsMeta,
    },
  };
  const action = dashboardsActions.showDashboardSettingsModal('@dashboard/01');
  const { dashboardSettingsModal } = dashboardsReducer(state, action);

  expect(dashboardSettingsModal).toMatchInlineSnapshot(`
    Object {
      "dashboardId": "@dashboard/01",
      "isVisible": true,
    }
  `);
});

test('closes dashboard settings', () => {
  const state = {
    ...initialState,
    metadata: {
      ...initialState.metadata,
      data: dashboardsMeta,
    },
  };
  const action = dashboardsActions.hideDashboardSettingsModal();
  const { dashboardSettingsModal } = dashboardsReducer(state, action);

  expect(dashboardSettingsModal).toMatchInlineSnapshot(`
    Object {
      "dashboardId": null,
      "isVisible": false,
    }
  `);
});

test('opens dashboard share modal', () => {
  const state = {
    ...initialState,
    metadata: {
      ...initialState.metadata,
      data: dashboardsMeta,
    },
  };
  const action = dashboardsActions.showDashboardShareModal('@dashboard/01');
  const { dashboardShareModal } = dashboardsReducer(state, action);

  expect(dashboardShareModal).toMatchInlineSnapshot(`
    Object {
      "dashboardId": "@dashboard/01",
      "isVisible": true,
    }
  `);
});

test('closes dashboard share modal', () => {
  const state = {
    ...initialState,
    metadata: {
      ...initialState.metadata,
      data: dashboardsMeta,
    },
  };
  const action = dashboardsActions.hideDashboardShareModal();
  const { dashboardShareModal } = dashboardsReducer(state, action);

  expect(dashboardShareModal).toMatchInlineSnapshot(`
    Object {
      "dashboardId": null,
      "isVisible": false,
    }
  `);
});

test('return state for saving dashboard metadata', () => {
  const action = dashboardsActions.saveDashboardMetadata({
    dashboardId: '@dashboardId',
    metadata: dashboardsMeta[0],
  });
  const { metadata } = dashboardsReducer(initialState, action);
  expect(metadata).toMatchInlineSnapshot(`
    Object {
      "data": Array [],
      "error": null,
      "isInitiallyLoaded": false,
      "isRegeneratingAccessKey": false,
      "isSavingMetadata": true,
    }
  `);

  const actionSuccess = dashboardsActions.saveDashboardMetadataSuccess();
  const { metadata: metadataSuccess } = dashboardsReducer(
    initialState,
    actionSuccess
  );
  expect(metadataSuccess).toMatchInlineSnapshot(`
    Object {
      "data": Array [],
      "error": null,
      "isInitiallyLoaded": false,
      "isRegeneratingAccessKey": false,
      "isSavingMetadata": false,
    }
  `);

  const actionError = dashboardsActions.saveDashboardMetadataError();
  const { metadata: metadataError } = dashboardsReducer(
    initialState,
    actionError
  );
  expect(metadataError).toMatchInlineSnapshot(`
    Object {
      "data": Array [],
      "error": null,
      "isInitiallyLoaded": false,
      "isRegeneratingAccessKey": false,
      "isSavingMetadata": false,
    }
  `);
});

test('set order for dashboard list', () => {
  const action = dashboardsActions.setDashboardListOrder({ order: 'az' });
  const { dashboardListOrder } = dashboardsReducer(initialState, action);

  expect(dashboardListOrder).toBe('az');
});

test('set public access to the dashboard', () => {
  const dashboardId = '@dashboard/01';
  const isPublicTest = false;
  const accessKey = 'public-access-key';

  const state = {
    ...initialState,
    metadata: {
      ...initialState.metadata,
      data: dashboardsMeta,
    },
  };
  const action = dashboardsActions.setDashboardPublicAccess({
    dashboardId,
    isPublic: isPublicTest,
    accessKey,
  });
  const {
    metadata: { data },
  } = dashboardsReducer(state, action);

  const { isPublic, publicAccessKey } = data.find(
    (item) => item.id === dashboardId
  );

  expect(isPublic).toEqual(isPublicTest);
  expect(publicAccessKey).toEqual(accessKey);
});

test('regenerate access key for the dashboard', () => {
  const dashboardId = '@dashboard/01';
  const action = dashboardsActions.regenerateAccessKey({ dashboardId });

  expect(action).toMatchInlineSnapshot(`
    Object {
      "payload": Object {
        "dashboardId": "@dashboard/01",
      },
      "type": "dashboards/regenerateAccessKey",
    }
    `);
});

test('add cloned dashboard to the list', () => {
  const newDashboard = {
    id: '@dashboard/01',
    title: null,
    widgets: 0,
    queries: 0,
    tags: [],
    lastModificationDate: 1606895352390,
    isPublic: false,
    publicAccessKey: null,
    savedQueries: [],
  };
  const action = dashboardsActions.addClonedDashboard(newDashboard);
  const {
    metadata: { data },
  } = dashboardsReducer(initialState, action);

  expect(data).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "@dashboard/01",
        "isPublic": false,
        "lastModificationDate": 1606895352390,
        "publicAccessKey": null,
        "queries": 0,
        "savedQueries": Array [],
        "tags": Array [],
        "title": null,
        "widgets": 0,
      },
    ]
  `);
});

test('prepare tagsPool', () => {
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
          tags: ['marketing'],
          isPublic: false,
          publicAccessKey: null,
          savedQueries: [],
        },
        {
          id: '@dashboard/02',
          widgets: 1,
          queries: 0,
          title: null,
          lastModificationDate: 0,
          tags: ['sales'],
          isPublic: false,
          publicAccessKey: null,
          savedQueries: [],
        },
      ],
    },
  };

  const action = dashboardsActions.prepareTagsPool();
  const { tagsPool } = dashboardsReducer(state, action);

  expect(tagsPool).toMatchInlineSnapshot(`
    Array [
      "marketing",
      "sales",
    ]
  `);
});

test('clear tagsPool', () => {
  const action = dashboardsActions.clearTagsPool();
  const { tagsPool } = dashboardsReducer(initialState, action);

  expect(tagsPool).toMatchInlineSnapshot(`Array []`);
});

test('set tagsFilters tags', () => {
  const action = dashboardsActions.setTagsFilters({
    tags: ['sales', 'marketing'],
  });
  const {
    tagsFilters: { tags },
  } = dashboardsReducer(initialState, action);

  expect(tags).toMatchInlineSnapshot(`
    Array [
      "sales",
      "marketing",
    ]
  `);
});

test('set tagsFilters showOnlyPublicDashboards', () => {
  const action = dashboardsActions.setTagsFiltersPublic(true);
  const {
    tagsFilters: { showOnlyPublicDashboards },
  } = dashboardsReducer(initialState, action);

  expect(showOnlyPublicDashboards).toBeTruthy();
});

test('set dashboards connections', () => {
  const dashboards = [
    {
      id: '@id-1',
      title: '@dashboard-1',
    },
    {
      id: '@id-2',
      title: '@dashboard-2',
    },
    {
      id: '@id-3',
      title: '@dashboard-3',
    },
  ];
  const action = dashboardsActions.setConnectedDashboards(dashboards);
  const {
    connectedDashboards: { items },
  } = dashboardsReducer(initialState, action);

  expect(items).toEqual(dashboards);
});

test('set dashboards connections error', () => {
  const action = dashboardsActions.setConnectedDashboardsError(true);
  const {
    connectedDashboards: { isError },
  } = dashboardsReducer(initialState, action);

  expect(isError).toBeTruthy();
});

test('set dashboards connections loading', () => {
  const action = dashboardsActions.setConnectedDashboardsLoading(true);
  const {
    connectedDashboards: { isLoading },
  } = dashboardsReducer(initialState, action);

  expect(isLoading).toBeTruthy();
});
