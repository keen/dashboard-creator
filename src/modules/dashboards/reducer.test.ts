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
  setTagsPool,
  saveDashboardMeta,
  saveDashboardMetaSuccess,
  saveDashboardMetaError,
  setDashboardListOrder,
  addClonedDashboard,
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

test('sets tags pool for dashboard', () => {
  const tags = ['tag1', 'tag2', 'tag3'];
  const action = setTagsPool(tags);
  const { tagsPool } = dashboardsReducer(initialState, action);

  expect(tagsPool).toMatchInlineSnapshot(`
    Array [
      "tag1",
      "tag2",
      "tag3",
    ]
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
      "isSavingMetaData": true,
      "isSavingMetadata": false,
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
      "isSavingMetaData": false,
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
      "isSavingMetaData": false,
      "isSavingMetadata": false,
    }
  `);
});

test('set order for dashboard list', () => {
  const action = setDashboardListOrder('az');
  const { dashboardListOrder } = dashboardsReducer(initialState, action);

  expect(dashboardListOrder).toBe('az');
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
        "queries": 0,
        "tags": Array [],
        "title": null,
        "widgets": 0,
      },
    ]
  `);
});
