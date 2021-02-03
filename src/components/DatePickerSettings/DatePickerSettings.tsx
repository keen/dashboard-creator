import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@keen.io/ui-core';

import {
  getDatePickerSettings,
  applySettings,
  updateConnection,
} from '../../modules/datePicker';

const DatePickerSettings: FC<{}> = () => {
  const dispatch = useDispatch();
  const { widgetConnections } = useSelector(getDatePickerSettings);

  return (
    <div>
      DatePicker
      {widgetConnections.map(({ widgetId, isConnected }) => (
        <div
          key={widgetId}
          onClick={() => dispatch(updateConnection(widgetId, !isConnected))}
        >
          {widgetId} {isConnected ? 'Tak' : 'nie'}
        </div>
      ))}
      <Button onClick={() => dispatch(applySettings())}>Apply</Button>
    </div>
  );
};

export default DatePickerSettings;
