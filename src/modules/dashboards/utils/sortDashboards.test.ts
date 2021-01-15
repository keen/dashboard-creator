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
        "id": "1",
        "isPublic": false,
        "lastModificationDate": 1610528149408,
        "queries": 0,
        "tags": Array [],
        "title": "First",
        "widgets": 0,
      },
      Object {
        "id": "2",
        "isPublic": false,
        "lastModificationDate": 1610466500832,
        "queries": 0,
        "tags": Array [],
        "title": "Second",
        "widgets": 0,
      },
      Object {
        "id": "4",
        "isPublic": false,
        "lastModificationDate": 1610465584382,
        "queries": 0,
        "tags": Array [],
        "title": null,
        "widgets": 0,
      },
      Object {
        "id": "3",
        "isPublic": false,
        "lastModificationDate": 1610464613510,
        "queries": 0,
        "tags": Array [],
        "title": "Third",
        "widgets": 0,
      },
    ]
  `);
});

test('should sort dashboards as Oldest', () => {
  const sorted = sortDashboards(dashboards, 'oldest');

  expect(sorted).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "3",
        "isPublic": false,
        "lastModificationDate": 1610464613510,
        "queries": 0,
        "tags": Array [],
        "title": "Third",
        "widgets": 0,
      },
      Object {
        "id": "4",
        "isPublic": false,
        "lastModificationDate": 1610465584382,
        "queries": 0,
        "tags": Array [],
        "title": null,
        "widgets": 0,
      },
      Object {
        "id": "2",
        "isPublic": false,
        "lastModificationDate": 1610466500832,
        "queries": 0,
        "tags": Array [],
        "title": "Second",
        "widgets": 0,
      },
      Object {
        "id": "1",
        "isPublic": false,
        "lastModificationDate": 1610528149408,
        "queries": 0,
        "tags": Array [],
        "title": "First",
        "widgets": 0,
      },
    ]
  `);
});

test('should sort dashboards as A - Z', () => {
  const sorted = sortDashboards(dashboards, 'az');

  expect(sorted).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "1",
        "isPublic": false,
        "lastModificationDate": 1610528149408,
        "queries": 0,
        "tags": Array [],
        "title": "First",
        "widgets": 0,
      },
      Object {
        "id": "2",
        "isPublic": false,
        "lastModificationDate": 1610466500832,
        "queries": 0,
        "tags": Array [],
        "title": "Second",
        "widgets": 0,
      },
      Object {
        "id": "3",
        "isPublic": false,
        "lastModificationDate": 1610464613510,
        "queries": 0,
        "tags": Array [],
        "title": "Third",
        "widgets": 0,
      },
      Object {
        "id": "4",
        "isPublic": false,
        "lastModificationDate": 1610465584382,
        "queries": 0,
        "tags": Array [],
        "title": null,
        "widgets": 0,
      },
    ]
  `);
});

test('should sort dashboards as Z - A', () => {
  const sorted = sortDashboards(dashboards, 'za');

  expect(sorted).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "3",
        "isPublic": false,
        "lastModificationDate": 1610464613510,
        "queries": 0,
        "tags": Array [],
        "title": "Third",
        "widgets": 0,
      },
      Object {
        "id": "2",
        "isPublic": false,
        "lastModificationDate": 1610466500832,
        "queries": 0,
        "tags": Array [],
        "title": "Second",
        "widgets": 0,
      },
      Object {
        "id": "1",
        "isPublic": false,
        "lastModificationDate": 1610528149408,
        "queries": 0,
        "tags": Array [],
        "title": "First",
        "widgets": 0,
      },
      Object {
        "id": "4",
        "isPublic": false,
        "lastModificationDate": 1610465584382,
        "queries": 0,
        "tags": Array [],
        "title": null,
        "widgets": 0,
      },
    ]
  `);
});
