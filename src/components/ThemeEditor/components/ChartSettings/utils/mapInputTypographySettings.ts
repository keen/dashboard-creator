import { FontSettings } from '@keen.io/ui-core';

export const mapInputTypographySettings = ({
  fontColor,
  fontSize,
  fontWeight,
  fontStyle,
}): FontSettings => {
  return {
    color: fontColor,
    size: fontSize,
    bold: fontWeight === 'bold',
    italic: fontStyle === 'italic',
    underline: false, // ?? todo
    alignment: 'left', // ??
  };
};
