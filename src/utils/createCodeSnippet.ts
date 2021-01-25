type Snippet = 'body' | 'head';

const createCodeSnippet = ({
  projectId,
  dashboardId,
  type,
}: {
  projectId: string;
  dashboardId: string;
  type?: Snippet;
}) => {
  if (type === 'head') {
    return `<script crossorigin src="https://cdn.jsdelivr.net/npm/keen-dashboard-builder@2.0.10/dist/viewer.min.js"></script>`;
  }
  if (type === 'body') {
    return `
    <div id="viewer"></div>
    <script>

      const url = "https://keen.io/dashboard/${dashboardId}";

      fetch(url)
      .then(res => res.json())
      .then(data => {
        const projectId = "${projectId}";
        const masterKey = "";
        const myDashboardViewer = new DashboardViewer({
          container: "#viewer",
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
    `;
  }
  return `
<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <script crossorigin src="https://cdn.jsdelivr.net/npm/keen-dashboard-builder@2.0.10/dist/viewer.min.js"></script>
    </head>
    <body>
      <div id="viewer"></div>
      <script>

        const url = "https://keen.io/dashboard/${dashboardId}";

        fetch(url)
        .then(res => res.json())
        .then(data => {
          const projectId = "${projectId}";
          const masterKey = "";
          const myDashboardViewer = new DashboardViewer({
            container: "#viewer",
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
`;
};

export default createCodeSnippet;
