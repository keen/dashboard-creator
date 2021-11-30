import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render as rtlRender } from '@testing-library/react';
import WidgetVisualization from './WidgetVisualization';

const render = (storeState: any = {}, overProps: any = {}) => {
  const props = {
    isQueryPerforming: false,
    outdatedAnalysisResults: '',
    visualization: {
      type: 'gauge',
      chartSettings: {},
      widgetSettings: {},
    },
    querySettings: {},
    onChangeVisualization: jest.fn(),
    onRunQuery: jest.fn(),
    analysisResult: {
      query: {
        timeframe: {},
      },
      result: {},
    },
    isSavedQuery: false,
    inEditMode: false,
    ...overProps,
  };
  const mockStore = configureStore([]);
  const store = mockStore({
    app: {
      activeDashboardId: '@dashboard_id',
    },
    theme: {
      dashboards: {
        '@dashboard_id': {},
      },
    },
    dashboards: {
      connectedDashboards: {
        isLoading: false,
        isError: false,
        items: [],
      },
    },
    ...storeState,
  });

  const wrapper = rtlRender(
    <Provider store={store}>
      <WidgetVisualization {...props} />
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
  // eslint-disable-next-line react/display-name
  Trans: ({ children }: any) => <template>{children}</template>,
}));

test('shows go to settings message when chart is gauge type and max target value is not provided', () => {
  const {
    wrapper: { getByTestId },
  } = render();
  const goToSettingsMessage = getByTestId('gauge-chart-message');
  expect(goToSettingsMessage).toBeInTheDocument();
});

test('not shows go to settings message when chart type is different than gauge', () => {
  const {
    wrapper: { queryByTestId },
  } = render(
    {},
    {
      visualization: {
        type: 'bar',
        chartSettings: {},
        widgetSettings: {},
      },
    }
  );
  const goToSettingsMessage = queryByTestId('gauge-chart-message');
  expect(goToSettingsMessage).not.toBeInTheDocument();
});

test('not shows go to settings message when max value is provided in gauge chart', () => {
  const {
    wrapper: { queryByTestId },
  } = render(
    {},
    {
      visualization: {
        type: 'bar',
        chartSettings: {
          maxValue: 100,
        },
        widgetSettings: {},
      },
    }
  );
  const goToSettingsMessage = queryByTestId('gauge-chart-message');
  expect(goToSettingsMessage).not.toBeInTheDocument();
});
