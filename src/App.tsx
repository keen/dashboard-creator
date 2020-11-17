import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { getViewMode, getActiveDashboard } from './modules/app';

import Management from './components/Management';
import Editor from './components/Editor';

type Props = {};

const App: FC<Props> = () => {
  const view = useSelector(getViewMode);
  const activeDashboard = useSelector(getActiveDashboard);

  return (
    <div>
      {view === 'management' && <Management />}
      {view === 'editor' && <Editor dashboardId={activeDashboard} />}
    </div>
  );
};

export default App;
