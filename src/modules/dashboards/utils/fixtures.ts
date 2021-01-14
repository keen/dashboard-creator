import { DashboardMetaData } from '../../../modules/dashboards';

export const dashboardsMeta: DashboardMetaData[] = [
  {
    id: '@dashboard/01',
    widgets: 5,
    queries: 0,
    title: 'Dashboard 1',
    tags: ['tag-1', 'tag-2', 'tag-4'],
    lastModificationDate: 1606895352390,
    isPublic: true,
  },
  {
    id: '@dashboard/02',
    widgets: 0,
    queries: 2,
    title: 'Dashboard 2',
    tags: ['tag-2', 'tag-3'],
    lastModificationDate: 1606895352390,
    isPublic: true,
  },
  {
    id: '@dashboard/03',
    widgets: 0,
    queries: 0,
    title: null,
    tags: ['tag-1', 'tag-4'],
    lastModificationDate: 1606895352390,
    isPublic: true,
  },
];