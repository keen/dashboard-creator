/* eslint-disable @typescript-eslint/naming-convention */
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

import { getWidgetSettings } from '../selectors';

import {
  getDashboard,
  saveDashboard,
  ADD_WIDGET_TO_DASHBOARD,
} from '../../dashboards';
import { datePickerActions, datePickerSelectors } from '../../datePicker';
import { appSelectors } from '../../app';
import { widgetsActions } from '../index';

describe('clearDatePickerModifiers()', () => {
  describe('Scenario 1: Resets date picker state and re-initialize connected chart widgets', () => {
    const datePickerId = '@date-picker/01';
    const connectedWidgets = ['@widget/01', '@widget/02'];
    const action = widgetsActions.clearDatePickerModifiers(datePickerId);

    const test = sagaHelper(clearDatePickerModifiers(action));

    test('updates date picker statee', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: '@date-picker/01',
            widgetState: { isActive: false, data: null },
          })
        )
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
            widgetsActions.setWidgetState({
              id: '@widget/01',
              widgetState: { isInitialized: false, error: null },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/02',
              widgetState: { isInitialized: false, error: null },
            })
          ),
        ])
      );
    });

    test('re-initializes connected chart widgets', (result) => {
      expect(result).toEqual(
        all([
          put(widgetsActions.initializeChartWidget('@widget/01')),
          put(widgetsActions.initializeChartWidget('@widget/02')),
        ])
      );
    });
  });
});

describe('resetDatePickerWidgets()', () => {
  describe('Scenario 1: Resets all date picker widgets state', () => {
    const dashboardId = '@dashboard/01';
    const action = widgetsActions.resetDatePickerWidgets('@dashboard/01');

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
            widgetsActions.setWidgetState({
              id: '@date-picker/01',
              widgetState: { isActive: false, data: null },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@date-picker/02',
              widgetState: { isActive: false, data: null },
            })
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
      expect(result).toEqual(select(appSelectors.getActiveDashboard));

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
      expect(result).toEqual(
        put(
          datePickerActions.setEditorConnections({
            widgetConnections: connections,
          })
        )
      );
    });

    test('opens date picker editor', (result) => {
      expect(result).toEqual(put(datePickerActions.openEditor()));
    });

    test('updates widgets visibility states', (result) => {
      expect(result).toEqual(
        all([
          put(
            widgetsActions.setWidgetState({
              id: '@widget/03',
              widgetState: { isFadeOut: true },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/01',
              widgetState: { isTitleCover: true },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/02',
              widgetState: { isTitleCover: true },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/01',
              widgetState: { isHighlighted: true },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/02',
              widgetState: { isHighlighted: true },
            })
          ),
        ])
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(
        take([
          datePickerActions.applySettings.type,
          datePickerActions.closeEditor.type,
        ])
      );

      return { type: datePickerActions.applySettings.type };
    });

    test('restores all widgets visiblity to initial state ', (result) => {
      expect(result).toEqual(
        all([
          put(
            widgetsActions.setWidgetState({
              id: '@widget/01',
              widgetState: {
                isHighlighted: false,
                isFadeOut: false,
                isTitleCover: false,
              },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/02',
              widgetState: {
                isHighlighted: false,
                isFadeOut: false,
                isTitleCover: false,
              },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/03',
              widgetState: {
                isHighlighted: false,
                isFadeOut: false,
                isTitleCover: false,
              },
            })
          ),
        ])
      );
    });

    test('applies date picker configuration updates', (result) => {
      expect(result).toEqual(call(applyDatePickerUpdates, datePickerId));
    });

    test('closes date picker editor', (result) => {
      expect(result).toEqual(put(datePickerActions.closeEditor()));
    });

    test('saves dashboards', (result) => {
      expect(result).toEqual(put(saveDashboard('@dashboard/01')));
    });
  });
});

describe('editDatePickerWidget()', () => {
  describe('Scenario 1: User edits date picker connections settings', () => {
    const datePickerId = '@date-picker/01';
    const action = widgetsActions.editDatePickerWidget(datePickerId);
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
      expect(result).toEqual(select(appSelectors.getActiveDashboard));

      return '@dashboard/01';
    });

    test('gets current date picker connections', (result) => {
      expect(result).toEqual(
        call(getDatePickerWidgetConnections, '@dashboard/01', datePickerId)
      );

      return connections;
    });

    test('gets date picker name', (result) => {
      expect(result).toEqual(select(getWidgetSettings, datePickerId));
      return {
        settings: {
          name: 'datePickerName',
        },
      };
    });

    test('set date picker editor connections', (result) => {
      expect(result).toEqual(
        put(
          datePickerActions.setEditorConnections({
            widgetConnections: connections,
          })
        )
      );
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
          put(
            widgetsActions.setWidgetState({
              id: '@widget/03',
              widgetState: { isFadeOut: true },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/01',
              widgetState: { isTitleCover: true },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/02',
              widgetState: { isTitleCover: true },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/01',
              widgetState: { isHighlighted: true },
            })
          ),
        ])
      );
    });

    test('set date picker widget name', (result) => {
      expect(result).toEqual(
        put(datePickerActions.setName({ name: 'datePickerName' }))
      );
    });

    test('opens date picker editor', (result) => {
      expect(result).toEqual(put(datePickerActions.openEditor()));
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(
        take([
          datePickerActions.applySettings.type,
          datePickerActions.closeEditor.type,
        ])
      );

      return { type: datePickerActions.applySettings.type };
    });

    test('restores all widgets visiblity to initial state ', (result) => {
      expect(result).toEqual(
        all([
          put(
            widgetsActions.setWidgetState({
              id: '@widget/01',
              widgetState: {
                isHighlighted: false,
                isFadeOut: false,
                isTitleCover: false,
              },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/02',
              widgetState: {
                isHighlighted: false,
                isFadeOut: false,
                isTitleCover: false,
              },
            })
          ),
          put(
            widgetsActions.setWidgetState({
              id: '@widget/03',
              widgetState: {
                isHighlighted: false,
                isFadeOut: false,
                isTitleCover: false,
              },
            })
          ),
        ])
      );
    });

    test('applies date picker configuration updates', (result) => {
      expect(result).toEqual(call(applyDatePickerUpdates, datePickerId));
    });

    test('closes date picker editor', (result) => {
      expect(result).toEqual(put(datePickerActions.closeEditor()));
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
      expect(result).toEqual(select(datePickerSelectors.getDatePickerSettings));

      return {
        name: 'datePickerName',
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
            widgetsActions.updateChartWidgetDatePickerConnections({
              id: '@widget/01',
              datePickerId,
            })
          ),
          put(
            widgetsActions.updateChartWidgetDatePickerConnections({
              id: '@widget/02',
              datePickerId: null,
            })
          ),
        ])
      );
    });

    test('updates date picker connection settings', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setDatePickerWidget({
            id: datePickerId,
            widgetConnections: ['@widget/01'],
            name: 'datePickerName',
          })
        )
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

    test('get date picker settings', (result) => {
      expect(result).toEqual(select(datePickerSelectors.getDatePickerSettings));
      return {
        name: 'datePickerName',
      };
    });

    test('updates date picker connection settings', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setDatePickerWidget({
            id: datePickerId,
            widgetConnections: ['@widget/02', '@widget/03'],
            name: 'datePickerName',
          })
        )
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
        all([
          put(
            widgetsActions.updateChartWidgetDatePickerConnections({
              id: '@widget/01',
              datePickerId: null,
            })
          ),
        ])
      );
    });
  });
});

describe('getDatePickerWidgetConnections()', () => {
  describe('Scenario 1: Get possible date picker connections', () => {
    const dashboardId = '@dashboard/01';
    const datePickerId = '@date-picker/01';

    const state = {
      widgets: {
        items: {
          '@widget/01': {
            widget: {
              id: '@widget/01',
              type: 'visualization',
              datePickerId: '@date-picker/02',
              filterIds: [],
              position: { y: 5 },
              settings: {
                widgetSettings: {},
              },
            },
            data: {
              query: {
                analysis_type: 'count',
                event_collection: 'purchases',
              },
            },
          },
          '@widget/02': {
            widget: {
              type: 'date-picker',
              position: { y: 5 },
            },
          },
          '@widget/03': {
            widget: {
              id: '@widget/03',
              type: 'visualization',
              datePickerId: null,
              filterIds: [],
              position: { y: 5 },
              settings: {
                widgetSettings: {
                  title: {
                    content: '@widget/title',
                  },
                },
              },
            },
            data: {
              query: {
                analysis_type: 'count',
                event_collection: 'purchases',
              },
            },
          },
          '@widget/04': {
            widget: {
              id: '@widget/04',
              type: 'visualization',
              datePickerId: '@date-picker/01',
              filterIds: [],
              position: { y: 5 },
              settings: {
                widgetSettings: {},
              },
            },
            data: {
              query: {
                analysis_type: 'count',
                event_collection: 'purchases',
              },
            },
          },
        },
      },
      dashboards: {
        items: {
          [dashboardId]: {
            settings: {
              widgets: ['@widget/01', '@widget/02', '@widget/03', '@widget/04'],
            },
          },
        },
      },
    };

    function* wrapper() {
      const result = yield* getDatePickerWidgetConnections(
        dashboardId,
        datePickerId,
        false
      );
      return result;
    }

    const test = sagaHelper(wrapper());

    test('gets application state', (result) => {
      expect(result).toEqual(select());

      return state;
    });

    test('returns date picker widget connections', (result) => {
      expect(result).toEqual([
        {
          widgetId: '@widget/03',
          isConnected: false,
          title: '@widget/title',
          positionIndex: 3,
        },
        {
          widgetId: '@widget/04',
          isConnected: true,
          title: null,
          positionIndex: 4,
        },
      ]);
    });
  });
  describe('Scenario 2: Return date picker connections with widgets without errors', () => {
    const dashboardId = '@dashboard/01';
    const datePickerId = '@date-picker/01';

    const state = {
      widgets: {
        items: {
          '@widget/01': {
            widget: {
              id: '@widget/01',
              type: 'visualization',
              datePickerId: '@date-picker/01',
              filterIds: [],
              position: { y: 5 },
              settings: {
                widgetSettings: {},
              },
            },
            data: {
              query: {
                analysis_type: 'count',
                event_collection: 'purchases',
              },
            },
          },
          '@widget/02': {
            widget: {
              type: 'date-picker',
              position: { y: 5 },
            },
          },
          '@widget/03': {
            error: {},
            widget: {
              id: '@widget/03',
              type: 'visualization',
              datePickerId: '@date-picker/01',
              filterIds: [],
              position: { y: 5 },
              settings: {
                widgetSettings: {},
              },
            },
            data: {
              query: {
                analysis_type: 'count',
                event_collection: 'purchases',
              },
            },
          },
        },
      },
      dashboards: {
        items: {
          [dashboardId]: {
            settings: {
              widgets: ['@widget/01', '@widget/02', '@widget/03'],
            },
          },
        },
      },
    };

    function* wrapper() {
      return yield* getDatePickerWidgetConnections(
        dashboardId,
        datePickerId,
        false
      );
    }

    const test = sagaHelper(wrapper());

    test('gets application state', (result) => {
      expect(result).toEqual(select());

      return state;
    });

    test('returns date picker widget connections', (result) => {
      expect(result).toEqual([
        {
          isConnected: true,
          positionIndex: 1,
          title: null,
          widgetId: '@widget/01',
        },
      ]);
    });
  });
});

describe('setDatePickerModifiers()', () => {
  describe('Scenario 1: Set date picker widget modifiers', () => {
    const datePickerId = '@date-picker/01';
    const action = widgetsActions.setDatePickerModifiers(
      datePickerId,
      'this_14_days',
      'UTC'
    );

    const test = sagaHelper(setDatePickerModifiers(action));

    test('updates date picker widgets state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: datePickerId,
            widgetState: {
              data: { timeframe: 'this_14_days', timezone: 'UTC' },
            },
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

    const action = widgetsActions.applyDatePickerModifiers(datePickerId);

    const test = sagaHelper(applyDatePickerModifiers(action));

    test('set date picker to active state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: datePickerId,
            widgetState: { isActive: true },
          })
        )
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
            widgetsActions.setWidgetState({
              id: '@widget/01',
              widgetState: { isInitialized: false, error: null },
            })
          ),
        ])
      );
    });

    test('re-initializes connected chart widgets', (result) => {
      expect(result).toEqual(
        all([put(widgetsActions.initializeChartWidget('@widget/01'))])
      );
    });
  });
});
