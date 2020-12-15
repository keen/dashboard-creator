import React, { FC } from 'react';
import { transparentize } from 'polished';
import { Icon, IconType } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { Container, IconWrapper, TextWrapper } from './WidgetItem.styles';

type Props = {
  icon?: IconType;
  text: string;
};

const WidgetItem: FC<Props> = ({ icon, text }) => {
  return (
    <Container>
      <IconWrapper>
        {icon && (
          <Icon type={icon} fill={transparentize(0.5, colors.black[100])} />
        )}
      </IconWrapper>
      <TextWrapper>{text}</TextWrapper>
    </Container>
  );
};

export default WidgetItem;
