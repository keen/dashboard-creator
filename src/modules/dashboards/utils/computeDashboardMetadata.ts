import { DashboardModel, DashboardMetaData } from '../types';

const computeDashboardMetadata = (
  dashboard: DashboardModel
): Pick<DashboardMetaData, 'queries' | 'widgets'> => {
  const { widgets } = dashboard;

  const savedQueries = widgets.reduce((acc, widget) => {
    if (
      widget.type === 'visualization' &&
      widget.query &&
      typeof widget.query === 'string'
    ) {
      acc.add(widget.query);
    }
    return acc;
  }, new Set([]));

  return {
    queries: savedQueries.size,
    widgets: widgets.length,
  };
};

export default computeDashboardMetadata;
