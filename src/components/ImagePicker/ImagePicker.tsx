import React, { FC, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Alert, Input, Button } from '@keen.io/ui-core';

import {
  InsertImage,
  Buttons,
  Description,
  Notification,
  InputWrapper,
  CancelButton,
} from './ImagePicker.styles';

import { isLink } from '../../utils';

import { saveImage } from '../../modules/widgets';
import { hideImagePicker } from '../../modules/app';

const ImagePicker: FC<{}> = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [error, setError] = useState(null);
  const [link, setLink] = useState('');

  const onImageUpload = useCallback((url: string) => {
    if (!isLink(url)) {
      setError(true);
    } else {
      setError(false);
      dispatch(saveImage(url));
    }
  }, []);

  return (
    <>
      <InsertImage>
        <Description>{t('image_picker.image_url')}</Description>
        {error && (
          <Notification>
            <Alert type="error">{t('image_picker.error')}</Alert>
          </Notification>
        )}
        <InputWrapper>
          <Input
            variant="solid"
            type="text"
            value={link}
            placeholder={t('image_picker.placeholder')}
            onChange={(e) => setLink(e.currentTarget.value)}
          />
        </InputWrapper>
      </InsertImage>
      <Buttons>
        <Button variant="secondary" onClick={() => onImageUpload(link)}>
          {t('image_picker.insert_button')}
        </Button>
        <CancelButton>
          <Button variant="blank" onClick={() => dispatch(hideImagePicker())}>
            {t('image_picker.cancel_button')}
          </Button>
        </CancelButton>
      </Buttons>
    </>
  );
};

export default ImagePicker;
