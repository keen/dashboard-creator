import createDashboardMeta from './createDashboardMeta';

test('createsDashboardMeta', () => {
  expect(createDashboardMeta('@dashboardId')).toMatchInlineSnapshot(`
    Object {
      "id": "@dashboardId",
      "isPublic": false,
      "lastModificationDate": null,
      "publicAccessKey": null,
      "queries": 0,
      "tags": Array [],
      "title": null,
      "widgets": 0,
    }
  `);
});
