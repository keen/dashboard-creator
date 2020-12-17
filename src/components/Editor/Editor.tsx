import React, { FC, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Layout as LayoutItem } from 'react-grid-layout';
import { push } from 'connected-react-router';

import {
  addWidgetToDashboard,
  removeWidgetFromDashboard,
  viewDashboard,
  getDashboard,
  saveDashboard,
  getDashboardMeta,
} from '../../modules/dashboards';
import {
  createWidget,
  createWidgetId,
  updateWidgetsPosition,
  WidgetsPosition,
} from '../../modules/widgets';
import { setActiveDashboard, getActiveDashboard } from '../../modules/app';

import EditorNavigation from '../EditorNavigation';
import QueryPickerModal from '../QueryPickerModal';
import DashboardDeleteConfirmation from '../DashboardDeleteConfirmation';
import Toolbar from '../Toolbar';
import EditorBar from '../EditorBar';
import Grid from '../Grid';

import { ROUTES } from '../../constants';

import { RootState } from '../../rootReducer';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const Editor: FC<Props> = ({ dashboardId }) => {
  const { t } = useTranslation();
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

  const activeDashboardId = useSelector((state: RootState) =>
    getActiveDashboard(state)
  );
  const { lastModificationDate } = useSelector((state: RootState) =>
    getDashboardMeta(state, activeDashboardId)
  );

  return (
    <>
      <EditorNavigation
        onBack={() => {
          dispatch(setActiveDashboard(null));
          dispatch(push(ROUTES.MANAGEMENT));
        }}
      />
      <EditorBar
        isSaving={false}
        onFinishEdit={() => {
          dispatch(saveDashboard(dashboardId));
          dispatch(viewDashboard(dashboardId));
        }}
        lastSaveTime={lastModificationDate}
      >
        <Toolbar
          onWidgetDrag={(widgetType) => setDroppableWidget(widgetType)}
        />
      </EditorBar>
      {isInitialized ? (
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
      ) : (
        <div>{t('dashboard_editor.loading')}</div>
      )}
      <DashboardDeleteConfirmation />
      <QueryPickerModal />
    </>
  );
};

export default Editor;
