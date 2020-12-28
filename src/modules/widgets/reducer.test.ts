import widgetsReducer, { initialState } from './reducer';

import {
  createWidget,
  removeWidget,
  setWidgetState,
  setWidgetLoading,
  updateWidgetsPosition,
  finishChartWidgetConfiguration,
} from './actions';
import { widget } from './fixtures';

const gridPosition = { x: 1, y: 2, w: 4, h: 2 };

test('creates visualization widget', () => {
  const action = createWidget('@widget/id', 'visualization', gridPosition);
  const { items } = widgetsReducer(initialState, action);

  expect(items).toMatchSnapshot();
});

test('removes widget', () => {
  const state = {
    ...initialState,
    items: {
      '@widget/id': widget,
    },
  };

  const action = removeWidget('@widget/id');
  const { items } = widgetsReducer(state, action);

  expect(items['@widget/id']).toBeUndefined();
});

test('finishes visualization widget configuration', () => {
  const state = {
    ...initialState,
    items: {
      '@widget/id': widget,
    },
  };

  const query = 'purchases';
  const chartSettings = { layout: 'vertical' };

  const action = finishChartWidgetConfiguration(
    '@widget/id',
    query,
    'bar',
    chartSettings,
    {}
  );
  const {
    items: { ['@widget/id']: widgetItem },
  } = widgetsReducer(state, action);

  expect(widgetItem).toMatchSnapshot();
});

test('set widget loading state', () => {
  const state = {
    ...initialState,
    items: {
      '@widget/id': widget,
    },
  };

  const action = setWidgetLoading('@widget/id', true);
  const {
    items: { ['@widget/id']: widgetItem },
  } = widgetsReducer(state, action);
  const { isLoading } = widgetItem;

  expect(isLoading).toEqual(true);
});

test('updates widget position', () => {
  const state = {
    ...initialState,
    items: {
      '@widget/id': widget,
    },
  };

  const action = updateWidgetsPosition([{ ...gridPosition, i: '@widget/id' }]);
  const {
    items: { ['@widget/id']: widgetItem },
  } = widgetsReducer(state, action);
  const {
    widget: { position },
  } = widgetItem;

  expect(position).toEqual(gridPosition);
});

test('set widget state', () => {
  const state = {
    ...initialState,
    items: {
      '@widget/id': widget,
    },
  };

  const action = setWidgetState('@widget/id', {
    isConfigured: true,
    isInitialized: true,
  });
  const {
    items: { ['@widget/id']: widgetItem },
  } = widgetsReducer(state, action);

  const { isConfigured, isInitialized } = widgetItem;

  expect(isConfigured).toEqual(true);
  expect(isInitialized).toEqual(true);
});
