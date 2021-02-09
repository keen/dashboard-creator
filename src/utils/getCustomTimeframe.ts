import { convertRelativeTime } from '../components/DatePickerWidget/utils';

const getCustomTimeframe = (timeframe: string, label: string) => {
  const { value, units } = convertRelativeTime(timeframe);

  return `${label} ${value} ${units}`;
};

export default getCustomTimeframe;
