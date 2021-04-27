import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@keen.io/time-utils';
import { Timeframe } from '@keen.io/query';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import TitleContainer from '../TitleContainer';
import { TimeframeWrapper } from './DatePickerContent.styles';

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
      <TitleContainer>
        <BodyText variant="body2" fontWeight="bold" color={colors.black[100]}>
          {t('dashboard_timepicker.timeframe_modified')}
        </BodyText>
      </TitleContainer>
      {typeof timeframe === 'string' ? (
        <BodyText variant="body2" enableTextEllipsis>
          {getCustomTimeframe(
            timeframe,
            t('query_creator_relative_time_label.label')
          )}
        </BodyText>
      ) : (
        <TimeframeWrapper>
          <BodyText variant="body2" lineHeight={1} enableTextEllipsis>
            {formatDate(timeframe.start, timezone, TIMEFRAME_FORMAT)}
          </BodyText>
          <BodyText variant="body2" fontWeight="bold" lineHeight={1}>
            {t('dashboard_timepicker.separator')}
          </BodyText>
          <BodyText variant="body2" lineHeight={1} enableTextEllipsis>
            {formatDate(timeframe.end, timezone, TIMEFRAME_FORMAT)}
          </BodyText>
        </TimeframeWrapper>
      )}
    </>
  );
};

export default DatePickerContent;
