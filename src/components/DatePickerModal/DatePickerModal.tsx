import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, ModalHeader } from '@keen.io/ui-core';

import DatePickerSettings from '../DatePickerSettings';

import { getDatePickerSettings, closeEditor } from '../../modules/datePicker';

const DatePickerModal: FC<{}> = () => {
  const dispatch = useDispatch();

  const { isEditorOpen } = useSelector(getDatePickerSettings);

  return (
    <Modal isOpen={isEditorOpen} onClose={() => dispatch(closeEditor())}>
      {(_, closeHandler) => (
        <>
          <ModalHeader onClose={closeHandler}>Test</ModalHeader>
          <DatePickerSettings />
        </>
      )}
    </Modal>
  );
};

export default DatePickerModal;
