import React, { FC, useMemo, useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { getVisualizationIcon } from '@keen.io/widget-picker';
import { Tooltip } from '@keen.io/ui-core';

import Tags from '../../../Tags';
import { TOOLTIP_DELAY, SAVED_QUERY_SIZE } from './constants';

import {
  Container,
  Name,
  TagsContainer,
  TooltipContainer,
} from './QueryItem.styles';

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

  const visualizationIcon = useMemo(
    () => getVisualizationIcon(visualization),
    []
  );

  const [isOverflow, setIsOverflow] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (nameRef.current) {
      setIsOverflow(
        nameRef.current.getBoundingClientRect().width > SAVED_QUERY_SIZE
      );
    }
  }, [nameRef]);

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
            setTooltipVisible(true);
          }, TOOLTIP_DELAY);
        }}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {name}
      </Name>
      <TagsContainer>
        <Tags
          tags={tags}
          extraTag={
            cached &&
            `${t('query_picker.cached_label')}(${cached}${t(
              'query_picker.cached_units'
            )})`
          }
        />
      </TagsContainer>
      {isOverflow && tooltipVisible && (
        <TooltipContainer>
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
      )}
    </Container>
  );
};

export default QueryItem;
