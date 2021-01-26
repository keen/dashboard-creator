import createCodeSnippet from './createCodeSnippet';

test('return code snippet for provided projectId and dashboardId', () => {
  const projectId = 'projectId';
  const masterKey = 'masterKey';
  const dashboardId = 'dashboardId';

  expect(createCodeSnippet({ projectId, masterKey, dashboardId }))
    .toMatchInlineSnapshot(`
    "
      <!doctype html>
      <html lang=\\"en\\">
      <head>
        <meta charset=\\"utf-8\\">
        <meta http-equiv=\\"X-UA-Compatible\\" content=\\"IE=11\\" />
        <title><%= htmlWebpackPlugin.options.title %></title>
        <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"https://static.keen.io/assets/keen-fonts.css\\" />
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id=\\"root\\"></div>
      </body>
      <script type=\\"text/javascript\\">
         new KeenPublicDashboard({
           container: '#root',
           dashboardId: dashboardId,
           backend: {
             analyticsApiUrl: 'staging-api.keen.io',
             dashboardsApiUrl: 'https://blob-service.us-west-2.test.aws.keen.io',
           },
           project: {
             id: projectId,
             masterKey: masterKey 
           },
         }).render();
        </script>
      </html>  
    "
  `);
});

test('return code snippet for head section', () => {
  const projectId = 'projectId';
  const dashboardId = 'dashboardId';
  const masterKey = 'masterKey';
  const type = 'head';

  expect(
    createCodeSnippet({ projectId, masterKey, dashboardId, type })
  ).toMatchInlineSnapshot(
    `"<script crossorigin src=\\"https://cdn.jsdelivr.net/npm/keen-dashboard-builder@latest/dist/viewer.min.js\\"></script>"`
  );
});

test('return code snippet for body section', () => {
  const projectId = 'projectId';
  const masterKey = 'masterKey';
  const dashboardId = 'dashboardId';
  const type = 'body';

  expect(createCodeSnippet({ projectId, masterKey, dashboardId, type }))
    .toMatchInlineSnapshot(`
    "
        <div id=\\"root\\"></div>
        <script type=\\"text/javascript\\">
           new KeenPublicDashboard({
             container: '#root',
             dashboardId: dashboardId,
             backend: {
               analyticsApiUrl: 'staging-api.keen.io',
               dashboardsApiUrl: 'https://blob-service.us-west-2.test.aws.keen.io',
             },
             project: {
               id: projectId,
               masterKey: masterKey 
             },
           }).render();
          </script>
        "
  `);
});
