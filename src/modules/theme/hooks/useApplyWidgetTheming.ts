import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { WidgetSettings } from '@keen.io/widgets';

import { themeSelectors } from '../selectors';
import { composeChartSettings, composeWidgetSettings } from '../utils';
import { ChartSettings } from '../../../types';

type Params = {
  /** Chart settings to which the theming changes will be applied */
  chartSettings: ChartSettings;
  /** Widget settings to which the theming changes will be applied */
  widgetSettings: WidgetSettings;
  /** Dependencies array - if any of provided dependencies will change, the theme reapply will be triggered */
  dependencies: any[];
  /** Condition which determines if theme should be applied - helps to prevent costly computations when e.g widget is not visible */
  composeCondition?: boolean;
};

export const useApplyWidgetTheming = ({
  chartSettings,
  widgetSettings,
  dependencies = [],
  composeCondition = true,
}: Params) => {
  const dashboardTheme = useSelector(themeSelectors.getActiveDashboardTheme);

  const { settings: dashboardWidgetSettings } = useSelector(
    themeSelectors.getActiveDashboardThemeSettings
  );

  const themedChartSettings = useMemo(() => {
    if (!composeCondition) {
      return chartSettings;
    }
    return composeChartSettings(chartSettings, dashboardTheme) as ChartSettings;
  }, [...dependencies]);

  const themedWidgetSettings = useMemo(() => {
    if (!composeCondition) {
      return widgetSettings;
    }
    return composeWidgetSettings(widgetSettings, dashboardWidgetSettings);
  }, [...dependencies]);

  return {
    themedChartSettings,
    themedWidgetSettings,
  };
};
