import sagaHelper from 'redux-saga-testing';
import { getContext } from 'redux-saga/effects';

import { UPDATE_VISUALIZATION_TYPE } from '@keen.io/query-creator/dist';

import { updateVisualizationType } from './updateVisualizationType';
import { PUBSUB } from '../../../constants';
import { chartEditorActions } from '../../chartEditor';

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
