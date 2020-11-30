import { takeLatest, getContext } from 'redux-saga/effects';
import domtoimage from 'dom-to-image';
import { colors } from '@keen.io/colors';

import { createDashboardThumbnail as createDashboardThumbnailAction } from './actions';
import { bufferToBase64 } from './utils';

import {
  CREATE_DASHBOARD_THUMBNAIL,
  THUMBNAIL_WIDTH,
  THUMBNAIL_HEIGHT,
} from './constants';

import { BLOB_API } from '../../constants';
import { GRID_CONTAINER_ID } from '../../components/Grid';

export function* createDashboardThumbnail({
  payload,
}: ReturnType<typeof createDashboardThumbnailAction>) {
  const { dashboardId } = payload;
  const container = document.getElementById(GRID_CONTAINER_ID);

  const { clientHeight, clientWidth } = container;

  const aspectRatio = clientWidth / clientHeight;
  const height = THUMBNAIL_WIDTH / aspectRatio;

  try {
    const t0 = performance.now();
    const imageBlob: Blob = yield domtoimage.toBlob(container, {
      height: THUMBNAIL_HEIGHT,
      width: THUMBNAIL_WIDTH,
      bgcolor: colors.white[500],
      style: {
        'transform-origin': 'top left',
        transform: `scale(${THUMBNAIL_WIDTH / clientWidth}, ${
          height / clientHeight
        })`,
      },
    });

    const t1 = performance.now();

    console.log('generate thumbnail took ' + (t1 - t0) + ' milliseconds.');

    const blob = bufferToBase64(yield imageBlob.arrayBuffer());

    const blobApi = yield getContext(BLOB_API);
    yield blobApi.saveThumbnail(dashboardId, blob);
  } catch (err) {
    console.error(err);
  }
}

export function* thumbnailsSaga() {
  yield takeLatest(CREATE_DASHBOARD_THUMBNAIL, createDashboardThumbnail);
}
