import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import App from './App';
import { appStart } from './modules/app';

import { createSagaContext } from './createSagaContext';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

import { Options } from './types';

export class DashboardCreator {
  private container: string;

  /** Authorization access key for project */
  private readonly accessKey: string;

  /** Project identifer */
  private readonly projectId: string;

  /** Blob API url */
  private readonly blobApiUrl: string;

  constructor(config: Options) {
    const { container, accessKey, blobApiUrl, projectId } = config;

    this.container = container;
    this.projectId = projectId;
    this.accessKey = accessKey;
    this.blobApiUrl = blobApiUrl;
  }

  render() {
    const sagaMiddleware = createSagaMiddleware({
      context: createSagaContext({
        accessKey: this.accessKey,
        blobApiUrl: this.blobApiUrl,
        projectId: this.projectId,
      }),
    });

    const store = configureStore({
      reducer: rootReducer,
      middleware: [sagaMiddleware],
    });

    sagaMiddleware.run(rootSaga);
    store.dispatch(appStart());

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.querySelector(this.container)
    );
  }
}

export default DashboardCreator;
