import React, { FC, useEffect, useRef, useState } from 'react';
import { Checkbox, MousePositionedTooltip } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';

import { Container, Label } from './FilterItem.styles';
import { colors } from '@keen.io/colors';

type Props = {
  /** Filter label */
  label: string;
  /** Filter identifier */
  id: string;
  /** Active state indicator */
  isActive?: boolean;
  /** Change event handler */
  onChange: (e: React.MouseEvent, isActive: boolean) => void;
};

const FilterItem: FC<Props> = ({ label, id, onChange, isActive }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [labelTruncated, setLabelTruncated] = useState(false);

  useEffect(() => {
    if (containerRef.current.offsetWidth < containerRef.current.scrollWidth) {
      setLabelTruncated(true);
    }
  }, []);

  return (
    <MousePositionedTooltip
      isActive={labelTruncated}
      renderContent={() => (
        <BodyText variant="body2" fontWeight="normal" color={colors.black[500]}>
          {label}
        </BodyText>
      )}
      tooltipTheme="light"
    >
      <Container
        onClick={(e) => {
          onChange(e, !isActive);
        }}
      >
        <Checkbox id={id} type="secondary" checked={isActive} />
        <Label>
          <BodyText variant="body2" enableTextEllipsis ref={containerRef}>
            {label}
          </BodyText>
        </Label>
      </Container>
    </MousePositionedTooltip>
  );
};

export default FilterItem;
