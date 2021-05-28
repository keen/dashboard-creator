import React, { FC, useState } from 'react';
import { BodyText } from '@keen.io/typography';
import {
  IntervalSlider,
  Ruler,
  calculateIntervalValue,
  getIndex,
  Interval,
} from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

import { LabelWrapper, Container } from './ThemeSlider.styles';
import { DIMENSION } from './constants';

type Props = {
  /** Collection of intervals */
  intervals: Interval[];
  /** Collection of ruler ticks */
  ticks: { label: string | number; position: string }[];
  /** Initial value */
  initialValue?: number;
  /** Slider value change handler */
  onChange?: (value: number) => void;
};

const ThemeSlider: FC<Props> = ({ intervals, ticks, initialValue = 0 }) => {
  const [intervalOffset, setIntervalOffset] = useState(initialValue);
  const onRulerClick = (position: string) => {
    const controlPosition = Math.round(
      (parseFloat(position) / 100) * DIMENSION
    );
    const stepDimension = DIMENSION / intervals.length;
    const index = getIndex(controlPosition, stepDimension);
    const value = calculateIntervalValue({
      controlPosition,
      interval: intervals[index],
      currentIndex: index,
      stepDimension,
    });

    setIntervalOffset(value);
  };

  return (
    <Container>
      <IntervalSlider
        railSettings={{ size: 4, borderRadius: 3 }}
        colorSteps={0}
        colors={[colors.gray[400]]}
        intervals={intervals}
        initialValue={intervalOffset}
        controlSettings={{
          size: 18,
          backgroundColor: colors.white[500],
          borderColor: colors.green[500],
        }}
        onChange={(offset: number) => setIntervalOffset(offset)}
      />
      <Ruler
        layout="horizontal"
        ticks={ticks}
        onClick={onRulerClick}
        renderLabel={(label) => (
          <LabelWrapper>
            <BodyText
              variant="body3"
              fontWeight={label == intervalOffset ? 'bold' : 'normal'}
            >
              {label}
            </BodyText>
          </LabelWrapper>
        )}
      />
    </Container>
  );
};
export default ThemeSlider;
