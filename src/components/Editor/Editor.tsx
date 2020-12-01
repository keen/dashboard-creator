import React, { FC, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout as LayoutItem } from 'react-grid-layout';

import {
  addWidgetToDashboard,
  removeWidgetFromDashboard,
  getDashboard,
  saveDashboard,
} from '../../modules/dashboards';
import {
  createWidget,
  createWidgetId,
  updateWidgetsPosition,
  WidgetsPosition,
} from '../../modules/widgets';
import { createDashboardThumbnail } from '../../modules/thumbnails';
import { setViewMode } from '../../modules/app';

import EditorNavigation from '../EditorNavigation';
import QueryPickerModal from '../QueryPickerModal';
import Toolbar from '../Toolbar';
import Grid from '../Grid';

import { RootState } from '../../rootReducer';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const Editor: FC<Props> = ({ dashboardId }) => {
  const dispatch = useDispatch();
  const [droppableWidget, setDroppableWidget] = useState(null);
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

  const addWidgetHandler = useCallback(
    (widgetsPosition: WidgetsPosition, droppedItem: LayoutItem) => {
      const { i: id } = droppedItem;
      const gridPositions = widgetsPosition.filter(({ i }) => i !== id);

      const widgetId = createWidgetId();
      const { x, y, w, h } = droppedItem;

      dispatch(createWidget(widgetId, droppableWidget, { x, y, w, h }));
      dispatch(addWidgetToDashboard(dashboardId, widgetId));
      dispatch(updateWidgetsPosition(gridPositions));
    },
    [droppableWidget]
  );

  return (
    <>
      <EditorNavigation onBack={() => dispatch(setViewMode('management'))} />
      <Toolbar onWidgetDrag={(widgetType) => setDroppableWidget(widgetType)} />
      {isInitialized ? (
        <>
          <div
            onClick={() => {
              dispatch(saveDashboard(dashboardId));
              dispatch(createDashboardThumbnail(dashboardId));
            }}
          >
            Save
          </div>
          <Grid
            isEditorMode={true}
            widgetsId={widgetsId}
            onWidgetDrop={addWidgetHandler}
            onWidgetDrag={(gridPositions) =>
              dispatch(updateWidgetsPosition(gridPositions))
            }
            onWidgetResize={(gridPositions) =>
              dispatch(updateWidgetsPosition(gridPositions))
            }
            onRemoveWidget={(widgetId) => {
              dispatch(removeWidgetFromDashboard(dashboardId, widgetId));
            }}
          />
        </>
      ) : (
        <div>Loading</div>
      )}
      <QueryPickerModal />
    </>
  );
};

export default Editor;
