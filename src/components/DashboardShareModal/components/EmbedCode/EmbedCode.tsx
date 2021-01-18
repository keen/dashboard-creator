import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import xml from 'react-syntax-highlighter/dist/cjs/languages/hljs/xml';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import a11y from 'react-syntax-highlighter/dist/cjs/styles/hljs/a11y-light';

import { Button } from '@keen.io/ui-core';
import { Divider } from '../../components';
import {
  Placeholder,
  CodeWrapper,
  Navigation,
  NavigationItem,
} from './EmbedCode.styles';

SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('javascript', js);

type Props = {
  dashboardId: string;
  isPublic?: boolean;
};

const EmbedCode: FC<Props> = ({ dashboardId, isPublic }) => {
  const { t } = useTranslation();

  return (
    <>
      {isPublic ? (
        <>
          <CodeWrapper>
            <SyntaxHighlighter
              language="javascript"
              style={a11y}
              wrapLongLines={true}
              customStyle={{ margin: '0' }}
            >
              {`
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
               const projectId = "57856dd7ae574d605105ad75";
               const masterKey = "";
               const dashboardInfo = data;
               const myDashboardViewer = new DashboardViewer({
                 container: "#viewer",
                 isDashboardPublic: true,
                 dashboardInfo,
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
       `}
            </SyntaxHighlighter>
          </CodeWrapper>
          <Divider />
          <Navigation>
            <NavigationItem>
              <Button
                variant="secondary"
                style="solid"
                onClick={() =>
                  // dispatch(copyEmbeddedCode(projectId, readKey))
                  console.log('copy')
                }
              >
                {t('dashboard_share.copy_code')}
              </Button>
            </NavigationItem>
            <NavigationItem>
              <Button
                variant="secondary"
                style="outline"
                onClick={() =>
                  // dispatch(downloadCodeSnippet(projectId, readKey))
                  console.log('download')
                }
              >
                {t('dashboard_share.download_code')}
              </Button>
            </NavigationItem>
          </Navigation>
        </>
      ) : (
        <Placeholder>{t('dashboard_share.embed_placeholder')}</Placeholder>
      )}
    </>
  );
};

export default EmbedCode;
