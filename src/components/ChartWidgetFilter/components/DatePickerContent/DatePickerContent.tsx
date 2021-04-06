import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@keen.io/time-utils';
import { Timeframe } from '@keen.io/query';

import Option from '../Option';
import Title from '../Title';
import { TimeframeWrapper, Separator } from './DatePickerContent.styles';

import { getCustomTimeframe } from '../../../../utils';
import { TIMEFRAME_FORMAT } from '../../../../constants';

type Props = {
  /** Timeframe */
  timeframe: Timeframe;
  /** Timezone */
  timezone: string;
};
const DatePickerContent: FC<Props> = ({ timeframe, timezone }) => {
  const { t } = useTranslation();
  return (
    <>
      <Title marginBottom={10}>
        {t('dashboard_timepicker.timeframe_modified')}
      </Title>
      {typeof timeframe === 'string' ? (
        <Option>
          {getCustomTimeframe(
            timeframe,
            t('query_creator_relative_time_label.label')
          )}
        </Option>
      ) : (
        <TimeframeWrapper>
          <Option>
            {formatDate(timeframe.start, timezone, TIMEFRAME_FORMAT)}
          </Option>
          <Separator>{t('dashboard_timepicker.separator')}</Separator>
          <Option>
            {formatDate(timeframe.end, timezone, TIMEFRAME_FORMAT)}
          </Option>
        </TimeframeWrapper>
      )}
    </>
  );
};

export default DatePickerContent;
