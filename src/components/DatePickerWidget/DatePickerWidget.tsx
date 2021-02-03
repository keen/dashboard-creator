import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import {
  setDatePickerModifiers,
  applyDatePickerModifiers,
} from '../../modules/widgets';

type Props = {
  /** Widget identifier */
  id: string;
  /** Disable chart interactions */
  disableInteractions?: boolean;
};

const DatePickerWidget: FC<Props> = ({ id }) => {
  const dispatch = useDispatch();

  return (
    <div>
      Time Picker
      <button
        onClick={() =>
          dispatch(setDatePickerModifiers(id, 'this_90_days', 'UTC'))
        }
      >
        Set Settings
      </button>
      <button onClick={() => dispatch(applyDatePickerModifiers(id))}>
        Apply
      </button>
    </div>
  );
};

export default DatePickerWidget;
