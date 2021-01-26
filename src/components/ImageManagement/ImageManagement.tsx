import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import WidgetManagement from '../WidgetManagement';

import { editImageWidget, cloneWidget } from '../../modules/widgets';

type Props = {
  /** Widget identifier */
  widgetId: string;
  /** Hover state indicator */
  isHoverActive: boolean;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
};

const ImageManagement: FC<Props> = ({
  widgetId,
  isHoverActive,
  onRemoveWidget,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <WidgetManagement
      isHoverActive={isHoverActive}
      onCloneWidget={() => dispatch(cloneWidget(widgetId))}
      onEditWidget={() => dispatch(editImageWidget(widgetId))}
      onRemoveWidget={onRemoveWidget}
      editButtonLabel={t('widget.edit_image')}
    />
  );
};

export default ImageManagement;
