import React, { FC } from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Container, Content } from './App.styles';

import { getActiveDashboard } from './modules/app';
import { DashboardMetaData, saveDashboardMeta } from './modules/dashboards';

import PageLoader from './components/PageLoader';
import ToastNotifications from './components/ToastNotifications';
import DashboardSettingsModal from './components/DashboardSettingsModal';
import DashboardShareModal from './components/DashboardShareModal';
import { ROUTES } from './constants';

type Props = {};

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

const App: FC<Props> = () => {
  const activeDashboard = useSelector(getActiveDashboard);
  const dispatch = useDispatch();

  return (
    <Container>
      <div id="dropdown-container" style={{ position: 'relative' }}>
        Dropdown container
      </div>
      <Content>
        <Switch>
          <Route exact path="/" component={Management} />
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
          dispatch(saveDashboardMeta(dashboardId, metadata))
        }
      />
      <DashboardShareModal />
    </Container>
  );
};

export default App;
