import React, { FC } from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Container, Content, DropdownContainer } from './App.styles';

import { DashboardMetaData, dashboardsActions } from './modules/dashboards';

import PageLoader from './components/PageLoader';
import ToastNotifications from './components/ToastNotifications';
import DashboardSettingsModal from './components/DashboardSettingsModal';
import DashboardShareModal from './components/DashboardShareModal';

import { appSelectors } from './modules/app';
import { themeSelectors } from './modules/theme';
import { hot } from 'react-hot-loader/root';

import { ROUTES } from './constants';

const Editor = Loadable({
  loader: () => import(/* webpackChunkName: "editor" */ './components/Editor'),
  loading: PageLoader,
});

const Viewer = Loadable({
  loader: () => import(/* webpackChunkName: "viewer" */ './components/Viewer'),
  loading: PageLoader,
});

const Management = Loadable({
  loader: () =>
    import(/* webpackChunkName: "management" */ './components/Management'),
  loading: PageLoader,
});

const App: FC = () => {
  const activeDashboard = useSelector(appSelectors.getActiveDashboard);
  const dashboardSettings = useSelector(
    themeSelectors.getActiveDashboardThemeSettings
  );

  const dispatch = useDispatch();

  return (
    <Container background={dashboardSettings?.settings?.page.background}>
      <Content>
        <Switch>
          <Route exact path={ROUTES.MANAGEMENT} component={Management} />
          <Route
            exact
            path={ROUTES.VIEWER}
            render={() => <Viewer dashboardId={activeDashboard} />}
          />
          <Route
            exact
            path={ROUTES.EDITOR}
            render={() => <Editor dashboardId={activeDashboard} />}
          />
        </Switch>
      </Content>
      <ToastNotifications />
      <DashboardSettingsModal
        onSaveDashboard={(dashboardId: string, metadata: DashboardMetaData) =>
          dispatch(
            dashboardsActions.saveDashboardMetadata({ dashboardId, metadata })
          )
        }
      />
      <DashboardShareModal />
      <DropdownContainer id="dropdown-container" />
    </Container>
  );
};

export default hot(App);
