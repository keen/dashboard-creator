type Snippet = 'body' | 'head';

const createCodeSnippet = ({
  projectId,
  masterKey,
  dashboardId,
  type,
}: {
  projectId: string;
  masterKey: string;
  dashboardId: string;
  type?: Snippet;
}) => {
  if (type === 'head') {
    return `<script crossorigin src="https://cdn.jsdelivr.net/npm/keen-dashboard-builder@latest/dist/viewer.min.js"></script>`;
  }
  if (type === 'body') {
    return `
    <div id="root"></div>
    <script type="text/javascript">
       new KeenPublicDashboard({
         container: '#root',
         dashboardId: ${dashboardId},
         backend: {
           analyticsApiUrl: 'staging-api.keen.io',
           dashboardsApiUrl: 'https://blob-service.us-west-2.test.aws.keen.io',
         },
         project: {
           id: ${projectId},
           masterKey: ${masterKey} 
         },
       }).render();
      </script>
    `;
  }
  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=11" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    <link rel="stylesheet" type="text/css" href="https://static.keen.io/assets/keen-fonts.css" />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
  <script type="text/javascript">
     new KeenPublicDashboard({
       container: '#root',
       dashboardId: ${dashboardId},
       backend: {
         analyticsApiUrl: 'staging-api.keen.io',
         dashboardsApiUrl: 'https://blob-service.us-west-2.test.aws.keen.io',
       },
       project: {
         id: ${projectId},
         masterKey: ${masterKey} 
       },
     }).render();
    </script>
  </html>  
`;
};

export default createCodeSnippet;
