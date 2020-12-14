import React, { FC } from 'react';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { Container } from './ChartPlaceholder.styles';

type Props = {
  width?: number;
  height?: number;
  isGhostImage?: boolean;
};

const ICON_FACTOR = 0.3;

const ChartPlaceholder: FC<Props> = ({
  width = 100,
  height = 100,
  isGhostImage = false,
}) => (
  <Container
    width={width}
    height={height}
    isGhostImage={isGhostImage}
    data-testid="chart-placeholder"
  >
    <Icon
      type="bar-widget-vertical"
      width={Math.floor(ICON_FACTOR * width)}
      height={Math.floor(ICON_FACTOR * height)}
      opacity={0.2}
      fill={colors.blue[500]}
    />
  </Container>
);

export default ChartPlaceholder;
