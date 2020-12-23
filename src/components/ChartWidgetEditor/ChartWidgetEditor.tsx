import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from '@keen.io/ui-core';

import { ChartEditor } from './components';

import { closeChartWidgetEditor } from '../../modules/widgets';

type Props = {
  /** Chart editor open indicator */
  isOpen: boolean;
};

const ChartWidgetEditor: FC<Props> = ({ isOpen }) => {
  const dispatch = useDispatch();

  return (
    <Modal isOpen={isOpen} onClose={() => dispatch(closeChartWidgetEditor())}>
      {(_, closeHandler) => (
        <div>
          <ChartEditor onClose={closeHandler} />
        </div>
      )}
    </Modal>
  );
};

export default ChartWidgetEditor;
