import sagaHelper from 'redux-saga-testing';
import { put, getContext, call } from 'redux-saga/effects';
import { PickerWidgets, ChartSettings } from '@keen.io/widget-picker';
import { Query } from '@keen.io/query';

import { editChartWidget } from './editChartWidget';

import {
  editChartWidget as editChartWidgetAction,
  setWidgetState,
} from '../../actions';

import { widget as widgetFixture } from '../../fixtures';

import { NOTIFICATION_MANAGER, TRANSLATIONS } from '../../../../constants';

import { WidgetErrors } from '../../types';
import { chartEditorActions } from '../../../chartEditor';
import { checkStreamsConsistency } from './checkStreamsConsistency';
import { editChart } from './editChart';

const translationsMock = {
  t: jest.fn().mockImplementation((value) => value),
};

describe('editChartWidget()', () => {
  const widgetId = '@widget/01';

  const action = editChartWidgetAction(widgetId);
  const visualizationSettings = {
    chartSettings: {
      stackMode: 'percent',
    } as ChartSettings,
    visualizationType: 'area' as PickerWidgets,
    widgetSettings: {
      title: {
        content: '@widget/title',
      },
    },
  };

  describe('Scenario 1: User edits widget with ad-hoc query', () => {
    const test = sagaHelper(editChartWidget(action));

    const query: Query = {
      analysis_type: 'count',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    };

    const widgetItem = {
      ...widgetFixture,
      data: { query, result: 10 },
      widget: {
        ...widgetFixture.widget,
        settings: visualizationSettings,
        query,
      },
    };

    test('get widget from state', () => {
      return {
        widgets: {
          items: {
            [widgetId]: widgetItem,
          },
        },
      };
    });

    test('opens editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('checks if any of event collections are unavailable', (result) => {
      expect(result).toEqual(call(checkStreamsConsistency, query));
      return { isEditable: true, missingCollections: [] };
    });

    test('enables chart edition', (result) => {
      expect(result).toEqual(call(editChart, widgetId, widgetItem));
    });
  });

  describe('Scenario 2: User edits widget with saved query', () => {
    const test = sagaHelper(editChartWidget(action));
    const query = 'financial-report';
    const widgetItem = {
      ...widgetFixture,
      data: { query, result: 10 },
      widget: {
        ...widgetFixture.widget,
        settings: visualizationSettings,
        query,
      },
    };

    test('get widget from state', () => {
      return {
        widgets: {
          items: {
            [widgetId]: widgetItem,
          },
        },
      };
    });

    test('opens editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('checks if any of event collections are unavailable', (result) => {
      expect(result).toEqual(call(checkStreamsConsistency as any, query));
      return { isEditable: true, missingCollections: [] };
    });

    test('enables chart edition', (result) => {
      expect(result).toEqual(call(editChart, widgetId, widgetItem));
    });
  });

  describe("Scenario 3: User edits widget with saved query and it's collection doesn't exist", () => {
    const test = sagaHelper(editChartWidget(action));
    const query = 'financial-report';

    const notificationManagerMock = {
      showNotification: jest.fn(),
    };

    test('get widget from state', () => {
      return {
        widgets: {
          items: {
            [widgetId]: {
              ...widgetFixture,
              data: { query, result: 10 },
              widget: {
                ...widgetFixture.widget,
                settings: visualizationSettings,
                query,
              },
            },
          },
        },
      };
    });

    test('opens editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('checks if any of event collections are unavailable', (result) => {
      expect(result).toEqual(call(checkStreamsConsistency as any, query));
      return { isEditable: false, missingCollections: ['@event-stream'] };
    });

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

      return notificationManagerMock;
    });

    test('closes editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.closeEditor()));
    });

    test('calls show notification method', () => {
      expect(notificationManagerMock.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          translateMessage: true,
          message: 'notifications.not_existing_stream',
          autoDismiss: false,
          showDismissButton: true,
        })
      );
    });

    test('gets translations from context', (result) => {
      expect(result).toEqual(getContext(TRANSLATIONS));

      return translationsMock;
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: true,
            error: {
              message: 'widget_errors.stream_not_found',
              code: WidgetErrors.STREAM_NOT_EXIST,
            },
          })
        )
      );
    });
  });
});
