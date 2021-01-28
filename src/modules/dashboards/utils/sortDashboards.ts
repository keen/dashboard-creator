import {
  DashboardMetaData,
  DASHBOARDS_ORDER,
} from '../../../modules/dashboards';

const sortDashboards = (dashboards: DashboardMetaData[], order: string) => {
  if (order === DASHBOARDS_ORDER.recent || order === DASHBOARDS_ORDER.oldest) {
    return dashboards.sort((a, b) => {
      if (a.lastModificationDate > b.lastModificationDate)
        return order === DASHBOARDS_ORDER.recent ? -1 : 1;
      if (a.lastModificationDate < b.lastModificationDate)
        return order === DASHBOARDS_ORDER.recent ? 1 : -1;
      return 0;
    });
  }

  if (order === DASHBOARDS_ORDER.az || order === DASHBOARDS_ORDER.za) {
    return dashboards.sort((a, b) => {
      if (a.title === null) return 1;
      if (b.title === null) return -1;
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return order === DASHBOARDS_ORDER.az ? -1 : 1;
      if (titleA > titleB) return order === DASHBOARDS_ORDER.az ? 1 : -1;
      return 0;
    });
  }
  return dashboards;
};

export default sortDashboards;
