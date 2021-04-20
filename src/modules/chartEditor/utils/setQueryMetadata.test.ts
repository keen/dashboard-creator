import setQueryVisualizationMetadata from './setQueryMetadata';

test('excludes widget heading settings', () => {
  const chartSettings = {
    curve: 'spline',
    xScaleSettings: {
      formatLabel: '${number, 0.00}',
    },
  };

  const widgetSettings = {
    title: {
      content: '@widget/title',
    },
  };

  expect(setQueryVisualizationMetadata('line', chartSettings, widgetSettings))
    .toMatchInlineSnapshot(`
    Object {
      "defaultChartSettings": Object {
        "curve": "spline",
      },
      "defaultWidgetSettings": Object {},
    }
  `);
});

test('excludes choropleth widget settings', () => {
  const chartSettings = {};
  const widgetSettings = {
    geographicArea: 'world',
    title: {
      content: '@widget/title',
    },
  };

  expect(
    setQueryVisualizationMetadata('choropleth', chartSettings, widgetSettings)
  ).toMatchInlineSnapshot(`
    Object {
      "defaultChartSettings": Object {},
      "defaultWidgetSettings": Object {
        "geographicArea": "world",
      },
    }
  `);
});
