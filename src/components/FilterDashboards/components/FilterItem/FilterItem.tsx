import React, { FC } from 'react';
import { Checkbox } from '@keen.io/ui-core';

import { Container, Label } from './FilterItem.styles';

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

const FilterItem: FC<Props> = ({ label, id, onChange, isActive }) => (
  <Container
    onClick={(e) => {
      onChange(e, !isActive);
    }}
  >
    <Checkbox id={id} type="secondary" checked={isActive} />
    <Label>{label}</Label>
  </Container>
);

export default FilterItem;
