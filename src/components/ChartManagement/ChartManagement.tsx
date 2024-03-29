import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import WidgetManagement from '../WidgetManagement';

import {
  WidgetError,
  WidgetErrors,
  widgetsActions,
} from '../../modules/widgets';

type Props = {
  /** Widget identifier */
  widgetId: string;
  /** Widget error */
  error: WidgetError;
  /** Hover state indicator */
  isHoverActive: boolean;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
};

const ChartManagement: FC<Props> = ({
  widgetId,
  error,
  isHoverActive,
  onRemoveWidget,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const disableManagement =
    error?.code === WidgetErrors.SAVED_QUERY_NOT_EXIST ||
    error?.code === WidgetErrors.STREAM_NOT_EXIST;

  const handleCreateNewChart = () =>
    dispatch(widgetsActions.createNewChart(widgetId));

  return (
    <WidgetManagement
      isHoverActive={isHoverActive}
      onCloneWidget={() => dispatch(widgetsActions.cloneWidget(widgetId))}
      onEditWidget={() => dispatch(widgetsActions.editChartWidget(widgetId))}
      onRemoveWidget={onRemoveWidget}
      onCreateWidget={disableManagement && handleCreateNewChart}
      editAllowed={!disableManagement}
      cloneAllowed={!disableManagement}
      editButtonLabel={t('widget.edit_chart')}
    />
  );
};

export default ChartManagement;
