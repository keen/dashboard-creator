import { FontSettings, TextAlignment } from '@keen.io/ui-core';

export const mapInputTypographySettings = ({
  fontColor,
  fontSize,
  fontWeight,
  fontStyle,
  underline = false,
  textAlignment = 'left',
}): FontSettings => {
  return {
    color: fontColor,
    size: fontSize,
    bold: fontWeight === 'bold',
    italic: fontStyle === 'italic',
    underline,
    alignment: textAlignment as TextAlignment,
  };
};
