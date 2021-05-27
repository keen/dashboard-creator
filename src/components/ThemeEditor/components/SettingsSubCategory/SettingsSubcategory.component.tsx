import React from 'react';
import {
  StyledSettingsCategory,
  StyledTitle,
  StyledSettings,
} from './SettingsSubcategory.styles';

export const SettingsSubcategory = ({ title, children }) => {
  return (
    <StyledSettingsCategory>
      <StyledTitle>{title}</StyledTitle>
      <StyledSettings>{children}</StyledSettings>
    </StyledSettingsCategory>
  );
};
