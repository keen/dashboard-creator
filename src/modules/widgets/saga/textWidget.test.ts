/* eslint-disable @typescript-eslint/naming-convention */
import sagaHelper from 'redux-saga-testing';
import { put, take, select } from 'redux-saga/effects';

import { editTextWidget, editInlineTextWidget } from './textWidget';
import { getWidgetSettings } from '../selectors';

import { textEditorActions, textEditorSagaActions } from '../../textEditor';
import { widgetsActions } from '../index';
import { dashboardsActions } from '../../dashboards';

const dashboardId = '@dashboard/01';
const widgetId = '@widget/01';

describe('editTextWidget()', () => {
  describe('Scenario 1: User edits text widget in editor', () => {
    const action = widgetsActions.editTextWidget(widgetId);
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
      expect(result).toEqual(
        put(textEditorActions.setEditorContent(textWidgetContent))
      );
    });

    test('set editor text alignment', (result) => {
      expect(result).toEqual(put(textEditorActions.setTextAlignment('center')));
    });

    test('opens text editor', (result) => {
      expect(result).toEqual(put(textEditorActions.openEditor()));
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: widgetId,
            widgetState: {
              isInitialized: false,
            },
          })
        )
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(
        take([
          textEditorSagaActions.applyTextEditorSettings.type,
          textEditorActions.closeEditor.type,
        ])
      );

      return textEditorSagaActions.applyTextEditorSettings(
        textWidgetContent,
        'left'
      );
    });

    test('set text widget settings', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setTextWidget({
            id: widgetId,
            settings: {
              content: textWidgetContent,
              textAlignment: 'left',
            },
          })
        )
      );
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(dashboardsActions.saveDashboard(dashboardId)));
    });

    test('close text editor', (result) => {
      expect(result).toEqual(put(textEditorActions.closeEditor()));
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
    const action = widgetsActions.editInlineTextWidget(
      widgetId,
      textWidgetContent
    );
    const test = sagaHelper(editInlineTextWidget(action));

    test('set text widget settings', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setTextWidget({
            id: widgetId,
            settings: { content: textWidgetContent },
          })
        )
      );
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(dashboardsActions.saveDashboard(dashboardId)));
    });
  });
});
