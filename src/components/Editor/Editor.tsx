import React, { FC, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout as LayoutItem } from 'react-grid-layout';
import { push } from 'connected-react-router';
import { PubSub } from '@keen.io/pubsub';

import { Content, EditorContainer } from './Editor.styles';

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
import { getChartEditor } from '../../modules/chartEditor';
import { getTextEditor } from '../../modules/textEditor';
import { setActiveDashboard } from '../../modules/app';

import { EditorContext } from '../../contexts';

import EditorNavigation from '../EditorNavigation';
import QueryPickerModal from '../QueryPickerModal';
import DatePickerModal from '../DatePickerModal';
import ImagePickerModal from '../ImagePickerModal';
import FilterModal from '../FilterModal';
import ChartWidgetEditor from '../ChartWidgetEditor';
import TextWidgetEditor from '../TextWidgetEditor';
import ConfirmQueryChange from '../ConfirmQueryChange';
import DashboardDeleteConfirmation from '../DashboardDeleteConfirmation';
import Toolbar from '../Toolbar';
import EditorBar from '../EditorBar';
import GridLoader from '../GridLoader';
import Grid from '../Grid';

import { getDroppingItemSize } from '../../utils';
import { ROUTES, RESIZE_WIDGET_EVENT, GRID_MAX_VALUE } from '../../constants';

import { RootState } from '../../rootReducer';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const Editor: FC<Props> = ({ dashboardId }) => {
  const dispatch = useDispatch();

  const editorPubSub = useRef(new PubSub());
  const [containerWidth, setContainerWidth] = useState(0);

  const [droppableWidget, setDroppableWidget] = useState(null);
  const {
    isOpen: chartWidgetEditorOpen,
    changeQueryConfirmation,
  } = useSelector(getChartEditor);

  const {
    isOpen: textWidgetEditorOpen,
    content: textEditorContent,
    textAlignment,
  } = useSelector(getTextEditor);

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
    isPublic,
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
        isPublic={isPublic}
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
            onAddWidget={(widgetType) => {
              const widgetId = createWidgetId();
              const { w, h, minH, minW } = getDroppingItemSize(widgetType);

              dispatch(
                createWidget(widgetId, widgetType, {
                  x: 0,
                  y: GRID_MAX_VALUE,
                  w,
                  h,
                  minW,
                  minH,
                })
              );
              dispatch(addWidgetToDashboard(dashboardId, widgetId));
            }}
            onWidgetDrag={(widgetType) => setDroppableWidget(widgetType)}
          />
        </EditorBar>
      </EditorContainer>
      <Content>
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
              editorPubSub.current.publish(RESIZE_WIDGET_EVENT, {
                id: widgetId,
              });
            }}
            onRemoveWidget={(widgetId) => {
              dispatch(removeWidgetFromDashboard(dashboardId, widgetId));
              dispatch(saveDashboard(dashboardId));
            }}
          />
        ) : (
          <GridLoader />
        )}
      </Content>
      <ChartWidgetEditor isOpen={chartWidgetEditorOpen} />
      <TextWidgetEditor
        editorTextAlignment={textAlignment}
        textEditorContent={textEditorContent}
        isOpen={textWidgetEditorOpen}
      />
      <ConfirmQueryChange isOpen={changeQueryConfirmation} />
      <DashboardDeleteConfirmation />
      <QueryPickerModal />
      <DatePickerModal />
      <ImagePickerModal />
      <FilterModal />
    </EditorContext.Provider>
  );
};

export default Editor;
