import reduceWidgetsCount from './reduceWidgetsCount';

import { dashboardsMeta } from '../fixtures';

test('increase the number of widgets for specific dashboard', () => {
  const [dashboard] = reduceWidgetsCount(
    '@dashboard/01',
    dashboardsMeta,
    'increase'
  );
  const { widgets } = dashboard;

  expect(widgets).toMatchInlineSnapshot(`6`);
});

test('decrease the number of widgets for specific dashboard', () => {
  const [dashboard] = reduceWidgetsCount(
    '@dashboard/01',
    dashboardsMeta,
    'decrease'
  );
  const { widgets } = dashboard;

  expect(widgets).toMatchInlineSnapshot(`4`);
});
