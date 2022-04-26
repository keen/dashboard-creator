import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader } from '@keen.io/ui-core';

import DatePickerSettings from '../DatePickerSettings';

import {
  datePickerSelectors,
  datePickerActions,
} from '../../modules/datePicker';

const DatePickerModal: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isEditorOpen } = useSelector(
    datePickerSelectors.getDatePickerSettings
  );

  return (
    <Modal
      isOpen={isEditorOpen}
      onClose={() => dispatch(datePickerActions.closeEditor())}
    >
      {(_, closeHandler) => (
        <>
          <ModalHeader onClose={closeHandler}>
            {t('date_picker_settings.title')}
          </ModalHeader>
          <DatePickerSettings onCancel={closeHandler} />
        </>
      )}
    </Modal>
  );
};

export default DatePickerModal;
