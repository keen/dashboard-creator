import { FONTS } from '../constants';

export const getFontFallback = (font: string) => {
  const option = FONTS.find((f) => font === f.name);
  let fallback = 'Arial, Helvetica, sans-serif';
  if (option && option.variant === 'serif')
    fallback = 'Times, "Times New Roman", serif';
  return `${font}, ${fallback}`;
};
