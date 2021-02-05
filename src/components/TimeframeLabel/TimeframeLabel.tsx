import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import {
  Container,
  Filter,
  Separator,
  Date,
  IconContainer,
} from './TimeframeLabel.styles';

type Props = {
  start: string;
  end: string;
  onRemove: () => void;
};

const TimeframeLabel: FC<Props> = ({ start, end, onRemove }) => {
  const { t } = useTranslation();
  return (
    <Container>
      <Filter>
        <Date>{start}</Date>
        <Separator>{t('dashboard_timepicker.separator')}</Separator>
        <Date>{end}</Date>
      </Filter>
      <IconContainer onClick={onRemove}>
        <Icon type="close" fill={colors.red[200]} width={9} height={9} />
      </IconContainer>
    </Container>
  );
};

export default TimeframeLabel;
