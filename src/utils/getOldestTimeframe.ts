import moment from 'moment';

type TimeframeUnit =
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years';
type TimeframeRelation = 'this' | 'last';

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

    const timeframeArray = timeframe.split('_');
    const relation = timeframeArray[0] as TimeframeRelation;
    const n = parseInt(timeframeArray[1], 10);
    const unit = timeframeArray[2] as TimeframeUnit;

    const date = moment().subtract(n, unit);
    if (relation === 'this') {
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
