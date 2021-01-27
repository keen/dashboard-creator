import React, { FC } from 'react';
import { DraftInlineStyleType, EditorState } from 'draft-js';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import {
  PickerContainer,
  Container,
  Separator,
  TextOption,
} from './Toolbar.styles';
import ColorPicker from '../ColorPicker';
import TextAlignment from '../TextAlignment';
import FontSize from '../FontSize';

import { styles } from '../../../TextEditor';
import { getBlockFontSize } from '../../utils';
import { TextAlignment as TextAlignmentType } from '../../../../modules/textEditor';

import { INLINE_OPTIONS } from '../../constants';

type Props = {
  /** Current editor state */
  editorState: EditorState;
  /** Current text alignment */
  textAlignment: TextAlignmentType;
  /** Font size update event handler */
  onUpdateFontSize: (fontSize: string) => void;
  /** Update color event handler */
  onUpdateColor: (color: string) => void;
  /** Update text alignment event handler */
  onUpdateTextAlignment: (alignment: TextAlignmentType) => void;
  /** Update inline style attribute event handler */
  onUpdateInlineStyleAttribute: (inlineStyleType: DraftInlineStyleType) => void;
};

const Toolbar: FC<Props> = ({
  editorState,
  textAlignment,
  onUpdateFontSize,
  onUpdateColor,
  onUpdateTextAlignment,
  onUpdateInlineStyleAttribute,
}) => {
  const currentInlineStyle = editorState.getCurrentInlineStyle();

  return (
    <Container onMouseDown={(e) => e.preventDefault()}>
      <FontSize
        currentFontSize={getBlockFontSize(currentInlineStyle)}
        onUpdateFontSize={onUpdateFontSize}
      />
      <PickerContainer>
        <ColorPicker
          currentColor={styles.color.current(editorState)}
          onSelectColor={onUpdateColor}
        />
      </PickerContainer>
      {INLINE_OPTIONS.map(({ id, icon, inlineStyleType }) => (
        <TextOption
          key={id}
          isActive={currentInlineStyle.has(inlineStyleType)}
          onClick={() => onUpdateInlineStyleAttribute(inlineStyleType)}
        >
          <Icon type={icon} width={15} height={15} fill={colors.black[100]} />
        </TextOption>
      ))}
      <Separator />
      <TextAlignment
        currentAlignment={textAlignment}
        onUpdateTextAlignment={onUpdateTextAlignment}
      />
    </Container>
  );
};
export default Toolbar;
