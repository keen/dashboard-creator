import filterReducer, { initialState } from './reducer';

import {
  openEditor,
  closeEditor,
  resetEditor,
  setTargetProperty,
  setEventStream,
  setEditorConnections,
  setEditorDetachedConnections,
  updateConnection,
  setEventStreamSchema,
  setEventStreamsPool,
  setSchemaProcessing,
  setSchemaProcessingError,
} from './actions';

import { FilterConnection, SchemaPropertiesList } from './types';

test('opens filter editor', () => {
  const action = openEditor();
  const { isEditorOpen } = filterReducer(initialState, action);

  expect(isEditorOpen).toEqual(true);
});

test('close filter editor', () => {
  const action = closeEditor();
  const { isEditorOpen } = filterReducer(
    { ...initialState, isEditorOpen: true },
    action
  );

  expect(isEditorOpen).toEqual(false);
});

test('close filter editor', () => {
  const action = resetEditor();
  const state = filterReducer(
    { ...initialState, isEditorOpen: true, targetProperty: 'country' },
    action
  );

  expect(state).toEqual(initialState);
});

test('set target property', () => {
  const action = setTargetProperty('keen.id');
  const { targetProperty } = filterReducer(initialState, action);

  expect(targetProperty).toEqual('keen.id');
});

test('set event stream', () => {
  const action = setEventStream('purchases');
  const { eventStream } = filterReducer(initialState, action);

  expect(eventStream).toEqual('purchases');
});

test('set filter widget detached connections', () => {
  const connections: FilterConnection[] = [
    {
      title: null,
      isConnected: true,
      widgetId: '@widget/01',
      positionIndex: 1,
    },
  ];

  const action = setEditorDetachedConnections(connections);
  const { detachedWidgetConnections } = filterReducer(initialState, action);

  expect(detachedWidgetConnections).toEqual(connections);
});

test('set filter widget connections', () => {
  const connections: FilterConnection[] = [
    {
      title: null,
      isConnected: true,
      widgetId: '@widget/01',
      positionIndex: 1,
    },
  ];

  const action = setEditorConnections(connections);
  const { widgetConnections } = filterReducer(initialState, action);

  expect(widgetConnections).toEqual(connections);
});

test('updates filter widget connections', () => {
  const connections: FilterConnection[] = [
    {
      title: null,
      isConnected: true,
      widgetId: '@widget/01',
      positionIndex: 1,
    },
  ];

  const action = updateConnection('@widget/01', false);
  const { widgetConnections } = filterReducer(
    { ...initialState, widgetConnections: connections },
    action
  );

  expect(widgetConnections).toEqual([
    {
      title: null,
      isConnected: false,
      widgetId: '@widget/01',
      positionIndex: 1,
    },
  ]);
});

test('set event streams pool', () => {
  const streams = ['logins', 'pageviews'];

  const action = setEventStreamsPool(streams);
  const { eventStreamsPool } = filterReducer(initialState, action);

  expect(eventStreamsPool).toEqual(streams);
});

test('set schema processing state', () => {
  const action = setSchemaProcessing(false);
  const { schemaProcessing } = filterReducer(
    { ...initialState, schemaProcessing: { inProgress: true, error: null } },
    action
  );

  expect(schemaProcessing).toMatchInlineSnapshot(`
    Object {
      "error": null,
      "inProgress": false,
    }
  `);
});

test('set schema processing error', () => {
  const action = setSchemaProcessingError(true);
  const { schemaProcessing } = filterReducer(
    { ...initialState, schemaProcessing: { inProgress: false, error: null } },
    action
  );

  expect(schemaProcessing).toMatchInlineSnapshot(`
    Object {
      "error": true,
      "inProgress": false,
    }
  `);
});

test('set event stream schema', () => {
  const schema = {
    name: 'string',
    'user.id': 'string',
  };

  const schemaTree = {
    name: ['name', 'string'],
    user: {
      id: ['user.id', 'string'],
    },
  };

  const schemaList: SchemaPropertiesList = [
    { path: 'name', type: 'string' },
    { path: 'user.id', type: 'string' },
  ];

  const action = setEventStreamSchema(schema, schemaTree, schemaList);
  const { eventStreamSchema } = filterReducer(initialState, action);

  expect(eventStreamSchema).toMatchInlineSnapshot(`
    Object {
      "list": Array [
        Object {
          "path": "name",
          "type": "string",
        },
        Object {
          "path": "user.id",
          "type": "string",
        },
      ],
      "schema": Object {
        "name": "string",
        "user.id": "string",
      },
      "tree": Object {
        "name": Array [
          "name",
          "string",
        ],
        "user": Object {
          "id": Array [
            "user.id",
            "string",
          ],
        },
      },
    }
  `);
});
