import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader } from '@keen.io/ui-core';

import ImagePicker from '../ImagePicker';

import { Content } from './ImagePickerModal.styles';
import { appActions, appSelectors } from '../../modules/app';

const ImagePickerModal: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isVisible } = useSelector(appSelectors.getImagePicker);

  return (
    <Modal
      isOpen={isVisible}
      onClose={() => dispatch(appActions.hideImagePicker())}
    >
      {(_, closeHandler) => (
        <>
          <ModalHeader onClose={closeHandler}>
            {t('image_picker.title')}
          </ModalHeader>
          <Content>
            <ImagePicker />
          </Content>
        </>
      )}
    </Modal>
  );
};

export default ImagePickerModal;
