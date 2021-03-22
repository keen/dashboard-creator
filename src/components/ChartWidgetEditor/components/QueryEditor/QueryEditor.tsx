import React, { FC, useRef, useEffect, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Query } from '@keen.io/query';
import QueryCreator from '@keen.io/query-creator';

import {
  setQuerySettings,
  setInitialQuerySettings,
  updateChartSettings,
  editorMounted,
} from '../../../../modules/chartEditor';

import { AppContext } from '../../../../contexts';

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

  const setChartSettings = useCallback(
    (chartSettings: Record<string, any>) =>
      dispatch(updateChartSettings(chartSettings)),
    []
  );

  useEffect(() => {
    dispatch(editorMounted());
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
      onUpdateQuery={(query: Query, isQueryReady: boolean) => {
        if (isEditMode) {
          if (isQueryReady) {
            dispatch(setQuerySettings(query));
            if (!initialQueryRef.current) {
              dispatch(setInitialQuerySettings(query));
            }
          }
        } else {
          dispatch(setQuerySettings(query));
          if (!initialQueryRef.current) {
            dispatch(setInitialQuerySettings(query));
          }
        }
      }}
      host={analyticsApiUrl}
    />
  );
};

export default QueryEditor;
