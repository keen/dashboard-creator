export const mapInputTypographySettings = ({
  fontColor,
  fontSize,
  fontWeight,
  fontStyle,
}) => {
  return {
    color: fontColor,
    size: fontSize,
    bold: fontWeight === 'bold',
    italic: fontStyle === 'italic',
    underline: false, // ?? todo
    alignment: 'left', // ??
  };
};
