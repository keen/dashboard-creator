import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { transparentize } from 'polished';
import { getInterval, convertRelativeTime } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import {
  Container,
  IncludesToday,
  IconContainer,
} from './RelativeTimeLabel.styles';

import { getCustomTimeframe } from '../../utils';

type Props = {
  /** Relative timeframe */
  timeframe: string;
  /** Icon identifier */
  showIcon?: boolean;
};

const RelativeTimeLabel: FC<Props> = ({ timeframe, showIcon }) => {
  const { t } = useTranslation();
  const { relativity, units } = convertRelativeTime(timeframe);
  const interval = getInterval(units);
  return (
    <Container>
      {showIcon && (
        <IconContainer data-testid="relative-time-icon">
          <Icon
            type="date-picker"
            fill={transparentize(0.5, colors.black[100])}
            width={15}
            height={15}
          />
        </IconContainer>
      )}
      <span>
        {getCustomTimeframe(timeframe, t('relative_time_label.label'))}
      </span>{' '}
      {relativity === 'this' && (
        <IncludesToday>
          {interval === 'day'
            ? t('relative_time_label.today_includes')
            : `(${t('relative_time_label.relativity_title')} ${interval})`}
        </IncludesToday>
      )}
    </Container>
  );
};

export default RelativeTimeLabel;
