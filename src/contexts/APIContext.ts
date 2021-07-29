import { createContext } from 'react';

import { DashboardAPI } from '../api';

export const APIContext = createContext<{
  dashboardApi: DashboardAPI;
  keenAnalysis: any;
}>({
  dashboardApi: null,
  keenAnalysis: null,
});
