import React, {
  FC,
  useMemo,
  useState,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { copyToClipboard } from '@keen.io/charts-utils';
import xml from 'react-syntax-highlighter/dist/cjs/languages/hljs/xml';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import a11y from 'react-syntax-highlighter/dist/cjs/styles/hljs/a11y-light';

import { Button, Tooltip, UI_LAYERS } from '@keen.io/ui-core';
import {
  Placeholder,
  Navigation,
  Container,
  Subtitle,
  StyledText,
  Step,
  Code,
  ButtonContainer,
  TooltipText,
} from './EmbedCode.styles';

import {
  exportDashboardToHtml,
  createCodeSnippet,
} from '../../../../modules/dashboards';

import { AppContext } from '../../../../contexts';
import { TOOLTIP_MOTION as MOTION } from '../../../../constants';
import { TOOLTIP_HIDE } from './constants';

SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('javascript', js);

type Props = {
  dashboardId: string;
  isPublic?: boolean;
};

type Buttons = 'download' | 'copy';

const EmbedCode: FC<Props> = ({ dashboardId, isPublic }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [showButton, setShowButton] = useState<Buttons>(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const tooltipHide = useRef(null);
  const containerRef = useRef(null);

  const {
    project: { id: projectId, masterKey },
  } = useContext(AppContext);

  const codeHead = useMemo(
    () =>
      createCodeSnippet({ projectId, masterKey, dashboardId, type: 'head' }),
    [dashboardId]
  );
  const codeBody = useMemo(
    () =>
      createCodeSnippet({ projectId, masterKey, dashboardId, type: 'body' }),
    [dashboardId]
  );

  const clickHandler = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, value: string) => {
      if (tooltipHide.current) clearTimeout(tooltipHide.current);
      copyToClipboard(value);

      const {
        top,
        left,
        height,
      }: ClientRect = containerRef.current.getBoundingClientRect();

      const tooltipX = e.pageX - left - window.scrollX;
      const tooltipY = e.pageY - top - height - window.scrollY;

      setTooltip((state) => ({
        ...state,
        visible: true,
        x: tooltipX,
        y: tooltipY,
      }));

      tooltipHide.current = setTimeout(() => {
        setTooltip((state) => ({
          ...state,
          visible: false,
          x: 0,
          y: 0,
        }));
      }, TOOLTIP_HIDE);
    },
    []
  );

  return (
    <Container>
      {isPublic ? (
        <div ref={containerRef}>
          <Subtitle>{t('dashboard_share.embed_title')}</Subtitle>
          <StyledText marginBottom="20px">
            {t('dashboard_share.embed_text')}
          </StyledText>
          <Step>{t('dashboard_share.embed_step_label')} 1</Step>
          <StyledText
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
            onMouseEnter={() => setShowButton('copy')}
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
              {showButton === 'copy' && (
                <ButtonContainer {...MOTION}>
                  <Button
                    variant="secondary"
                    style="solid"
                    onClick={(e: React.MouseEvent) => clickHandler(e, codeHead)}
                  >
                    {t('dashboard_share.copy')}
                  </Button>
                </ButtonContainer>
              )}
            </AnimatePresence>
          </Code>
          <Step>{t('dashboard_share.embed_step_label')} 2</Step>
          <StyledText
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
            onMouseEnter={() => setShowButton('download')}
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
              {showButton === 'download' && (
                <ButtonContainer {...MOTION}>
                  <Button
                    variant="secondary"
                    style="solid"
                    onClick={(e: React.MouseEvent) => clickHandler(e, codeBody)}
                  >
                    {t('dashboard_share.copy')}
                  </Button>
                </ButtonContainer>
              )}
            </AnimatePresence>
          </Code>
          <Navigation>
            <StyledText marginRight="20px">
              {t('dashboard_share.embed_full_page')}
            </StyledText>
            <Button
              variant="secondary"
              style="outline"
              onClick={() => dispatch(exportDashboardToHtml(dashboardId))}
            >
              {t('dashboard_share.download_code')}
            </Button>
          </Navigation>
          <AnimatePresence>
            {tooltip.visible && (
              <motion.div
                {...MOTION}
                initial={{ opacity: 0, x: tooltip.x, y: tooltip.y }}
                animate={{
                  x: tooltip.x,
                  y: tooltip.y,
                  opacity: 1,
                }}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  zIndex: UI_LAYERS.dropdown,
                }}
              >
                <Tooltip mode="dark" hasArrow={false}>
                  <TooltipText>{t('dashboard_share.copied')}</TooltipText>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Placeholder>{t('dashboard_share.embed_placeholder')}</Placeholder>
      )}
    </Container>
  );
};

export default EmbedCode;
