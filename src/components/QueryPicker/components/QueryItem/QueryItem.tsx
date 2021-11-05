import React, { FC, useMemo, useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { getVisualizationIcon } from '@keen.io/widget-picker';
import { Tooltip, DynamicPortal } from '@keen.io/ui-core';
import { useDynamicContentPosition } from '@keen.io/react-hooks';

import Tags from '../../../Tags';
import { TOOLTIP_DELAY, SAVED_QUERY_NAME_SIZE } from './constants';

import {
  Container,
  Name,
  TagsContainer,
  TooltipContainer,
} from './QueryItem.styles';

import { Variant } from '../../../../types';

import { QueryVisualization } from '../../../../modules/queries';

type Props = {
  /** Query name */
  name: string;
  /** Visualization settings */
  visualization: QueryVisualization;
  /** Query tags */
  tags?: string[];
  /** Cached tag */
  cached?: number;
  /** Click event handler */
  onClick: () => void;
};

const QueryItem: FC<Props> = ({
  name,
  visualization,
  tags,
  cached,
  onClick,
}) => {
  const { t } = useTranslation();

  const nameRef = useRef(null);
  const requestFrameRef = useRef(null);

  const visualizationIcon = useMemo(
    () => getVisualizationIcon(visualization),
    []
  );

  const [isOverflow, setIsOverflow] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (nameRef.current) {
      setIsOverflow(
        nameRef.current.getBoundingClientRect().width > SAVED_QUERY_NAME_SIZE
      );
    }
  }, [nameRef]);

  const { setPosition, contentPosition } = useDynamicContentPosition(nameRef);

  const isCached = cached
    ? [
        {
          label: `${t('query_picker.cached_label')}(${cached}${t(
            'query_picker.cached_units'
          )})`,
          variant: Variant.green,
        },
      ]
    : [];

  const tagsLabels =
    tags?.length > 0
      ? tags.map((label) => ({
          label,
          variant: Variant.purple,
        }))
      : [];

  return (
    <Container onClick={onClick} data-testid="query-item">
      <Icon
        type={visualizationIcon}
        width={16}
        height={16}
        fill={colors.blue[500]}
      />
      <Name
        ref={nameRef}
        isOverflow={isOverflow}
        onMouseEnter={() => {
          setTimeout(() => {
            setPosition();
            setTooltipVisible(true);
          }, TOOLTIP_DELAY);
        }}
        onMouseLeave={() => setTooltipVisible(false)}
        onWheel={() => {
          if (requestFrameRef.current)
            cancelAnimationFrame(requestFrameRef.current);
          requestFrameRef.current = requestAnimationFrame(() => {
            setTooltipVisible(false);
          });
        }}
      >
        {name}
      </Name>
      <TagsContainer>
        <Tags tags={[...isCached, ...tagsLabels]} />
      </TagsContainer>
      {isOverflow && tooltipVisible && (
        <DynamicPortal>
          <TooltipContainer x={contentPosition.x} y={contentPosition.y}>
            <AnimatePresence>
              {tooltipVisible && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                >
                  <Tooltip mode="light" arrowDirection="bottom">
                    {name}
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </TooltipContainer>
        </DynamicPortal>
      )}
    </Container>
  );
};

export default QueryItem;
