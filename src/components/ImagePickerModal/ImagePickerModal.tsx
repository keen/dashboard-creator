import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader } from '@keen.io/ui-core';

import ImagePicker from '../ImagePicker';

import { getImagePicker, hideImagePicker } from '../../modules/app';
import { Content } from './ImagePickerModal.styles';

const ImagePickerModal: FC<{}> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isVisible } = useSelector(getImagePicker);

  return (
    <Modal isOpen={isVisible} onClose={() => dispatch(hideImagePicker())}>
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
