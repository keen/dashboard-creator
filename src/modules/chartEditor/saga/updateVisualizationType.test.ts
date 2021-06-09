import { chartEditorActions } from '../index';
import sagaHelper from 'redux-saga-testing';
import { updateVisualizationType } from './updateVisualizationType';
import { getContext } from 'redux-saga/effects';
import { PUBSUB } from '../../../constants';
import { UPDATE_VISUALIZATION_TYPE } from '@keen.io/query-creator/dist';

describe('updateVisualizationType()', () => {
  describe('Scenario 1: Query Creator is notified about visualization change', () => {
    const action = chartEditorActions.setVisualizationSettings({
      type: 'bar',
      chartSettings: {},
      widgetSettings: {},
    });
    const test = sagaHelper(updateVisualizationType(action));

    const pubsub = {
      publish: jest.fn(),
    };

    test('get PubSub from context', (result) => {
      expect(result).toEqual(getContext(PUBSUB));
      return pubsub;
    });

    test('notifies query creator', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(UPDATE_VISUALIZATION_TYPE, {
        type: 'bar',
      });
    });
  });
});
