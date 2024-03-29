import createCodeSnippet from './createCodeSnippet';

test('return code snippet for provided projectId and dashboardId', () => {
  const projectId = 'projectId';
  const userKey = 'userKey';
  const dashboardId = 'dashboardId';

  expect(createCodeSnippet({ projectId, userKey, dashboardId }))
    .toMatchInlineSnapshot(`
    "
      <!doctype html>
      <html lang=\\"en\\">
      <head>
        <meta charset=\\"utf-8\\">
        <meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=11\\" />
        <title>Public Dashboard</title>
        <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"https://static.keen.io/assets/keen-fonts.css\\" />
        <script crossorigin src=\\"https://cdn.jsdelivr.net/npm/@keen.io/dashboard-creator@latest/dist/public-dashboard/runtime.min.js\\"></script>
        <script crossorigin src=\\"https://cdn.jsdelivr.net/npm/@keen.io/dashboard-creator@latest/dist/public-dashboard/vendors.min.js\\"></script>
        <script crossorigin src=\\"https://cdn.jsdelivr.net/npm/@keen.io/dashboard-creator@latest/dist/public-dashboard/main.min.js\\"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id=\\"root\\"></div>
        <div id=\\"modal-root\\"></div>
      <script type=\\"text/javascript\\">
        new KeenPublicDashboard({
          container: '#root',
          modalContainer: '#modal-root',
          dashboardId: 'dashboardId',
          defaultTimezoneForQuery: \\"Etc/UTC\\",
          disableTimezoneSelection: false,
          widgetsConfiguration: {
            datePicker: {
              defaultTimezone: 'Etc/UTC',
              disableTimezoneSelection: false
            }
          },
          backend: {
            analyticsApiUrl: 'api.keen.io',
            dashboardsApiUrl: 'https://dashboard-service.k-n.io',
          },
          project: {
            id: 'projectId',
            accessKey: 'userKey',
            masterKey: 'userKey',
          },
          translations: {
            backend: {
              loadPath: 'https://cdn.jsdelivr.net/npm/@keen.io/dashboard-creator@latest/dist/locales/{{lng}}/{{ns}}.json'
            }
          },
        }).render();
        </script>
        </body>
      </html>  
    "
  `);
});

test('return code snippet for head section', () => {
  const projectId = 'projectId';
  const dashboardId = 'dashboardId';
  const userKey = 'userKey';
  const type = 'head';

  expect(createCodeSnippet({ projectId, userKey, dashboardId, type }))
    .toMatchInlineSnapshot(`
    "
        <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"https://static.keen.io/assets/keen-fonts.css\\" />
        <script crossorigin src=\\"https://cdn.jsdelivr.net/npm/@keen.io/dashboard-creator@latest/dist/public-dashboard/runtime.min.js\\"></script>
        <script crossorigin src=\\"https://cdn.jsdelivr.net/npm/@keen.io/dashboard-creator@latest/dist/public-dashboard/vendors.min.js\\"></script>
        <script crossorigin src=\\"https://cdn.jsdelivr.net/npm/@keen.io/dashboard-creator@latest/dist/public-dashboard/main.min.js\\"></script>
        "
  `);
});

test('return code snippet for body section', () => {
  const projectId = 'projectId';
  const userKey = 'userKey';
  const dashboardId = 'dashboardId';
  const type = 'body';

  expect(createCodeSnippet({ projectId, userKey, dashboardId, type }))
    .toMatchInlineSnapshot(`
    "<div id=\\"root\\"></div>
        <div id=\\"modal-root\\"></div>
    <script type=\\"text/javascript\\">
      new KeenPublicDashboard({
        container: '#root',
          modalContainer: '#modal-root',
          dashboardId: 'dashboardId',
          defaultTimezoneForQuery: \\"Etc/UTC\\",
          disableTimezoneSelection: false,
          widgetsConfiguration: {
            datePicker: {
              defaultTimezone: 'Etc/UTC',
              disableTimezoneSelection: false
            }
          },
          backend: {
            analyticsApiUrl: 'api.keen.io',
            dashboardsApiUrl: 'https://dashboard-service.k-n.io',
          },
          project: {
            id: 'projectId',
            accessKey: 'userKey',
            masterKey: 'userKey',
          },
          translations: {
            backend: {
              loadPath: 'https://cdn.jsdelivr.net/npm/@keen.io/dashboard-creator@latest/dist/locales/{{lng}}/{{ns}}.json'
            }
          },
      }).render();
    </script>"
  `);
});
