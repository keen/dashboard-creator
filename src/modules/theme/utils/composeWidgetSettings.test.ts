import { WidgetSettings } from '@keen.io/widgets';

import { DashboardSettings } from '../../dashboards';
import { composeWidgetSettings } from './composeWidgetSettings';

const widgetSettings = {
  title: {
    content: '',
    typography: {
      fontSize: 20,
      fontFamily: 'Gangster',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontColor: '#27566D',
    },
  },
  subtitle: {
    content: '',
    typography: {
      fontSize: 14,
      fontFamily: 'Lato, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontColor: '#1D2729',
    },
  },
} as WidgetSettings;

const dashboardSettings = {
  colorPalette: 'default',
  page: {
    chartTitlesFont: 'Lato',
  },
  title: {
    typography: {
      fontSize: 20,
      fontFamily: 'Gangster Grotesk, Arial, Helvetica, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontColor: '#27566D',
    },
  },
  subtitle: {
    typography: {
      fontSize: 14,
      fontFamily: 'Gangster Grotesk, Arial, Helvetica, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontColor: '#1D2729',
    },
  },
  legend: {
    typography: {
      fontSize: 12,
      fontFamily: 'Gangster Grotesk, Arial, Helvetica, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontColor: '#1D2729',
    },
  },
} as DashboardSettings;

const composedWidgetSettings = {
  title: {
    content: '',
    typography: {
      fontSize: 20,
      fontFamily: 'Lato, Arial, Helvetica, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontColor: '#27566D',
    },
  },
  subtitle: {
    content: '',
    typography: {
      fontSize: 14,
      fontFamily: 'Lato, Arial, Helvetica, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontColor: '#1D2729',
    },
  },
  legend: {
    typography: {
      fontSize: 12,
      fontFamily: 'Lato, Arial, Helvetica, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontColor: '#1D2729',
    },
  },
};

test('composes widget settings with dashboard settings', () => {
  const composedSettings = composeWidgetSettings(
    widgetSettings,
    dashboardSettings
  );
  expect(composedSettings).toStrictEqual(composedWidgetSettings);
});
