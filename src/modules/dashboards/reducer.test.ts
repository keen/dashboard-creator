import dashboardsReducer, { initialState } from './reducer';

import {
  saveDashboard,
  registerDashboard,
  updateDashboard,
  updateDashboardMeta,
  addWidgetToDashboard,
  removeWidgetFromDashboard,
  fetchDashboardListSuccess,
  showDashboardSettingsModal,
  hideDashboardSettingsModal,
  showDashboardShareModal,
  hideDashboardShareModal,
  setDashboardError,
  saveDashboardMeta,
  saveDashboardMetaSuccess,
  saveDashboardMetaError,
  setDashboardListOrder,
  setDashboardPublicAccess,
  regenerateAccessKey,
  addClonedDashboard,
  prepareTagsPool,
  clearTagsPool,
  setTagsFiltersPublic,
  setTagsFilters,
} from './actions';

import { dashboardsMeta } from './fixtures';

import { DashboardError } from './types';

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

  const action = setDashboardError(
    '@dashboard/01',
    DashboardError.ACCESS_NOT_PUBLIC
  );
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

  const action = saveDashboard('@dashboard/01');
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
          publicAccessKey: null,
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
  const action = registerDashboard('@dashboard/01');
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

  const action = updateDashboard('@dashboard/01', dashboardSettings);
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
          publicAccessKey: null,
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
          publicAccessKey: null,
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
  const action = fetchDashboardListSuccess(dashboardsMeta);
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
  const action = showDashboardSettingsModal('@dashboard/01');
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
  const action = hideDashboardSettingsModal();
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
  const action = showDashboardShareModal('@dashboard/01');
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
  const action = hideDashboardShareModal();
  const { dashboardShareModal } = dashboardsReducer(state, action);

  expect(dashboardShareModal).toMatchInlineSnapshot(`
    Object {
      "dashboardId": null,
      "isVisible": false,
    }
  `);
});

test('return state for saving dashboard metadata', () => {
  const action = saveDashboardMeta('@dashboardId', dashboardsMeta[0]);
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

  const actionSuccess = saveDashboardMetaSuccess();
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

  const actionError = saveDashboardMetaError();
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
  const action = setDashboardListOrder('az');
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
  const action = setDashboardPublicAccess(dashboardId, isPublicTest, accessKey);
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
  const action = regenerateAccessKey(dashboardId);

  expect(action).toMatchInlineSnapshot(`
    Object {
      "payload": Object {
        "dashboardId": "@dashboard/01",
      },
      "type": "@dashboards/REGENERATE_ACCESS_KEY",
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
  };
  const action = addClonedDashboard(newDashboard);
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
        },
      ],
    },
  };

  const action = prepareTagsPool();
  const { tagsPool } = dashboardsReducer(state, action);

  expect(tagsPool).toMatchInlineSnapshot(`
    Array [
      "marketing",
      "sales",
    ]
  `);
});

test('clear tagsPool', () => {
  const action = clearTagsPool();
  const { tagsPool } = dashboardsReducer(initialState, action);

  expect(tagsPool).toMatchInlineSnapshot(`Array []`);
});

test('set tagsFilters tags', () => {
  const action = setTagsFilters(['sales', 'marketing']);
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
  const action = setTagsFiltersPublic(true);
  const {
    tagsFilters: { showOnlyPublicDashboards },
  } = dashboardsReducer(initialState, action);

  expect(showOnlyPublicDashboards).toBeTruthy();
});
