import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { Container, Content } from './App.styles';

import { getViewMode, getActiveDashboard } from './modules/app';

import Management from './components/Management';
import Editor from './components/Editor';
import Viewer from './components/Viewer';

type Props = {};

const App: FC<Props> = () => {
  const view = useSelector(getViewMode);
  const activeDashboard = useSelector(getActiveDashboard);

  return (
    <Container>
      <Content>
        {view === 'management' && <Management />}
        {view === 'viewer' && <Viewer dashboardId={activeDashboard} />}
        {view === 'editor' && <Editor dashboardId={activeDashboard} />}
      </Content>
    </Container>
  );
};

export default App;
