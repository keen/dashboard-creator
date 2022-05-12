import createDashboardSettings from './createDashboardSettings';

test('Creates default dashboard configuration settings', () => {
  expect(createDashboardSettings()).toMatchSnapshot();
});
