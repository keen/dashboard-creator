import React, { FC, useRef, useEffect, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Query } from '@keen.io/query';
import QueryCreator from '@keen.io/query-creator';

import { AppContext } from '../../../../contexts';
import {
  getDefaultTimezone,
  getTimezoneSelectionDisabled,
} from '../../../../modules/timezone';
import { chartEditorActions } from '../../../../modules/chartEditor';

type Props = {
  /** Edit mode indicator */
  isEditMode: boolean;
  /** Default query initialization state */
  initialQueryInitialized: boolean;
};

const QueryEditor: FC<Props> = ({ isEditMode, initialQueryInitialized }) => {
  const dispatch = useDispatch();

  const {
    modalContainer,
    analyticsApiUrl,
    project: { id, userKey, masterKey },
  } = useContext(AppContext);

  const defaultTimezoneForQuery = useSelector(getDefaultTimezone);
  const timezoneSelectionDisabled = useSelector(getTimezoneSelectionDisabled);

  const setChartSettings = useCallback((chartSettings: Record<string, any>) => {
    dispatch(chartEditorActions.updateChartSettings(chartSettings));
    dispatch(chartEditorActions.setQueryChange(true));
  }, []);

  useEffect(() => {
    dispatch(chartEditorActions.editorMounted());
  }, []);

  const initialQueryRef = useRef(null);

  initialQueryRef.current = initialQueryInitialized;
  return (
    <QueryCreator
      projectId={id}
      readKey={userKey}
      masterKey={masterKey}
      modalContainer={modalContainer}
      onUpdateChartSettings={setChartSettings}
      defaultTimezoneForQuery={defaultTimezoneForQuery}
      disableTimezoneSelection={timezoneSelectionDisabled}
      onUpdateQuery={(query: Query, isQueryReady: boolean) => {
        if (isEditMode) {
          if (isQueryReady) {
            dispatch(chartEditorActions.setQuerySettings(query));
            if (!initialQueryRef.current) {
              dispatch(chartEditorActions.setInitialQuerySettings(query));
            }
          }
        } else {
          dispatch(chartEditorActions.setQuerySettings(query));
          if (!initialQueryRef.current) {
            dispatch(chartEditorActions.setInitialQuerySettings(query));
          }
        }
      }}
      host={analyticsApiUrl}
    />
  );
};

export default QueryEditor;
