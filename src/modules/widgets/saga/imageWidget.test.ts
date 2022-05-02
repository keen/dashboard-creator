/* eslint-disable @typescript-eslint/naming-convention */
import sagaHelper from 'redux-saga-testing';
import { put, take } from 'redux-saga/effects';

import { selectImageWidget } from './imageWidget';
import { saveDashboard, removeWidgetFromDashboard } from '../../dashboards';
import { appActions } from '../../app';
import { widgetsActions } from '../index';

const dashboardId = '@dashboard/01';
const widgetId = '@widget/01';

describe('selectImageWidget()', () => {
  describe('Scenario 1: User saves new image', () => {
    const test = sagaHelper(selectImageWidget(widgetId));
    const link = 'https://example.com/image-1.jpg';

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showImagePicker()));
    });

    test('waits until user save new image', (result) => {
      expect(result).toEqual(
        take([widgetsActions.saveImage.type, appActions.hideImagePicker.type])
      );

      return widgetsActions.saveImage(link);
    });

    test('configures image widget', (result) => {
      const action = widgetsActions.setImageWidget({ id: widgetId, link });

      expect(result).toEqual(put(action));
    });

    test('sets widget state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: widgetId,
            widgetState: { isConfigured: true },
          })
        )
      );
    });

    test('hides Image picker', (result) => {
      expect(result).toEqual(put(appActions.hideImagePicker()));
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });
  });

  describe('Scenario 2: User cancel creation of image widget', () => {
    const test = sagaHelper(selectImageWidget(widgetId));

    test('shows image picker', (result) => {
      expect(result).toEqual(put(appActions.showImagePicker()));
    });

    test('waits until user close image picker', (result) => {
      expect(result).toEqual(
        take([widgetsActions.saveImage.type, appActions.hideImagePicker.type])
      );

      return appActions.hideImagePicker();
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('removes widget from dashboard', (result) => {
      expect(result).toEqual(
        put(removeWidgetFromDashboard(dashboardId, widgetId))
      );
    });
  });
});
