import { FontSettings, Typography } from '@keen.io/ui-core';

export const mapOutputTypographySettings = ({
  color,
  size,
  bold,
  italic,
}: FontSettings): Typography => {
  return {
    fontColor: color,
    fontSize: size,
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
  };
};
