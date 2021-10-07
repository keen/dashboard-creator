import { Query } from '@keen.io/query';
import { Widget } from '../../widgets';
import computeDashboardMetadata from './computeDashboardMetadata';

const savedQueryWidget: Widget = {
  id: '@widget/01',
  position: { x: 0, y: 0, w: 2, h: 3 },
  type: 'visualization',
  query: 'purchases',
  datePickerId: null,
  filterIds: [],
  settings: {
    visualizationType: 'bar',
    chartSettings: {},
    widgetSettings: {},
  },
};

const chartWidget: Widget = {
  id: '@widget/02',
  datePickerId: null,
  filterIds: [],
  position: { x: 0, y: 0, w: 2, h: 3 },
  type: 'visualization',
  query: {
    analysis_type: 'count',
  } as Query,
  settings: {
    visualizationType: 'pie',
    chartSettings: {},
    widgetSettings: {},
  },
};

const imageWidget: Widget = {
  id: '@widget/03',
  position: { x: 0, y: 0, w: 2, h: 3 },
  type: 'image',
  settings: {
    link: 'image.png',
  },
};

const textWidget: Widget = {
  id: '@widget/04',
  position: { x: 0, y: 0, w: 2, h: 3 },
  type: 'text',
  settings: {
    content: {
      blocks: [],
      entityMap: {},
    },
    textAlignment: 'left',
  },
};

test('returns computed dashboard metadata for empty dashboard', () => {
  const dashboard = {
    version: '@version',
    widgets: [],
  };
  const result = computeDashboardMetadata(dashboard);
  expect(result).toMatchInlineSnapshot(`
    Object {
      "queries": 0,
      "widgets": 0,
    }
  `);
});

test('returns computed dashboard metadata for dashboard with widgets', () => {
  const dashboard = {
    version: '@version',
    widgets: [savedQueryWidget, chartWidget, imageWidget, textWidget],
  };
  const result = computeDashboardMetadata(dashboard);
  expect(result).toMatchInlineSnapshot(`
    Object {
      "queries": 2,
      "widgets": 4,
    }
  `);
});
