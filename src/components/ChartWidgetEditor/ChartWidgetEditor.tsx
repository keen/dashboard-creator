import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Modal } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

import { Container, LoaderContainer } from './ChartWidgetEditor.styles';

import { ChartEditor } from './components';
import {
  chartEditorActions,
  chartEditorSelectors,
} from '../../modules/chartEditor';

type Props = {
  /** Chart editor open indicator */
  isOpen: boolean;
};

const ChartWidgetEditor: FC<Props> = ({ isOpen }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(chartEditorSelectors.getChartEditor);

  return (
    <Modal
      isOpen={isOpen}
      closeOnFadeMaskClick={false}
      onClose={() => dispatch(chartEditorActions.closeEditor())}
    >
      {(_, closeHandler) => (
        <Container>
          {isLoading ? (
            <LoaderContainer>
              <Loader width={50} height={50} fill={colors.blue['500']} />
            </LoaderContainer>
          ) : (
            <ChartEditor onClose={closeHandler} />
          )}
        </Container>
      )}
    </Modal>
  );
};

export default ChartWidgetEditor;
