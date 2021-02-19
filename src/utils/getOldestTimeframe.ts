import moment from 'moment';

type TimeframeUnit =
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years';
type TimeframeRelative = 'this' | 'last';

export const getOldestTimeframe = (
  timeframes: (string | { start: string; end: string })[]
) => {
  let absoluteTimeframes = [];
  timeframes.forEach((timeframe) => {
    if (typeof timeframe === 'object') {
      return absoluteTimeframes.push({
        timeframe: timeframe,
        absolute: moment(timeframe.start),
      });
    }
    const [rel, n, unit]: [
      TimeframeRelative,
      string,
      TimeframeUnit
    ] = timeframe.split('_');
    const date = moment().subtract(parseInt(n, 10), unit);
    if (rel === 'this') {
      date.add(1, unit);
    }
    absoluteTimeframes.push({
      timeframe: timeframe,
      absolute: date,
    });
  });
  absoluteTimeframes = absoluteTimeframes.sort(
    (dateA, dateB) => dateA.absolute.valueOf() - dateB.absolute.valueOf()
  );
  return absoluteTimeframes[0].timeframe;
};
