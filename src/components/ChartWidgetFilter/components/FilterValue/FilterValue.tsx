import React, { FC } from 'react';

import Option from '../Option';
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
            <Option key={value}>{value}</Option>
            {index < arr.length - 1 && <span>,&nbsp;</span>}
          </OptionContainer>
        ))}
      </Container>
    );
  }

  return <Option>{propertyValue}</Option>;
};

export default FilterValue;
