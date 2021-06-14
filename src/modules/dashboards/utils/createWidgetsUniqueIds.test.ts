import createWidgetsUniqueIds from './createWidgetsUniqueIds';
import { Widget } from '../../widgets';

const widgetId = '@widget/01';

jest.mock('../../widgets/utils', () => {
  return {
    createWidgetId: () => widgetId,
  };
});

test('create unique Ids for widgets', () => {
  const widgets = [
    {
      id: 'widget/8404f578-b43f-4704-b3c7-2826dbc0a973',
      position: { x: 4, y: 2, w: 2, h: 2, minW: 2, minH: 1 },
      type: 'filter',
      settings: {
        widgets: ['widget/3badfaf3-8a25-4bd7-9207-777a9a348ab4'],
        eventStream: 'purchases',
        targetProperty: 'geo_information.city',
      },
    },
    {
      id: 'widget/97aef77c-5905-4e93-a8df-c4d9971c5c0f',
      position: { w: 4, h: 2, x: 4, y: 0, minH: 2, minW: 4 },
      type: 'date-picker',
      settings: {
        widgets: [
          'widget/3badfaf3-8a25-4bd7-9207-777a9a348ab4',
          'widget/c3d16644-f9d2-48ec-932d-9967e4f7e179',
        ],
      },
    },
    {
      filterIds: ['widget/8404f578-b43f-4704-b3c7-2826dbc0a973'],
      datePickerId: 'widget/97aef77c-5905-4e93-a8df-c4d9971c5c0f',
      id: 'widget/3badfaf3-8a25-4bd7-9207-777a9a348ab4',
      position: { w: 4, h: 9, x: 0, y: 9, minH: 6, minW: 2 },
      type: 'visualization',
      query: 'extraction-cache',
      settings: {
        visualizationType: 'table',
        chartSettings: {},
        widgetSettings: {},
      },
    },
    {
      filterIds: [],
      datePickerId: 'widget/97aef77c-5905-4e93-a8df-c4d9971c5c0f',
      id: 'widget/c3d16644-f9d2-48ec-932d-9967e4f7e179',
      position: { w: 4, h: 9, x: 0, y: 0, minH: 6, minW: 2 },
      type: 'visualization',
      query: 'customers-by-continent',
    },
  ] as Widget[];
  const transformedWidgets = [
    {
      id: widgetId,
      position: { x: 4, y: 2, w: 2, h: 2, minW: 2, minH: 1 },
      type: 'filter',
      settings: {
        widgets: [widgetId],
        eventStream: 'purchases',
        targetProperty: 'geo_information.city',
      },
    },
    {
      id: widgetId,
      position: { w: 4, h: 2, x: 4, y: 0, minH: 2, minW: 4 },
      type: 'date-picker',
      settings: { widgets: [widgetId, widgetId] },
    },
    {
      filterIds: [widgetId],
      datePickerId: widgetId,
      id: widgetId,
      position: { w: 4, h: 9, x: 0, y: 9, minH: 6, minW: 2 },
      type: 'visualization',
      query: 'extraction-cache',
      settings: {
        visualizationType: 'table',
        chartSettings: {},
        widgetSettings: {},
      },
    },
    {
      filterIds: [],
      datePickerId: widgetId,
      id: widgetId,
      position: { w: 4, h: 9, x: 0, y: 0, minH: 6, minW: 2 },
      type: 'visualization',
      query: 'customers-by-continent',
    },
  ] as Widget[];

  expect(createWidgetsUniqueIds(widgets)).toEqual(transformedWidgets);
});
