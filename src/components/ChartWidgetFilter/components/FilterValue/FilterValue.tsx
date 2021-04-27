import React, { FC } from 'react';
import { BodyText } from '@keen.io/typography';

import { Container, OptionContainer } from './FilterValue.styles';

type Props = {
  /** Property value*/
  propertyValue: string | string[];
};

const FilterValue: FC<Props> = ({ propertyValue }) => {
  if (Array.isArray(propertyValue)) {
    return (
      <Container>
        {propertyValue.map((value, index, arr) => (
          <OptionContainer key={value}>
            <BodyText variant="body2" enableTextEllipsis>
              {value}
              {index < arr.length - 1 && <span>,&nbsp;</span>}
            </BodyText>
          </OptionContainer>
        ))}
      </Container>
    );
  }

  return (
    <BodyText variant="body2" enableTextEllipsis>
      {propertyValue}
    </BodyText>
  );
};

export default FilterValue;
