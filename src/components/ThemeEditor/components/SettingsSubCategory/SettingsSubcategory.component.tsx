import React from 'react';
import {
  StyledSettingsCategory,
  TitleWrapper,
  StyledSettings,
} from './SettingsSubcategory.styles';
import { Title } from '@keen.io/ui-core';

export const SettingsSubcategory = ({ title, children }) => {
  return (
    <StyledSettingsCategory>
      <TitleWrapper>
        <Title variant="body-bold">{title}</Title>
      </TitleWrapper>
      <StyledSettings>{children}</StyledSettings>
    </StyledSettingsCategory>
  );
};
