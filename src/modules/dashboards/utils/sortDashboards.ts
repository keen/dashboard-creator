import {
  DashboardMetaData,
  DashboardListOrder,
} from '../../../modules/dashboards';

const sortDashboards = (
  dashboards: DashboardMetaData[],
  order: DashboardListOrder
) => {
  if (order === 'recent' || order === 'oldest') {
    return dashboards.sort((a, b) => {
      if (a.lastModificationDate > b.lastModificationDate)
        return order === 'recent' ? -1 : 1;
      if (a.lastModificationDate < b.lastModificationDate)
        return order === 'recent' ? 1 : -1;
      return 0;
    });
  }

  if (order === 'az' || order === 'za') {
    return dashboards.sort((a, b) => {
      if (a.title === null) return 1;
      if (b.title === null) return -1;
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return order === 'az' ? -1 : 1;
      if (titleA > titleB) return order === 'az' ? 1 : -1;
      return 0;
    });
  }
  return dashboards;
};

export default sortDashboards;
