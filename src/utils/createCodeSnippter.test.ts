import createCodeSnippet from './createCodeSnippet';

test('return code snippet for provided projectId and dashboardId', () => {
  const projectId = 'projectId';
  const dashboardId = 'dashboardId';

  expect(createCodeSnippet({ projectId, dashboardId })).toMatchInlineSnapshot(`
    "
    <!doctype html>
      <html>
        <head>
          <meta charset=\\"utf-8\\">
          <script crossorigin src=\\"https://cdn.jsdelivr.net/npm/keen-dashboard-builder@2.0.10/dist/viewer.min.js\\"></script>
        </head>
        <body>
          <div id=\\"viewer\\"></div>
          <script>

            const url = \\"https://keen.io/dashboard/dashboardId\\";

            fetch(url)
            .then(res => res.json())
            .then(data => {
              const projectId = \\"projectId\\";
              const masterKey = \\"\\";
              const myDashboardViewer = new DashboardViewer({
                container: \\"#viewer\\",
                isDashboardPublic: true,
                dashboardInfo: data,
                keenAnalysis: {
                  config: {
                    projectId,
                    masterKey,
                  }
                }
              });
            })
            .catch(e => console.error(e))
          </script>
        </body>
      </html>
    "
  `);
});

test('return code snippet for head section', () => {
  const projectId = 'projectId';
  const dashboardId = 'dashboardId';
  const type = 'head';

  expect(
    createCodeSnippet({ projectId, dashboardId, type })
  ).toMatchInlineSnapshot(
    `"<script crossorigin src=\\"https://cdn.jsdelivr.net/npm/keen-dashboard-builder@2.0.10/dist/viewer.min.js\\"></script>"`
  );
});

test('return code snippet for body section', () => {
  const projectId = 'projectId';
  const dashboardId = 'dashboardId';
  const type = 'body';

  expect(createCodeSnippet({ projectId, dashboardId, type }))
    .toMatchInlineSnapshot(`
    "
        <div id=\\"viewer\\"></div>
        <script>

          const url = \\"https://keen.io/dashboard/dashboardId\\";

          fetch(url)
          .then(res => res.json())
          .then(data => {
            const projectId = \\"projectId\\";
            const masterKey = \\"\\";
            const myDashboardViewer = new DashboardViewer({
              container: \\"#viewer\\",
              isDashboardPublic: true,
              dashboardInfo: data,
              keenAnalysis: {
                config: {
                  projectId,
                  masterKey,
                }
              }
            });
          })
          .catch(e => console.error(e))
        </script>
        "
  `);
});
