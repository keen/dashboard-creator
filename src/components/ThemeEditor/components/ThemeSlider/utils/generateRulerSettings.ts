import { Interval } from '@keen.io/ui-core';

export const generateRulerSettings = ({ maximum, minimum, step }: Interval) => {
  const middlePoints = [];
  const numberOfSteps = Math.floor((maximum - minimum) / step);

  if (numberOfSteps >= 1) {
    for (let i = 1; i < numberOfSteps; i++) {
      middlePoints.push({
        label: `${minimum + i * step}`,
        position: `${(100 * (minimum + i * step)) / maximum}%`,
      });
    }
  }

  return [
    {
      label: minimum,
      position: '0%',
    },
    ...middlePoints,
    {
      label: maximum,
      position: '100%',
    },
  ];
};
