import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Container, IncludesToday } from './RelativeTimeLabel.styles';

import { getCustomTimeframe } from '../../utils';
import { getInterval } from '../DatePickerWidget/utils/getInterval'; // keen/packages/ui-core/src/components/relative-time/utils/getInterval.ts
import { convertRelativeTime } from '../DatePickerWidget/utils';

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
