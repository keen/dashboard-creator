import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { transparentize } from 'polished';
import { Timeframe as TimeframeType } from '@keen.io/query';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import RelativeTimeLabel from '../RelativeTimeLabel';
import {
  Container,
  Timeframe,
  TimeframeWrapper,
  Separator,
  IconContainer,
} from './TimeframeLabel.styles';

import { TIMEFRAME_FORMAT } from '../../constants';

type Props = {
  /** Timeframe */
  timeframe: TimeframeType;
  /** Remove handler */
  onRemove: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const TimeframeLabel: FC<Props> = ({ timeframe, onRemove }) => {
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
        <Icon
          type="date-picker"
          fill={transparentize(0.5, colors.black[100])}
          width={15}
          height={15}
        />
        <Timeframe>
          {moment(timeframe.start).format(TIMEFRAME_FORMAT)}
        </Timeframe>
        <Separator>{t('dashboard_timepicker.separator')}</Separator>
        <Timeframe>{moment(timeframe.end).format(TIMEFRAME_FORMAT)}</Timeframe>
      </TimeframeWrapper>
      <IconContainer onClick={onRemove} data-testid="remove-handler">
        <Icon type="close" width={10} height={10} fill={colors.red[200]} />
      </IconContainer>
    </Container>
  );
};

export default TimeframeLabel;
