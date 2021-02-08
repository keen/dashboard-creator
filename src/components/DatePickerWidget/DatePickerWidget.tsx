import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { transparentize } from 'polished';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { Container, Title } from './DatePickerWidget.styles';

import {
  setDatePickerModifiers,
  clearDatePickerModifiers,
  applyDatePickerModifiers,
  getWidget,
} from '../../modules/widgets';

import { RootState } from '../../rootReducer';

type Props = {
  /** Widget identifier */
  id: string;
  /** Disable chart interactions */
  disableInteractions?: boolean;
};

const DatePickerWidget: FC<Props> = ({ id, disableInteractions }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isActive, data } = useSelector((state: RootState) =>
    getWidget(state, id)
  );

  return (
    <Container>
      <Icon
        type="date-picker"
        fill={transparentize(0.5, colors.black[100])}
        width={15}
        height={15}
      />
      <Title role="heading">{t('date_picker_widget.name')}</Title>
      {isActive && 'active'}
      {data?.timeframe && data.timeframe}
      {!disableInteractions && (
        <>
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
          <button onClick={() => dispatch(clearDatePickerModifiers(id))}>
            Clear
          </button>
        </>
      )}
    </Container>
  );
};

export default DatePickerWidget;
