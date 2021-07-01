<<<<<<< HEAD
import { FontSettings, Typography } from '@keen.io/ui-core';
=======
import { FontSettings } from '@keen.io/ui-core';
>>>>>>> 4948e35... chore: 🤖 unit tests for charts

export const mapOutputTypographySettings = ({
  color,
  size,
  bold,
  italic,
<<<<<<< HEAD
}: FontSettings): Typography => {
=======
}: FontSettings) => {
>>>>>>> 4948e35... chore: 🤖 unit tests for charts
  return {
    fontColor: color,
    fontSize: size,
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
  };
};
