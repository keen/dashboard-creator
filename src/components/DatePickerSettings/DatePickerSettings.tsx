import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@keen.io/ui-core';

import { Content, Description } from './DatePickerSettings.styles';
import WidgetConnections from '../WidgetConnections';

import {
  getDatePickerSettings,
  applySettings,
  updateConnection,
} from '../../modules/datePicker';

/*
TODO: Scroll

*/

const DatePickerSettings: FC<{}> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { widgetConnections } = useSelector(getDatePickerSettings);

  return (
    <div>
      <Content>
        <Description>{t('date_picker_settings.description')}</Description>
        <WidgetConnections
          connections={widgetConnections.map(
            ({ widgetId, isConnected, positionIndex, title }) => ({
              id: widgetId,
              isConnected,
              title: title
                ? title
                : `${t(
                    'date_picker_settings.untitled_chart'
                  )} ${positionIndex}`,
            })
          )}
          onUpdateConnection={(widgetId, isConnected) =>
            dispatch(updateConnection(widgetId, isConnected))
          }
        />
      </Content>
      <Button onClick={() => dispatch(applySettings())}>Apply</Button>
    </div>
  );
};

export default DatePickerSettings;
