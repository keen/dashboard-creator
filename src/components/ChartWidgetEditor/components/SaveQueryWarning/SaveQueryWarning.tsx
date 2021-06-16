import React, { FC, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';
import { BodyText } from '@keen.io/typography';
import { Tooltip } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import {
  Container,
  TooltipContainer,
  TooltipContent,
  EditTooltip,
} from './SaveQueryWarning.styles';

import { TOOLTIP_MOTION } from '../../../../constants';

const SaveQueryWarning: FC = () => {
  const { t } = useTranslation();
  const [tooltipVisible, setTooltip] = useState(false);

  return (
    <Container>
      <BodyText variant="body2" color={transparentize(0.5, colors.black[100])}>
        {t('chart_widget_editor.save_query_edit')}
      </BodyText>
      <EditTooltip
        data-testid="edit-tooltip-icon"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      >
        <Icon
          type="info"
          width={15}
          height={15}
          fill={transparentize(0.5, colors.black[100])}
        />
        <AnimatePresence>
          {tooltipVisible && (
            <TooltipContainer {...TOOLTIP_MOTION}>
              <Tooltip mode="light" hasArrow={false}>
                <TooltipContent>
                  <BodyText variant="body2">
                    {t('chart_widget_editor.save_query_edit_tooltip')}
                  </BodyText>
                </TooltipContent>
              </Tooltip>
            </TooltipContainer>
          )}
        </AnimatePresence>
      </EditTooltip>
    </Container>
  );
};

export default SaveQueryWarning;
