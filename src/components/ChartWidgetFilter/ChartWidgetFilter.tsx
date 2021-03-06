import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { DatePickerContent, FiltersContent, WidgetFilter } from './components';

import { getInterimQuery } from '../../modules/queries';
import {
  DatePickerWidget,
  FilterWidget,
  getWidget,
} from '../../modules/widgets';
import { RootState } from '../../rootReducer';
import { WidgetItem } from '../../modules/widgets/types';

import { Container } from './ChartWidgetFilter.styles';

import { FilterMeta } from './types';

type Props = {
  /** Widget id */
  widgetId: string;
};

const ChartWidgetFilter: FC<Props> = ({ widgetId }) => {
  const { widget } = useSelector((rootState: RootState) =>
    getWidget(rootState, widgetId)
  );

  const datePickerData = useSelector((state: RootState) => {
    if ('datePickerId' in widget && widget.datePickerId) {
      const { data, isActive, widget: datePickerWidget } = getWidget(
        state,
        widget.datePickerId
      ) as WidgetItem<DatePickerWidget>;
      if (isActive) {
        return { data, name: datePickerWidget.settings.name };
      }
      return null;
    }
    return null;
  });

  const filtersData = useSelector((state: RootState) => {
    if ('filterIds' in widget && widget.filterIds.length > 0) {
      return widget.filterIds.reduce(
        (activeFilters: FilterMeta[], id: string) => {
          const { data, isActive, widget } = getWidget(
            state,
            id
          ) as WidgetItem<FilterWidget>;
          if (isActive && data?.filter) {
            const { propertyName, propertyValue } = data.filter;
            return [
              ...activeFilters,
              {
                propertyName,
                propertyValue,
                filterName: widget.settings.name,
              },
            ];
          }
          return activeFilters;
        },
        []
      );
    }
    return [];
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
            <DatePickerContent
              name={datePickerData.name}
              timeframe={datePickerData.data.timeframe}
              timezone={datePickerData.data.timezone}
            />
          </WidgetFilter>
        )}
        {filtersData.length > 0 && (
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
