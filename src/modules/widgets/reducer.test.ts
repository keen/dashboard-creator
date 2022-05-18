import { initialState } from './reducer';

import { widget } from './fixtures';
import { widgetsActions, widgetsReducer } from './index';

const gridPosition = { x: 1, y: 2, w: 4, h: 2 };

test('creates visualization widget', () => {
  const action = widgetsActions.createWidget({
    id: '@widget/id',
    widgetType: 'visualization',
    gridPosition,
  });
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

  const action = widgetsActions.removeWidget('@widget/id');
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

  const action = widgetsActions.finishChartWidgetConfiguration({
    id: '@widget/id',
    query,
    visualizationType: 'bar',
    chartSettings,
    widgetSettings: {},
  });
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

  const action = widgetsActions.setWidgetLoading({
    id: '@widget/id',
    isLoading: true,
  });
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

  const action = widgetsActions.updateWidgetsPosition({
    gridPositions: [{ ...gridPosition, i: '@widget/id' }],
  });
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

  const action = widgetsActions.setWidgetState({
    id: '@widget/id',
    widgetState: {
      isConfigured: true,
      isInitialized: true,
    },
  });
  const {
    items: { ['@widget/id']: widgetItem },
  } = widgetsReducer(state, action);

  const { isConfigured, isInitialized } = widgetItem;

  expect(isConfigured).toEqual(true);
  expect(isInitialized).toEqual(true);
});

test('save cloned widget', () => {
  const state = {
    ...initialState,
    items: {
      '@widget/id': widget,
    },
  };

  const action = widgetsActions.saveClonedWidget({
    id: '@widget/id',
    widgetSettings: widget.widget,
    widgetItem: widget,
  });
  const { items } = widgetsReducer(state, action);

  expect(items).toMatchSnapshot();
});
