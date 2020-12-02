import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from '@keen.io/ui-core';

import QueryPicker from '../QueryPicker';

import { getQueryPicker, hideQueryPicker } from '../../modules/app';

const QueryPickerModal: FC<{}> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isVisible } = useSelector(getQueryPicker);

  return (
    <div>
      <Modal isOpen={isVisible} onClose={() => dispatch(hideQueryPicker())}>
        {(_, closeHandler) => (
          <>
            <div onClick={closeHandler}>{t('query_picker.close')}</div>
            <QueryPicker />
          </>
        )}
      </Modal>
    </div>
  );
};

export default QueryPickerModal;
