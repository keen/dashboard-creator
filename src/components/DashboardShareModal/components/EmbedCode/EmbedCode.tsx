import React, { FC, useMemo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { copyToClipboard } from '@keen.io/charts-utils';
import xml from 'react-syntax-highlighter/dist/cjs/languages/hljs/xml';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import a11y from 'react-syntax-highlighter/dist/cjs/styles/hljs/a11y-light';

import { Button } from '@keen.io/ui-core';
import {
  Placeholder,
  Navigation,
  Container,
  Subtitle,
  Text,
  Step,
  Code,
  ButtonContainer,
} from './EmbedCode.styles';

import { createCodeSnippet } from '../../../../utils';
import { TOOLTIP_MOTION as BUTTON_MOTION } from '../../../../constants';
import { AppContext } from '../../../../contexts';

SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('javascript', js);

type Props = {
  dashboardId: string;
  isPublic?: boolean;
};

const BUTTONS = {
  copy: 'copy',
  download: 'download',
};

const EmbedCode: FC<Props> = ({ dashboardId, isPublic }) => {
  const { t } = useTranslation();
  const [showButton, setShowButton] = useState(null);
  const {
    project: { id: projectId },
  } = useContext(AppContext);

  const codeHead = useMemo(
    () => createCodeSnippet({ projectId, dashboardId, type: 'head' }),
    [dashboardId]
  );
  const codeBody = useMemo(
    () => createCodeSnippet({ projectId, dashboardId, type: 'body' }),
    [dashboardId]
  );

  return (
    <Container>
      {isPublic ? (
        <>
          <Subtitle>{t('dashboard_share.embed_title')}</Subtitle>
          <Text marginBottom="20px">{t('dashboard_share.embed_text')}</Text>
          <Step>{t('dashboard_share.embed_step_label')} 1</Step>
          <Text
            display="inline-block"
            marginLeft="10px"
            dangerouslySetInnerHTML={{
              __html: t('dashboard_share.embed_step_first', {
                tag: '<strong>head</strong>',
                interpolation: { escapeValue: false },
              }),
            }}
          />
          <Code
            onMouseEnter={() => setShowButton(BUTTONS.copy)}
            onMouseLeave={() => setShowButton(null)}
          >
            <SyntaxHighlighter
              language="javascript"
              style={a11y}
              wrapLongLines={true}
              customStyle={{ margin: '0', padding: '0', background: 'none' }}
            >
              {codeHead}
            </SyntaxHighlighter>
            <AnimatePresence>
              {showButton === BUTTONS.copy && (
                <ButtonContainer {...BUTTON_MOTION}>
                  <Button
                    variant="secondary"
                    style="solid"
                    onClick={() => copyToClipboard(codeHead)}
                  >
                    {t('dashboard_share.copy')}
                  </Button>
                </ButtonContainer>
              )}
            </AnimatePresence>
          </Code>
          <Step>{t('dashboard_share.embed_step_label')} 2</Step>
          <Text
            display="inline-block"
            marginLeft="10px"
            dangerouslySetInnerHTML={{
              __html: t('dashboard_share.embed_step_second', {
                tag: '<strong>body</strong>',
                interpolation: { escapeValue: false },
              }),
            }}
          />
          <Code
            onMouseEnter={() => setShowButton(BUTTONS.download)}
            onMouseLeave={() => setShowButton(null)}
          >
            <SyntaxHighlighter
              language="javascript"
              style={a11y}
              wrapLongLines={true}
              customStyle={{ margin: '0', padding: '0', background: 'none' }}
            >
              {codeBody}
            </SyntaxHighlighter>
            <AnimatePresence>
              {showButton === BUTTONS.download && (
                <ButtonContainer {...BUTTON_MOTION}>
                  <Button
                    variant="secondary"
                    style="solid"
                    onClick={() => copyToClipboard(codeBody)}
                  >
                    {t('dashboard_share.copy')}
                  </Button>
                </ButtonContainer>
              )}
            </AnimatePresence>
          </Code>
          <Navigation>
            <Text marginRight="20px">
              {t('dashboard_share.embed_full_page')}
            </Text>
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
          </Navigation>
        </>
      ) : (
        <Placeholder>{t('dashboard_share.embed_placeholder')}</Placeholder>
      )}
    </Container>
  );
};

export default EmbedCode;
