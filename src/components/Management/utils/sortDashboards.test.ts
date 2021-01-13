import sortDashboards from './sortDashboards';

const dashboards = [
  {
    id: '1',
    widgets: 0,
    queries: 0,
    tags: [],
    isPublic: false,
    title: 'First',
    lastModificationDate: 1610528149408,
  },
  {
    id: '2',
    widgets: 0,
    queries: 0,
    tags: [],
    isPublic: false,
    title: 'Second',
    lastModificationDate: 1610466500832,
  },
  {
    id: '3',
    widgets: 0,
    queries: 0,
    tags: [],
    isPublic: false,
    title: 'Third',
    lastModificationDate: 1610464613510,
  },
  {
    id: '4',
    widgets: 0,
    queries: 0,
    tags: [],
    isPublic: false,
    title: null,
    lastModificationDate: 1610465584382,
  },
];

test('should sort dashboards as Recent', () => {
  const sorted = sortDashboards(dashboards, 'recent');

  expect(sorted).toMatchInlineSnapshot(`
    Array [
      Object {
        "lastModificationDate": 1610528149408,
        "title": "First",
      },
      Object {
        "lastModificationDate": 1610466500832,
        "title": "Second",
      },
      Object {
        "lastModificationDate": 1610465584382,
        "title": null,
      },
      Object {
        "lastModificationDate": 1610464613510,
        "title": "Third",
      },
    ]
  `);
});

test('should sort dashboards as Oldest', () => {
  const sorted = sortDashboards(dashboards, 'oldest');

  expect(sorted).toMatchInlineSnapshot(`
    Array [
      Object {
        "lastModificationDate": 1610464613510,
        "title": "Third",
      },
      Object {
        "lastModificationDate": 1610465584382,
        "title": null,
      },
      Object {
        "lastModificationDate": 1610466500832,
        "title": "Second",
      },
      Object {
        "lastModificationDate": 1610528149408,
        "title": "First",
      },
    ]
  `);
});

test('should sort dashboards as A - Z', () => {
  const sorted = sortDashboards(dashboards, 'az');

  expect(sorted).toMatchInlineSnapshot(`
    Array [
      Object {
        "lastModificationDate": 1610528149408,
        "title": "First",
      },
      Object {
        "lastModificationDate": 1610466500832,
        "title": "Second",
      },
      Object {
        "lastModificationDate": 1610464613510,
        "title": "Third",
      },
      Object {
        "lastModificationDate": 1610465584382,
        "title": null,
      },
    ]
  `);
});

test('should sort dashboards as Z - A', () => {
  const sorted = sortDashboards(dashboards, 'za');

  expect(sorted).toMatchInlineSnapshot(`
    Array [
      Object {
        "lastModificationDate": 1610464613510,
        "title": "Third",
      },
      Object {
        "lastModificationDate": 1610466500832,
        "title": "Second",
      },
      Object {
        "lastModificationDate": 1610528149408,
        "title": "First",
      },
      Object {
        "lastModificationDate": 1610465584382,
        "title": null,
      },
    ]
  `);
});
