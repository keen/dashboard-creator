import { RootState } from '../../rootReducer';

export const getDatePickerSettings = ({ datePicker }: RootState) => datePicker;

export const datePickerSelectors = {
  getDatePickerSettings,
};
