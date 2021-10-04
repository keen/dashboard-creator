/* eslint-disable @typescript-eslint/naming-convention */
import datePickerReducer, { initialState } from './reducer';

import {
  updateConnection,
  setEditorConnections,
  openEditor,
  closeEditor,
  setName,
} from './actions';

const widgetId = '@widget/01';
const widgetConnection = {
  widgetId,
  isConnected: false,
  title: null,
  positionIndex: 1,
};

test('updates widgets connection', () => {
  const action = updateConnection(widgetId, true);
  const state = {
    ...initialState,
    widgetConnections: [widgetConnection],
  };

  const { widgetConnections } = datePickerReducer(state, action);
  expect(widgetConnections).toMatchInlineSnapshot(`
    Array [
      Object {
        "isConnected": true,
        "positionIndex": 1,
        "title": null,
        "widgetId": "@widget/01",
      },
    ]
  `);
});

test('sets editor connection', () => {
  const action = setEditorConnections([widgetConnection]);
  const { widgetConnections } = datePickerReducer(initialState, action);
  expect(widgetConnections).toMatchInlineSnapshot(`
    Array [
      Object {
        "isConnected": false,
        "positionIndex": 1,
        "title": null,
        "widgetId": "@widget/01",
      },
    ]
  `);
});

test('opens date picker editor', () => {
  const action = openEditor();
  const { isEditorOpen } = datePickerReducer(initialState, action);
  expect(isEditorOpen).toEqual(true);
});

test('closes date picker editor', () => {
  const action = closeEditor();
  const state = datePickerReducer(initialState, action);
  expect(state).toMatchInlineSnapshot(`
    Object {
      "isEditorOpen": false,
      "name": "",
      "widgetConnections": Array [],
    }
  `);
});

test('sets date picker widget name', () => {
  const widgetName = '@name';
  const action = setName(widgetName);
  const { name } = datePickerReducer(initialState, action);
  expect(name).toEqual(widgetName);
});
