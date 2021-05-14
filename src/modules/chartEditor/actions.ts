import { createAction } from '@reduxjs/toolkit';

export const editorMounted = createAction('chartEditor/editorMounted');
export const editorUnmounted = createAction('chartEditor/editorUnmounted');
export const applyConfiguration = createAction(
  'chartEditor/applyConfiguration'
);
export const restoreSavedQuery = createAction('chartEditor/restoreSavedQuery');

export const showQueryUpdateConfirmation = createAction(
  'chartEditor/showQueryUpdateConfirmation'
);
export const hideQueryUpdateConfirmation = createAction(
  'chartEditor/hideQueryUpdateConfirmation'
);

export const backToChartEditor = createAction('chartEditor/backToChartEditor');
export const confirmSaveQueryUpdate = createAction(
  'chartEditor/confirmSaveQueryUpdate'
);
export const useQueryForWidget = createAction('chartEditor/useQueryForWidget');
export const queryUpdateConfirmationMounted = createAction(
  'chartEditor/queryUpdateConfirmationMounted'
);
