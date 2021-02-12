import sagaHelper from 'redux-saga-testing';
import { all, put, call, take, select } from 'redux-saga/effects';

import {
  setupDatePicker,
  editDatePickerWidget,
  setDatePickerModifiers,
  applyDatePickerModifiers,
  applyDatePickerUpdates,
  removeDatePickerConnections,
  removeConnectionFromDatePicker,
  getDatePickerWidgetConnections,
  resetDatePickerWidgets,
  clearDatePickerModifiers,
} from './datePickerWidget';

import {
  setWidgetState,
  setDatePickerWidget,
  initializeChartWidget,
  updateChartWidgetDatePickerConnection,
  clearDatePickerModifiers as clearDatePickerModifiersAction,
  resetDatePickerWidgets as resetDatePickerWidgetsAction,
  editDatePickerWidget as editDatePickerWidgetAction,
  setDatePickerModifiers as setDatePickerModifiersAction,
  applyDatePickerModifiers as applyDatePickerModifiersAction,
} from '../actions';

import { getWidgetSettings } from '../selectors';

import { getActiveDashboard } from '../../app';
import {
  getDashboard,
  saveDashboard,
  ADD_WIDGET_TO_DASHBOARD,
} from '../../dashboards';
import {
  openEditor,
  closeEditor,
  getDatePickerSettings,
  setEditorConnections,
  APPLY_EDITOR_SETTINGS,
  CLOSE_EDITOR,
} from '../../datePicker';

describe('clearDatePickerModifiers()', () => {
  describe('Scenario 1: Resets date picker state and re-initialize connected chart widgets', () => {
    const datePickerId = '@date-picker/01';
    const connectedWidgets = ['@widget/01', '@widget/02'];
    const action = clearDatePickerModifiersAction(datePickerId);

    const test = sagaHelper(clearDatePickerModifiers(action));

    test('updates date picker statee', (result) => {
      expect(result).toEqual(
        put(setWidgetState('@date-picker/01', { isActive: false, data: null }))
      );
    });

    test('get date picker settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, datePickerId));

      return {
        settings: { widgets: connectedWidgets },
      };
    });

    test('updates connected chart widgets states', (result) => {
      expect(result).toEqual(
        all([
          put(
            setWidgetState('@widget/01', { isInitialized: false, error: null })
          ),
          put(
            setWidgetState('@widget/02', { isInitialized: false, error: null })
          ),
        ])
      );
    });

    test('re-initializes connected chart widgets', (result) => {
      expect(result).toEqual(
        all([
          put(initializeChartWidget('@widget/01')),
          put(initializeChartWidget('@widget/02')),
        ])
      );
    });
  });
});

describe('resetDatePickerWidgets()', () => {
  describe('Scenario 1: Resets all date picker widgets state', () => {
    const dashboardId = '@dashboard/01';
    const action = resetDatePickerWidgetsAction('@dashboard/01');

    const test = sagaHelper(resetDatePickerWidgets(action));

    test('gets application state', (result) => {
      expect(result).toEqual(select());

      return {
        widgets: {
          items: {
            '@date-picker/01': {
              widget: {
                type: 'date-picker',
                id: '@date-picker/01',
              },
            },
            '@date-picker/02': {
              widget: {
                type: 'date-picker',
                id: '@date-picker/02',
              },
            },
            '@widget/01': {
              widget: {
                type: 'image',
              },
            },
            '@widget/02': {
              widget: {
                type: 'visualization',
              },
            },
            '@widget/03': {
              widget: {
                type: 'test',
              },
            },
          },
        },
        dashboards: {
          items: {
            [dashboardId]: {
              settings: {
                widgets: [
                  '@date-picker/01',
                  '@date-picker/02',
                  '@widget/01',
                  '@widget/02',
                  '@widget/03',
                ],
              },
            },
          },
        },
      };
    });

    test('updates date picker widgets states', (result) => {
      expect(result).toEqual(
        all([
          put(
            setWidgetState('@date-picker/01', { isActive: false, data: null })
          ),
          put(
            setWidgetState('@date-picker/02', { isActive: false, data: null })
          ),
        ])
      );
    });
  });
});

describe('setupDatePicker()', () => {
  describe('Scenario 1: User creates date picker widget with connections settings', () => {
    const datePickerId = '@date-picker/01';
    const connections = [
      {
        widgetId: '@widget/01',
        isConnected: true,
        title: null,
        positionIndex: 1,
      },
      {
        widgetId: '@widget/02',
        isConnected: true,
        title: null,
        positionIndex: 2,
      },
    ];

    const test = sagaHelper(setupDatePicker(datePickerId));

    test('gets active dashboard identifer', (result) => {
      expect(result).toEqual(select(getActiveDashboard));

      return '@dashboard/01';
    });

    test('waits until widget is added to dashboard', (result) => {
      expect(result).toEqual(take(ADD_WIDGET_TO_DASHBOARD));

      return { type: ADD_WIDGET_TO_DASHBOARD };
    });

    test('gets dashboard settings', (result) => {
      expect(result).toEqual(select(getDashboard, '@dashboard/01'));

      return {
        settings: { widgets: ['@widget/01', '@widget/02', '@widget/03'] },
      };
    });

    test('gets possible date picker connections and enable connections for widgets by default', (result) => {
      expect(result).toEqual(
        call(
          getDatePickerWidgetConnections,
          '@dashboard/01',
          datePickerId,
          true
        )
      );

      return connections;
    });

    test('set date picker editor connections', (result) => {
      expect(result).toEqual(put(setEditorConnections(connections)));
    });

    test('opens date picker editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('updates widgets visibility states', (result) => {
      expect(result).toEqual(
        all([
          put(setWidgetState('@widget/03', { isFadeOut: true })),
          put(setWidgetState('@widget/01', { isTitleCover: true })),
          put(setWidgetState('@widget/02', { isTitleCover: true })),
          put(setWidgetState('@widget/01', { isHighlighted: true })),
          put(setWidgetState('@widget/02', { isHighlighted: true })),
        ])
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(take([APPLY_EDITOR_SETTINGS, CLOSE_EDITOR]));

      return { type: APPLY_EDITOR_SETTINGS };
    });

    test('restores all widgets visiblity to initial state ', (result) => {
      expect(result).toEqual(
        all([
          put(
            setWidgetState('@widget/01', {
              isHighlighted: false,
              isFadeOut: false,
              isTitleCover: false,
            })
          ),
          put(
            setWidgetState('@widget/02', {
              isHighlighted: false,
              isFadeOut: false,
              isTitleCover: false,
            })
          ),
          put(
            setWidgetState('@widget/03', {
              isHighlighted: false,
              isFadeOut: false,
              isTitleCover: false,
            })
          ),
        ])
      );
    });

    test('applies date picker configuration updates', (result) => {
      expect(result).toEqual(call(applyDatePickerUpdates, datePickerId));
    });

    test('closes date picker editor', (result) => {
      expect(result).toEqual(put(closeEditor()));
    });

    test('saves dashboards', (result) => {
      expect(result).toEqual(put(saveDashboard('@dashboard/01')));
    });
  });
});

describe('editDatePickerWidget()', () => {
  describe('Scenario 1: User edits date picker connections settings', () => {
    const datePickerId = '@date-picker/01';
    const action = editDatePickerWidgetAction(datePickerId);
    const connections = [
      {
        widgetId: '@widget/01',
        isConnected: true,
        title: null,
        positionIndex: 1,
      },
      {
        widgetId: '@widget/02',
        isConnected: false,
        title: null,
        positionIndex: 2,
      },
    ];

    const test = sagaHelper(editDatePickerWidget(action));

    test('gets active dashboard identifer', (result) => {
      expect(result).toEqual(select(getActiveDashboard));

      return '@dashboard/01';
    });

    test('gets current date picker connections', (result) => {
      expect(result).toEqual(
        call(getDatePickerWidgetConnections, '@dashboard/01', datePickerId)
      );

      return connections;
    });

    test('set date picker editor connections', (result) => {
      expect(result).toEqual(put(setEditorConnections(connections)));
    });

    test('gets dashboard settings', (result) => {
      expect(result).toEqual(select(getDashboard, '@dashboard/01'));

      return {
        settings: { widgets: ['@widget/01', '@widget/02', '@widget/03'] },
      };
    });

    test('updates widgets visibility states', (result) => {
      expect(result).toEqual(
        all([
          put(setWidgetState('@widget/03', { isFadeOut: true })),
          put(setWidgetState('@widget/01', { isTitleCover: true })),
          put(setWidgetState('@widget/02', { isTitleCover: true })),
          put(setWidgetState('@widget/01', { isHighlighted: true })),
        ])
      );
    });

    test('opens date picker editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(take([APPLY_EDITOR_SETTINGS, CLOSE_EDITOR]));

      return { type: APPLY_EDITOR_SETTINGS };
    });

    test('restores all widgets visiblity to initial state ', (result) => {
      expect(result).toEqual(
        all([
          put(
            setWidgetState('@widget/01', {
              isHighlighted: false,
              isFadeOut: false,
              isTitleCover: false,
            })
          ),
          put(
            setWidgetState('@widget/02', {
              isHighlighted: false,
              isFadeOut: false,
              isTitleCover: false,
            })
          ),
          put(
            setWidgetState('@widget/03', {
              isHighlighted: false,
              isFadeOut: false,
              isTitleCover: false,
            })
          ),
        ])
      );
    });

    test('applies date picker configuration updates', (result) => {
      expect(result).toEqual(call(applyDatePickerUpdates, datePickerId));
    });

    test('closes date picker editor', (result) => {
      expect(result).toEqual(put(closeEditor()));
    });

    test('saves dashboards', (result) => {
      expect(result).toEqual(put(saveDashboard('@dashboard/01')));
    });
  });
});

describe('applyDatePickerUpdates()', () => {
  describe('Scenario 1: Update date picker and chart widgets connections', () => {
    const datePickerId = '@date-picker/01';

    const test = sagaHelper(applyDatePickerUpdates(datePickerId));

    test('gets date picker configuration state', (result) => {
      expect(result).toEqual(select(getDatePickerSettings));

      return {
        widgetConnections: [
          {
            widgetId: '@widget/01',
            isConnected: true,
            title: null,
            positionIndex: 1,
          },
          {
            widgetId: '@widget/02',
            isConnected: false,
            title: null,
            positionIndex: 2,
          },
        ],
      };
    });

    test('updates date picker connections in chart widgets', (result) => {
      expect(result).toEqual(
        all([
          put(
            updateChartWidgetDatePickerConnection('@widget/01', datePickerId)
          ),
          put(updateChartWidgetDatePickerConnection('@widget/02', null)),
        ])
      );
    });

    test('updates date picker connection settings', (result) => {
      expect(result).toEqual(
        put(setDatePickerWidget(datePickerId, ['@widget/01']))
      );
    });
  });
});

describe('removeConnectionFromDatePicker()', () => {
  describe('Scenario 1: Removes chart connection from date picker', () => {
    const datePickerId = '@date-picker/01';
    const connectedWidgets = ['@widget/01', '@widget/02', '@widget/03'];

    const test = sagaHelper(
      removeConnectionFromDatePicker(datePickerId, '@widget/01')
    );

    test('get date picker settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, datePickerId));

      return {
        settings: { widgets: connectedWidgets },
      };
    });

    test('updates date picker connection settings', (result) => {
      expect(result).toEqual(
        put(setDatePickerWidget(datePickerId, ['@widget/02', '@widget/03']))
      );
    });
  });
});

describe('removeDatePickerConnections()', () => {
  describe('Scenario 1: Removes all date picker connections', () => {
    const dashboardId = '@dashboard/01';
    const datePickerId = '@date-picker/01';

    const test = sagaHelper(
      removeDatePickerConnections(dashboardId, datePickerId)
    );

    test('gets application state', (result) => {
      expect(result).toEqual(select());

      return {
        widgets: {
          items: {
            '@widget/01': {
              widget: {
                type: 'visualization',
                id: '@widget/01',
                datePickerId: datePickerId,
              },
            },
            '@widget/02': {
              widget: {
                type: 'visualization',
                id: '@widget/02',
                datePickerId: null,
              },
            },
          },
        },
        dashboards: {
          items: {
            [dashboardId]: {
              settings: {
                widgets: ['@widget/01', '@widget/02'],
              },
            },
          },
        },
      };
    });

    test('updates date picker connections in chart widgets', (result) => {
      expect(result).toEqual(
        all([put(updateChartWidgetDatePickerConnection('@widget/01', null))])
      );
    });
  });
});

describe('getDatePickerWidgetConnections()', () => {
  describe('Scenario 1: Get possible date picker connections', () => {
    const dashboardId = '@dashboard/01';
    const datePickerId = '@date-picker/01';

    const test = sagaHelper(
      getDatePickerWidgetConnections(dashboardId, datePickerId, true)
    );

    test('gets application state', (result) => {
      expect(result).toEqual(select());
    });
  });
});

describe('setDatePickerModifiers()', () => {
  describe('Scenario 1: Set date picker widget modifiers', () => {
    const datePickerId = '@date-picker/01';
    const action = setDatePickerModifiersAction(
      datePickerId,
      'this_14_days',
      'UTC'
    );

    const test = sagaHelper(setDatePickerModifiers(action));

    test('updates date picker widgets state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(datePickerId, {
            data: { timeframe: 'this_14_days', timezone: 'UTC' },
          })
        )
      );
    });
  });
});

describe('applyDatePickerModifiers()', () => {
  describe('Scenario 1: Re-initializes widgets connected with date picker', () => {
    const datePickerId = '@date-picker/01';
    const connectedWidgets = ['@widget/01'];

    const action = applyDatePickerModifiersAction(datePickerId);

    const test = sagaHelper(applyDatePickerModifiers(action));

    test('set date picker to active state', (result) => {
      expect(result).toEqual(
        put(setWidgetState(datePickerId, { isActive: true }))
      );
    });

    test('get date picker settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, datePickerId));

      return {
        settings: { widgets: connectedWidgets },
      };
    });

    test('updates connected chart widgets state', (result) => {
      expect(result).toEqual(
        all([
          put(
            setWidgetState('@widget/01', { isInitialized: false, error: null })
          ),
        ])
      );
    });

    test('re-initializes connected chart widgets', (result) => {
      expect(result).toEqual(all([put(initializeChartWidget('@widget/01'))]));
    });
  });
});
