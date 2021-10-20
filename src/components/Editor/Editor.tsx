import React, { FC, useState, useCallback, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout as LayoutItem } from 'react-grid-layout';
import { push } from 'connected-react-router';
import { PubSub } from '@keen.io/pubsub';
import { Portal } from '@keen.io/ui-core';

import { Content, EditorContainer } from './Editor.styles';

import {
  addWidgetToDashboard,
  removeWidgetFromDashboard,
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
import { themeSagaActions, themeSelectors } from '../../modules/theme';
import { textEditorSelectors } from '../../modules/textEditor';

import { AppContext, EditorContext } from '../../contexts';

import { useMarkerRef } from './customHooks';

import EditorNavigation from '../EditorNavigation';
import QueryPickerModal from '../QueryPickerModal';
import DatePickerModal from '../DatePickerModal';
import ImagePickerModal from '../ImagePickerModal';
import ThemeEditorModal from '../ThemeEditorModal';
import FilterModal from '../FilterModal';
import ChartWidgetEditor from '../ChartWidgetEditor';
import TextWidgetEditor from '../TextWidgetEditor';
import ConfirmQueryChange from '../ConfirmQueryChange';
import DashboardDeleteConfirmation from '../DashboardDeleteConfirmation';
import Toolbar from '../Toolbar';
import EditorBar from '../EditorBar';
import GridLoader from '../GridLoader';
import Grid from '../Grid';

import { ROUTES, RESIZE_WIDGET_EVENT } from '../../constants';

import { RootState } from '../../rootReducer';
import {
  calculateYPositionAndAddWidget,
  finishDashboardEdition,
} from '../../modules/dashboards/actions';
import { appActions } from '../../modules/app';
import { chartEditorSelectors } from '../../modules/chartEditor';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const Editor: FC<Props> = ({ dashboardId }) => {
  const dispatch = useDispatch();

  const markerRef = useRef(null);
  const editorPubSub = useRef(new PubSub());

  const [containerWidth, setContainerWidth] = useState(0);
  const [droppableWidget, setDroppableWidget] = useState(null);
  const {
    modalContainer,
    features: { enableFixedEditorBar },
  } = useContext(AppContext);
  const {
    isOpen: chartWidgetEditorOpen,
    changeQueryConfirmation,
  } = useSelector(chartEditorSelectors.getChartEditor);

  const {
    isOpen: textWidgetEditorOpen,
    content: textEditorContent,
    textAlignment,
  } = useSelector(textEditorSelectors.getTextEditor);

  const { widgetsId, isInitialized, gridGap, isSaving } = useSelector(
    (state: RootState) => {
      const dashboard = getDashboard(state, dashboardId);
      const themeSettings = themeSelectors.getThemeByDashboardId(
        state,
        dashboardId
      );

      if (dashboard?.initialized && themeSettings) {
        const {
          settings: {
            page: { gridGap },
          },
        } = themeSettings;

        return {
          isInitialized: true,
          gridGap,
          isSaving: dashboard.isSaving,
          widgetsId: dashboard.settings.widgets,
        };
      }

      return {
        widgetsId: [],
        isSaving: false,
        gridGap: null,
        isInitialized: false,
      };
    }
  );

  const { isSticky, setMarkerRef } = useMarkerRef(
    markerRef,
    enableFixedEditorBar
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
          dispatch(appActions.setActiveDashboard(null));
          dispatch(push(ROUTES.MANAGEMENT));
        }}
      />
      {enableFixedEditorBar && <span ref={setMarkerRef}></span>}
      <EditorContainer isFixed={enableFixedEditorBar} isSticky={isSticky}>
        <EditorBar
          isSticky={isSticky}
          isSaving={isSaving}
          onEditTheme={() =>
            dispatch(themeSagaActions.editDashboardTheme(dashboardId))
          }
          onFinishEdit={() => {
            dispatch(finishDashboardEdition(dashboardId));
          }}
          lastSaveTime={lastModificationDate}
        >
          <Toolbar
            onAddWidget={(widgetType) => {
              dispatch(calculateYPositionAndAddWidget(dashboardId, widgetType));
            }}
            onWidgetDragEnd={() => setDroppableWidget(null)}
            onWidgetDrag={(widgetType) => setDroppableWidget(widgetType)}
          />
        </EditorBar>
      </EditorContainer>
      <Content>
        {isInitialized ? (
          <Grid
            isEditorMode={true}
            widgetsId={widgetsId}
            gridGap={gridGap}
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
      <Portal modalContainer={modalContainer}>
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
        <ThemeEditorModal />
        <ImagePickerModal />
        <FilterModal />
      </Portal>
    </EditorContext.Provider>
  );
};

export default Editor;
