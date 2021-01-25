import createPublicDashboardKeyName from './createPublicDashboardKeyName';

test('return dashboard name base on dashboardId', () => {
  const dashboardId = '@dashboard/01';
  expect(createPublicDashboardKeyName(dashboardId)).toMatchInlineSnapshot(
    `"@keen-dashboard-creator-@dashboard/01"`
  );
});
