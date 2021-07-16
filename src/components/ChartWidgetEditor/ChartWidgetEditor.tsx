import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from '@keen.io/ui-core';

import { Container } from './ChartWidgetEditor.styles';

import { ChartEditor } from './components';
import { chartEditorActions } from '../../modules/chartEditor';

type Props = {
  /** Chart editor open indicator */
  isOpen: boolean;
};

const ChartWidgetEditor: FC<Props> = ({ isOpen }) => {
  const dispatch = useDispatch();

  return (
    <Modal
      isOpen={isOpen}
      closeOnFadeMaskClick={false}
      onClose={() => dispatch(chartEditorActions.closeEditor())}
    >
      {(_, closeHandler) => (
        <Container>
          <ChartEditor onClose={closeHandler} />
        </Container>
      )}
    </Modal>
  );
};

export default ChartWidgetEditor;
