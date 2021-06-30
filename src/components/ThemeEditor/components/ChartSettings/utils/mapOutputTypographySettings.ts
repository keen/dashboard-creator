export const mapOutputTypographySettings = ({ color, size, bold, italic }) => {
  return {
    fontColor: color,
    fontSize: size,
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
  };
};
