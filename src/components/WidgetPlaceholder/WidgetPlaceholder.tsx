import React, { FC } from 'react';
import { Icon, IconType } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { Container } from './WidgetPlaceholder.styles';

type Props = {
  iconType?: IconType;
  width?: number;
  height?: number;
  backgroundColor?: string;
};

const ICON_FACTOR = 0.3;

const WidgetPlaceholder: FC<Props> = ({
  iconType,
  width = 100,
  height = 100,
  backgroundColor,
}) => (
  <Container
    width={width}
    height={height}
    data-testid="widget-placeholder"
    backgroundColor={backgroundColor}
  >
    <Icon
      type={iconType}
      width={Math.floor(ICON_FACTOR * width)}
      height={Math.floor(ICON_FACTOR * height)}
      opacity={0.2}
      fill={colors.blue[500]}
    />
  </Container>
);

export default WidgetPlaceholder;
