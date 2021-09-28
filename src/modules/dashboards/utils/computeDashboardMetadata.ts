import { DashboardModel, DashboardMetaData } from '../types';

const computeDashboardMetadata = (
  dashboard: DashboardModel
): Pick<DashboardMetaData, 'queries' | 'widgets'> => {
  const { widgets } = dashboard;

  const queries = widgets.reduce((total, widget) => {
    if (widget.type === 'visualization') {
      return total + 1;
    }
    return total;
  }, 0);

  return {
    queries,
    widgets: widgets.length,
  };
};

export default computeDashboardMetadata;
