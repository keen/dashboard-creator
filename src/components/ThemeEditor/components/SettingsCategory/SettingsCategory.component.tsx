import React from 'react';
import {
  StyledSettingsCategory,
  StyledSettings,
} from './SettingsCategory.styles';

export const SettingsCategory = ({ title, children }) => {
  return (
    <StyledSettingsCategory>
      <div>{title}</div>
      <StyledSettings>{children}</StyledSettings>
    </StyledSettingsCategory>
  );
};
