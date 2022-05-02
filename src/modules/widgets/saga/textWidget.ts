import { put, select, take } from 'redux-saga/effects';

import {
  editInlineTextWidget as editInlineTextWidgetAction,
  editTextWidget as editTextWidgetAction,
} from '../actions';

import { getWidgetSettings } from '../selectors';

import { saveDashboard } from '../../dashboards';

import { textEditorActions, textEditorSagaActions } from '../../textEditor';
import { appSelectors } from '../../app';
import { widgetsActions } from '../index';

/**
 * Flow responsible for creating text widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* createTextWidget(widgetId: string) {
  yield put(
    widgetsActions.setTextWidget({
      id: widgetId,
      settings: {
        content: { blocks: [], entityMap: {} },
      },
    })
  );
  yield put(
    widgetsActions.setWidgetState({
      id: widgetId,
      widgetState: {
        isConfigured: true,
        isInitialized: true,
      },
    })
  );
}

/**
 * Flow responsible for editing text widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* editTextWidget({
  payload,
}: ReturnType<typeof editTextWidgetAction>) {
  const { id } = payload;
  const {
    settings: { content, textAlignment },
  } = yield select(getWidgetSettings, id);

  yield put(textEditorActions.setEditorContent(content));
  yield put(textEditorActions.setTextAlignment(textAlignment));
  yield put(textEditorActions.openEditor());
  yield put(
    widgetsActions.setWidgetState({
      id,
      widgetState: {
        isInitialized: false,
      },
    })
  );

  const action = yield take([
    textEditorSagaActions.applyTextEditorSettings.type,
    textEditorActions.closeEditor.type,
  ]);

  if (action.type === textEditorSagaActions.applyTextEditorSettings.type) {
    const {
      content: updatedContent,
      textAlignment: updatedAlignment,
    } = action.payload;
    yield put(
      widgetsActions.setTextWidget({
        id,
        settings: {
          content: updatedContent,
          textAlignment: updatedAlignment,
        },
      })
    );

    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(saveDashboard(dashboardId));

    yield put(textEditorActions.closeEditor());
  }

  yield put(
    widgetsActions.setWidgetState({
      id,
      widgetState: {
        isInitialized: true,
      },
    })
  );
}

/**
 * Flow responsible for editing inline text widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* editInlineTextWidget({
  payload,
}: ReturnType<typeof editInlineTextWidgetAction>) {
  const { id, content } = payload;
  yield put(widgetsActions.setTextWidget({ id, settings: { content } }));

  const dashboardId = yield select(appSelectors.getActiveDashboard);
  yield put(saveDashboard(dashboardId));
}
