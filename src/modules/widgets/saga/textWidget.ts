import { put, select, take } from 'redux-saga/effects';

import {
  editInlineTextWidget as editInlineTextWidgetAction,
  editTextWidget as editTextWidgetAction,
  setWidgetState,
  setTextWidget,
} from '../actions';

import { getWidgetSettings } from '../selectors';

import { saveDashboard } from '../../dashboards';

import {
  openEditor as openTextEditor,
  closeEditor as closeTextEditor,
  setTextAlignment,
  setEditorContent,
  APPLY_TEXT_EDITOR_SETTINGS,
  CLOSE_EDITOR as CLOSE_TEXT_EDITOR,
} from '../../textEditor';

import { getActiveDashboard } from '../../app';

/**
 * Flow responsible for creating text widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* createTextWidget(widgetId: string) {
  yield put(
    setTextWidget(widgetId, {
      content: { blocks: [], entityMap: {} },
    })
  );
  yield put(
    setWidgetState(widgetId, {
      isConfigured: true,
      isInitialized: true,
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

  yield put(setEditorContent(content));
  yield put(setTextAlignment(textAlignment));

  yield put(openTextEditor());
  yield put(
    setWidgetState(id, {
      isInitialized: false,
    })
  );

  const action = yield take([APPLY_TEXT_EDITOR_SETTINGS, CLOSE_TEXT_EDITOR]);

  if (action.type === APPLY_TEXT_EDITOR_SETTINGS) {
    const {
      content: updatedContent,
      textAlignment: updatedAlignment,
    } = action.payload;
    yield put(
      setTextWidget(id, {
        content: updatedContent,
        textAlignment: updatedAlignment,
      })
    );

    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));

    yield put(closeTextEditor());
  }

  yield put(
    setWidgetState(id, {
      isInitialized: true,
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
  yield put(setTextWidget(id, { content }));

  const dashboardId = yield select(getActiveDashboard);
  yield put(saveDashboard(dashboardId));
}
