import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { transparentize } from 'polished';
import { BodyText } from '@keen.io/typography';
import { Timeframe as TimeframeItem } from '@keen.io/query';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { formatDate } from '@keen.io/time-utils';

import RelativeTimeLabel from '../RelativeTimeLabel';
import {
  Container,
  TimeframeWrapper,
  Separator,
  IconContainer,
  CalendarIconContainer,
} from './TimeframeLabel.styles';

import { TIMEFRAME_FORMAT } from '../../constants';

type Props = {
  /** Timeframe */
  timeframe: TimeframeItem;
  /** Timezone */
  timezone: string;
  /** Remove handler */
  onRemove: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const TimeframeLabel: FC<Props> = ({ timeframe, timezone, onRemove }) => {
  const { t } = useTranslation();

  return typeof timeframe === 'string' ? (
    <Container>
      <TimeframeWrapper>
        <RelativeTimeLabel timeframe={timeframe} showIcon />
      </TimeframeWrapper>
      <IconContainer onClick={onRemove} data-testid="remove-handler">
        <Icon type="close" width={10} height={10} fill={colors.red[200]} />
      </IconContainer>
    </Container>
  ) : (
    <Container>
      <TimeframeWrapper>
        <CalendarIconContainer>
          <Icon
            type="date-picker"
            fill={transparentize(0.6, colors.blue[500])}
            width={13}
            height={13}
          />
        </CalendarIconContainer>
        <BodyText
          variant="body2"
          color={colors.blue[500]}
          fontWeight="normal"
          enableTextEllipsis
        >
          {formatDate(timeframe.start, timezone, TIMEFRAME_FORMAT)}
        </BodyText>
        <Separator>
          <BodyText
            variant="body3"
            color={colors.blue[100]}
            fontWeight="normal"
          >
            {t('dashboard_timepicker.separator')}
          </BodyText>
        </Separator>
        <BodyText
          variant="body2"
          color={colors.blue[500]}
          fontWeight="normal"
          enableTextEllipsis
        >
          {formatDate(timeframe.end, timezone, TIMEFRAME_FORMAT)}
        </BodyText>
      </TimeframeWrapper>
      <IconContainer onClick={onRemove} data-testid="remove-handler">
        <Icon type="close" width={10} height={10} fill={colors.red[200]} />
      </IconContainer>
    </Container>
  );
};

export default TimeframeLabel;
