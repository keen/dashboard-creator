import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@keen.io/ui-core';

import QueryPicker from '../QueryPicker';

import { getQueryPicker, hideQueryPicker } from '../../modules/app';

const QueryPickerModal: FC<{}> = () => {
  const dispatch = useDispatch();
  const { isVisible } = useSelector(getQueryPicker);

  return (
    <div>
      <Modal isOpen={isVisible} onClose={() => dispatch(hideQueryPicker())}>
        {(_, closeHandler) => (
          <>
            <div onClick={closeHandler}>Close</div>
            <QueryPicker />
          </>
        )}
      </Modal>
    </div>
  );
};

export default QueryPickerModal;
