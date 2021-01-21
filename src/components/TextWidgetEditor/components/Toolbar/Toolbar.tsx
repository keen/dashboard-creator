import React, { FC } from 'react';
import { DraftInlineStyle, DraftInlineStyleType } from 'draft-js';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { Container, TextOption } from './Toolbar.styles';
import ColorPicker from '../ColorPicker';
import FontSize from '../FontSize';

import { getBlockFontSize } from '../../utils';

import { INLINE_OPTIONS } from '../../constants';

type Props = {
  /** Current inline styles */
  currentInlineStyle: DraftInlineStyle;
  /** Font size update event handler */
  onUpdateFontSize: (fontSize: string) => void;
  /** Update color event handler */
  onUpdateColor: (color: string) => void;
  /** Update inline style attribute event handler */
  onUpdateInlineStyleAttribute: (inlineStyleType: DraftInlineStyleType) => void;
};

/*           {currentInlineStyle.has(inlineStyleType) && 'active'} */

const Toolbar: FC<Props> = ({
  currentInlineStyle,
  onUpdateFontSize,
  onUpdateColor,
  onUpdateInlineStyleAttribute,
}) => {
  return (
    <Container>
      <div onClick={() => onUpdateColor('red')}>RED</div>
      {INLINE_OPTIONS.map(({ id, icon, inlineStyleType }) => (
        <TextOption
          key={id}
          isActive={currentInlineStyle.has(inlineStyleType)}
          onClick={() => onUpdateInlineStyleAttribute(inlineStyleType)}
        >
          <Icon type={icon} width={15} height={15} fill={colors.black[100]} />
        </TextOption>
      ))}
      <FontSize
        currentFontSize={getBlockFontSize(currentInlineStyle)}
        onUpdateFontSize={onUpdateFontSize}
      />
      <ColorPicker />
    </Container>
  );
};
export default Toolbar;
