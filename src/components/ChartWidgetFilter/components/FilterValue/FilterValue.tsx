import React, { FC } from 'react';

import Option from '../Option';

type Props = {
  /** Property value*/
  propertyValue: string | string[];
};

const FilterValue: FC<Props> = ({ propertyValue }) => {
  if (Array.isArray(propertyValue)) {
    return (
      <>
        {propertyValue.map((value) => (
          <Option key={value}>{value}</Option>
        ))}
      </>
    );
  }

  return <Option>{propertyValue}</Option>;
};

export default FilterValue;
