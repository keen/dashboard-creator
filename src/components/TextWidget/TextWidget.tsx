import React, { FC, useMemo } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { useSelector } from 'react-redux';

import { Container, Html } from './TextWidget.styles';
import { exporter } from '../TextEditor';

import {
  TextWidget as TextWidgetType,
  widgetsSelectors,
} from '../../modules/widgets';

import { RootState } from '../../rootReducer';

type Props = {
  /** Widget identifier */
  id: string;
};

const TextWidget: FC<Props> = ({ id }) => {
  const { widget } = useSelector((state: RootState) =>
    widgetsSelectors.getWidget(state, id)
  );

  const {
    settings: { content, textAlignment },
  } = widget as TextWidgetType;

  const htmlContent = useMemo(() => {
    const editorContent = convertFromRaw(content);
    const editorState = EditorState.createWithContent(editorContent);

    const inlineStyles = exporter(editorState);

    return stateToHTML(editorContent, { inlineStyles });
  }, []);

  return (
    <Container>
      <Html
        textAlignment={textAlignment}
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
    </Container>
  );
};

export default TextWidget;
