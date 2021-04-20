import { enhanceWidget } from './enhanceWidget';

test('enhances "visualization" widget', () => {
  const widget: any = {
    id: '@widget/id',
    type: 'visualization',
    position: { x: 3, y: 2, w: 6, h: 2 },
    query: null,
    settings: {
      chartSettings: {},
      visualizationType: null,
      widgetSettings: {},
    },
  };

  expect(enhanceWidget(widget)).toMatchInlineSnapshot(`
    Object {
      "datePickerId": null,
      "filterIds": Array [],
      "id": "@widget/id",
      "position": Object {
        "h": 2,
        "w": 6,
        "x": 3,
        "y": 2,
      },
      "query": null,
      "settings": Object {
        "chartSettings": Object {},
        "visualizationType": null,
        "widgetSettings": Object {},
      },
      "type": "visualization",
    }
  `);
});

test('returns widget model', () => {
  const widget: any = {
    id: '@image/01',
    type: 'image',
  };

  expect(enhanceWidget(widget)).toEqual(widget);
});
