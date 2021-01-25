import React, { FC } from 'react';
import { transparentize } from 'polished';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { Header, CaretDown } from './TextAlignment.styles';

import AttributeDropdown from '../AttributeDropdown';
import Option from '../Option';

import { ICON, OPTIONS } from './constants';

type Props = {
  /** Current font size */
  currentAlignment: 'left' | 'center' | 'right';
  /** Update font size event handler */
  onUpdateTextAlignment: (fontSize: string) => void;
};

const TextAlignment: FC<Props> = ({
  currentAlignment,
  onUpdateTextAlignment,
}) => (
  <AttributeDropdown
    renderHeader={() => (
      <Header data-testid="text-alignment-header">
        <Icon
          type={ICON[currentAlignment]}
          fill={colors.black[100]}
          width={13}
          height={13}
        />
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
    {OPTIONS.map(({ id, icon, style }) => (
      <Option
        key={id}
        data-testid={`option-${style}`}
        onClick={() => onUpdateTextAlignment(style)}
        isActive={currentAlignment === style}
      >
        <Icon type={icon} fill={colors.black[100]} width={13} height={13} />
      </Option>
    ))}
  </AttributeDropdown>
);

export default TextAlignment;
