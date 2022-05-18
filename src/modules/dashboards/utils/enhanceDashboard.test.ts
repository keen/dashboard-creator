import enhanceDashboard from './enhanceDashboard';
import { DashboardModel } from '../types';
import { Theme } from '@keen.io/charts';

test('Enhances dashboard model with provided properties', () => {
  const dashboard = {
    settings: {
      title: {
        typography: {
          fontStyle: 'normal',
          fontColor: 'red',
        },
      },
      subtitle: {
        typography: {
          fontStyle: 'italic',
          fontColor: 'green',
        },
      },
    },
  } as DashboardModel;

  const baseTheme = {
    colors: ['yellow', 'orange'],
  } as Theme;

  expect(enhanceDashboard(dashboard, baseTheme)).toMatchSnapshot();
});
