import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import WidgetManagement from '../WidgetManagement';

import { editChartWidget, cloneWidget } from '../../modules/widgets';

type Props = {
  /** Widget identifier */
  widgetId: string;
  /** Hover state indicator */
  isHoverActive: boolean;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
};

const ChartManagement: FC<Props> = ({
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
      onEditWidget={() => dispatch(editChartWidget(widgetId))}
      onRemoveWidget={onRemoveWidget}
      editButtonLabel={t('widget.edit_chart')}
    />
  );
};

export default ChartManagement;
