import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getDashboard, saveDashboard } from '../../modules/dashboards';
import { updateWidgetsPosition } from '../../modules/widgets';

import Grid from '../Grid';

import { RootState } from '../../rootReducer';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const Editor: FC<Props> = ({ dashboardId }) => {
  const dispatch = useDispatch();
  const { widgetsId, isInitialized } = useSelector((state: RootState) => {
    const dashboard = getDashboard(state, dashboardId);
    if (dashboard?.initialized) {
      return {
        isInitialized: true,
        widgetsId: dashboard.settings.widgets,
      };
    }

    return {
      widgetsId: [],
      isInitialized: false,
    };
  });

  return (
    <>
      {isInitialized ? (
        <>
          <div onClick={() => dispatch(saveDashboard(dashboardId))}>Save</div>
          <Grid
            isEditorMode={true}
            widgetsId={widgetsId}
            onWidgetDrag={(gridPositions) =>
              dispatch(updateWidgetsPosition(gridPositions))
            }
            onWidgetResize={(gridPositions) =>
              dispatch(updateWidgetsPosition(gridPositions))
            }
          />
        </>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};

export default Editor;
