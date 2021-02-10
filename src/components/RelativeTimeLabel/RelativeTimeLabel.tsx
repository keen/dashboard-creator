import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { getInterval, convertRelativeTime } from '@keen.io/ui-core';

import { Container, IncludesToday } from './RelativeTimeLabel.styles';

import { getCustomTimeframe } from '../../utils';

type Props = {
  /** Relative timeframe */
  timeframe: string;
};

const RelativeTimeLabel: FC<Props> = ({ timeframe }) => {
  const { t } = useTranslation();
  const { relativity, units } = convertRelativeTime(timeframe);
  const interval = getInterval(units);
  return (
    <Container>
      <span>
        {getCustomTimeframe(
          timeframe,
          t('query_creator_relative_time_label.label')
        )}
      </span>{' '}
      {relativity === 'this' && (
        <IncludesToday>
          {interval === 'day'
            ? t('query_creator_relative_time_label.today_includes')
            : `(${t(
                'query_creator_relative_time_label.relativity_title'
              )} ${interval})`}
        </IncludesToday>
      )}
    </Container>
  );
};

export default RelativeTimeLabel;
