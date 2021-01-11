import createTagsPool from './createTagsPool';
import { dashboardsMeta } from './fixtures';

test('allows user to get unique tags pool', () => {
  const tagsPool = createTagsPool(dashboardsMeta);
  expect(tagsPool).toMatchInlineSnapshot(`
    Array [
      "tag-1",
      "tag-2",
      "tag-4",
      "tag-3",
    ]
  `);
});
