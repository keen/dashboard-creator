import React, { FC } from 'react';
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
      {icon && (
        <IconWrapper>
          <Icon type={icon} fill={colors.black[100]} />
        </IconWrapper>
      )}
      <TextWrapper>{text}</TextWrapper>
    </Container>
  );
};

export default WidgetItem;
