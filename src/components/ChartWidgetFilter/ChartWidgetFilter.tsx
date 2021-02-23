import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { DatePickerContent, FiltersContent } from './components';

import { getInterimQuery } from '../../modules/queries';
import { getWidget } from '../../modules/widgets';

import { RootState } from '../../rootReducer';

import { WidgetFilter } from './components';
import { Container } from './ChartWidgetFilter.styles';

type Props = {
  /** Widget id */
  widgetId: string;
};

const ChartWidgetFilter: FC<Props> = ({ widgetId }) => {
  const { widget } = useSelector((rootState: RootState) =>
    getWidget(rootState, widgetId)
  );

  const datePickerData = useSelector((state: RootState) => {
    if (!widget['datePickerId']) return;

    const { data } = getWidget(state, widget['datePickerId']);
    return data;
  });

  const filtersData = useSelector((state: RootState) => {
    if (!widget['filterIds']) return;

    const filters = widget['filterIds'].reduce((acc, id) => {
      const { data } = getWidget(state, id);
      if (data?.filter) {
        acc.push({
          propertyName: data.filter['propertyName'],
          propertyValue: data.filter['propertyValue'],
        });
      }
      return acc;
    }, []);

    return filters;
  });

  const hasInterimQuery = useSelector((state: RootState) => {
    const interimQuery = getInterimQuery(state, widgetId);
    return !!interimQuery;
  });

  if (hasInterimQuery) {
    return (
      <Container>
        {datePickerData && (
          <WidgetFilter icon="date-picker">
            <DatePickerContent timeframe={datePickerData.timeframe} />
          </WidgetFilter>
        )}
        {!!filtersData?.length && (
          <WidgetFilter icon="funnel-widget-vertical">
            <FiltersContent data={filtersData} />
          </WidgetFilter>
        )}
      </Container>
    );
  }

  return null;
};

export default ChartWidgetFilter;
