/* eslint-disable @typescript-eslint/camelcase */
import sagaHelper from 'redux-saga-testing';
import { put, take, select } from 'redux-saga/effects';

import {
  setWidgetState,
  editTextWidget as editTextWidgetAction,
  editInlineTextWidget as editInlineTextWidgetAction,
  setTextWidget,
} from '../actions';
import { editTextWidget, editInlineTextWidget } from './textWidget';

import { getWidgetSettings } from '../selectors';

import { saveDashboard } from '../../dashboards';

import {
  setEditorContent,
  setTextAlignment,
  openEditor as openTextEditor,
  closeEditor as closeTextEditor,
  applyTextEditorSettings,
  APPLY_TEXT_EDITOR_SETTINGS,
  CLOSE_EDITOR as CLOSE_TEXT_EDITOR,
} from '../../textEditor';

const dashboardId = '@dashboard/01';
const widgetId = '@widget/01';

describe('editTextWidget()', () => {
  describe('Scenario 1: User edits text widget in editor', () => {
    const action = editTextWidgetAction(widgetId);
    const test = sagaHelper(editTextWidget(action));

    const textWidgetContent = {
      blocks: [
        {
          key: '@key',
          text: '@text',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
        },
      ],
      entityMap: {},
    };

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        settings: {
          textAlignment: 'center',
          content: textWidgetContent,
        },
      };
    });

    test('set editor content', (result) => {
      expect(result).toEqual(put(setEditorContent(textWidgetContent)));
    });

    test('set editor text alignment', (result) => {
      expect(result).toEqual(put(setTextAlignment('center')));
    });

    test('opens text editor', (result) => {
      expect(result).toEqual(put(openTextEditor()));
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: false,
          })
        )
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(
        take([APPLY_TEXT_EDITOR_SETTINGS, CLOSE_TEXT_EDITOR])
      );

      return applyTextEditorSettings(textWidgetContent, 'left');
    });

    test('set text widget settings', (result) => {
      expect(result).toEqual(
        put(
          setTextWidget(widgetId, {
            content: textWidgetContent,
            textAlignment: 'left',
          })
        )
      );
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });

    test('close text editor', (result) => {
      expect(result).toEqual(put(closeTextEditor()));
    });
  });
});

describe('editInlineTextWidget()', () => {
  const textWidgetContent = {
    blocks: [
      {
        key: '@key',
        text: '@text',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
      },
    ],
    entityMap: {},
  };

  describe('Scenario 1: User edits inline text widget', () => {
    const action = editInlineTextWidgetAction(widgetId, textWidgetContent);
    const test = sagaHelper(editInlineTextWidget(action));

    test('set text widget settings', (result) => {
      expect(result).toEqual(
        put(setTextWidget(widgetId, { content: textWidgetContent }))
      );
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });
  });
});
