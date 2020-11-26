import reduceWidgetsCount from './reduceWidgetsCount';

import { dashbordsMeta } from '../fixtures';

test('increase the number of widgets for specific dashboard', () => {
  const [dashboard] = reduceWidgetsCount(
    '@dashboard/01',
    dashbordsMeta,
    'increase'
  );
  const { widgets } = dashboard;

  expect(widgets).toMatchInlineSnapshot(`6`);
});

test('decrease the number of widgets for specific dashboard', () => {
  const [dashboard] = reduceWidgetsCount(
    '@dashboard/01',
    dashbordsMeta,
    'decrease'
  );
  const { widgets } = dashboard;

  expect(widgets).toMatchInlineSnapshot(`4`);
});
