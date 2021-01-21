import React, { FC } from 'react';
import { transparentize } from 'polished';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { Header, CaretDown } from './TextAlignment.styles';

import AttributeDropdown from '../AttributeDropdown';

import { OPTIONS } from './constants';

type Props = {
  /** Current font size */
  currentAlignment: string;
  /** Update font size event handler */
  onUpdateTextAlignment: (fontSize: string) => void;
};

const TextAlignment: FC<Props> = ({
  currentAlignment,
  onUpdateTextAlignment,
}) => (
  <AttributeDropdown
    renderHeader={() => (
      <Header>
        {currentAlignment}
        <CaretDown>
          <Icon
            type="caret-down"
            width={10}
            height={10}
            fill={transparentize(0.3, colors.blue[500])}
          />
        </CaretDown>
      </Header>
    )}
  >
    {OPTIONS.map(({ id, style }) => (
      <div key={id} onClick={() => onUpdateTextAlignment(style)}>
        {style}
      </div>
    ))}
  </AttributeDropdown>
);

export default TextAlignment;
