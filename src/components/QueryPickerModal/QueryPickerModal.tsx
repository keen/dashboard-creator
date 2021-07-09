import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader } from '@keen.io/ui-core';

import { Content } from './QueryPickerModal.styles';

import QueryPicker from '../QueryPicker';
import { appActions, appSelectors } from '../../modules/app';

const QueryPickerModal: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isVisible } = useSelector(appSelectors.getQueryPicker);

  return (
    <Modal
      isOpen={isVisible}
      onClose={() => dispatch(appActions.hideQueryPicker())}
    >
      {(_, closeHandler) => (
        <>
          <ModalHeader onClose={closeHandler}>
            {t('query_picker.title')}
          </ModalHeader>
          <Content>
            <QueryPicker />
          </Content>
        </>
      )}
    </Modal>
  );
};

export default QueryPickerModal;
