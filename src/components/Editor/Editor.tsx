import React, { FC, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Layout as LayoutItem } from 'react-grid-layout';
import { push } from 'connected-react-router';
import { PubSub } from '@keen.io/pubsub';

import { EditorContainer } from './Editor.styles';

import {
  addWidgetToDashboard,
  removeWidgetFromDashboard,
  viewDashboard,
  getDashboard,
  saveDashboard,
  getDashboardMeta,
  showDashboardSettingsModal,
} from '../../modules/dashboards';
import {
  createWidget,
  createWidgetId,
  updateWidgetsPosition,
  WidgetsPosition,
} from '../../modules/widgets';
import { getChartEditor } from '../../modules/chartEditor';
import { setActiveDashboard } from '../../modules/app';

import { EditorContext } from '../../contexts';

import EditorNavigation from '../EditorNavigation';
import QueryPickerModal from '../QueryPickerModal';
import ChartWidgetEditor from '../ChartWidgetEditor';
import ConfirmQueryChange from '../ConfirmQueryChange';
import DashboardDeleteConfirmation from '../DashboardDeleteConfirmation';
import Toolbar from '../Toolbar';
import EditorBar from '../EditorBar';
import Grid from '../Grid';

import { ROUTES, RESIZE_WIDGET_EVENT } from '../../constants';

import { RootState } from '../../rootReducer';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const Editor: FC<Props> = ({ dashboardId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const editorPubSub = useRef(new PubSub());
  const [containerWidth, setContainerWidth] = useState(0);

  const [droppableWidget, setDroppableWidget] = useState(null);
  const {
    isOpen: chartWidgetEditorOpen,
    changeQueryConfirmation,
  } = useSelector(getChartEditor);
  const { widgetsId, isInitialized, isSaving } = useSelector(
    (state: RootState) => {
      const dashboard = getDashboard(state, dashboardId);
      if (dashboard?.initialized) {
        return {
          isInitialized: true,
          isSaving: dashboard.isSaving,
          widgetsId: dashboard.settings.widgets,
        };
      }

      return {
        widgetsId: [],
        isSaving: false,
        isInitialized: false,
      };
    }
  );

  const addWidgetHandler = useCallback(
    (widgetsPosition: WidgetsPosition, droppedItem: LayoutItem) => {
      const { i: id } = droppedItem;
      const gridPositions = widgetsPosition.filter(({ i }) => i !== id);

      const widgetId = createWidgetId();
      const { x, y, w, h, minW, minH } = droppedItem;

      dispatch(
        createWidget(widgetId, droppableWidget, { x, y, w, h, minW, minH })
      );
      dispatch(addWidgetToDashboard(dashboardId, widgetId));
      dispatch(updateWidgetsPosition(gridPositions));
    },
    [droppableWidget]
  );

  const {
    lastModificationDate,
    title,
    tags,
  } = useSelector((state: RootState) => getDashboardMeta(state, dashboardId));

  return (
    <EditorContext.Provider
      value={{
        droppableWidget,
        containerWidth,
        setContainerWidth,
        editorPubSub: editorPubSub.current,
      }}
    >
      <EditorNavigation
        title={title}
        tags={tags}
        onShowSettings={() => dispatch(showDashboardSettingsModal(dashboardId))}
        onBack={() => {
          dispatch(setActiveDashboard(null));
          dispatch(push(ROUTES.MANAGEMENT));
        }}
      />
      <EditorContainer>
        <EditorBar
          isSaving={isSaving}
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
      </EditorContainer>
      {isInitialized ? (
        <Grid
          isEditorMode={true}
          widgetsId={widgetsId}
          onWidgetDrop={addWidgetHandler}
          onWidgetDrag={(gridPositions) => {
            dispatch(updateWidgetsPosition(gridPositions));
            dispatch(saveDashboard(dashboardId));
          }}
          onWidgetResize={(gridPositions, widgetId) => {
            dispatch(updateWidgetsPosition(gridPositions));
            dispatch(saveDashboard(dashboardId));
            editorPubSub.current.publish(RESIZE_WIDGET_EVENT, { id: widgetId });
          }}
          onRemoveWidget={(widgetId) => {
            dispatch(removeWidgetFromDashboard(dashboardId, widgetId));
            dispatch(saveDashboard(dashboardId));
          }}
        />
      ) : (
        <div>{t('dashboard_editor.loading')}</div>
      )}
      <ChartWidgetEditor isOpen={chartWidgetEditorOpen} />
      <ConfirmQueryChange isOpen={changeQueryConfirmation} />
      <DashboardDeleteConfirmation />
      <QueryPickerModal />
    </EditorContext.Provider>
  );
};

export default Editor;
