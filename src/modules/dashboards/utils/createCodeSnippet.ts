type Snippet = 'body' | 'head';

const createCodeSnippet = ({
  projectId,
  userKey,
  dashboardId,
  type,
}: {
  projectId: string;
  userKey: string;
  dashboardId: string;
  type?: Snippet;
}) => {
  if (type === 'head') {
    return `<script crossorigin src="https://cdn.jsdelivr.net/npm/@keen.io/dashboard-creator@latest/dist/public-dashboard/main.min.js"></script>`;
  }
  if (type === 'body') {
    return `<div id="root"></div>
<script type="text/javascript">
  new KeenPublicDashboard({
    container: '#root',
    dashboardId: '${dashboardId}',
    backend: {
      analyticsApiUrl: 'api.keen.io',
      dashboardsApiUrl: 'https://blob-service.keen.io',
    },
    project: {
      id: '${projectId}',
      accessKey: '${userKey}' 
    },
  }).render();
</script>`;
  }
  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=11" />
    <title>Public Dashboard</title>
    <link rel="stylesheet" type="text/css" href="https://static.keen.io/assets/keen-fonts.css" />
    <script crossorigin src="https://cdn.jsdelivr.net/npm/@keen.io/dashboard-creator@latest/dist/public-dashboard/main.min.js"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
  <script type="text/javascript">
     new KeenPublicDashboard({
       container: '#root',
       dashboardId: '${dashboardId}',
       backend: {
         analyticsApiUrl: 'api.keen.io',
         dashboardsApiUrl: 'https://blob-service.keen.io',
       },
       project: {
         id: '${projectId}',
         accessKey: '${userKey}' 
       },
     }).render();
    </script>
    </body>
  </html>  
`;
};

export default createCodeSnippet;
