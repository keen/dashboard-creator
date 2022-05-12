import { getContext, put } from 'redux-saga/effects';
import { KEEN_ANALYSIS } from '../../../constants';
import { FILTER_SCHEMA_PROPERTY_TYPE } from '../constants';
import { createTree } from '@keen.io/ui-core';
import { filterActions } from '../index';

/**
 * Preapares schema for selected event stream
 *
 * @param eventStream - Name of selected event stream
 * @return void
 *
 */
export function* prepareFilterTargetProperties({
  payload,
}: ReturnType<typeof filterActions.setEventStream>) {
  yield put(filterActions.setSchemaProcessing(true));
  const client = yield getContext(KEEN_ANALYSIS);

  try {
    const url = client.url(`/3.0/projects/{projectId}/events/${payload}`, {
      api_key: client.config.masterKey,
    });

    const { properties } = yield fetch(url).then((response) => response.json());
    const filteredProperties = {};

    Object.keys(properties)
      .filter(
        (propertyName) =>
          properties[propertyName] === FILTER_SCHEMA_PROPERTY_TYPE
      )
      .forEach(
        (propertyName) =>
          (filteredProperties[propertyName] = FILTER_SCHEMA_PROPERTY_TYPE)
      );

    const schemaTree = yield createTree(filteredProperties);
    const schemaList = Object.keys(filteredProperties).map((key: string) => ({
      path: key,
      type: filteredProperties[key],
    }));

    yield put(
      filterActions.setEventStreamSchema({
        schema: filteredProperties,
        schemaTree,
        schemaList,
      })
    );
    yield put(filterActions.setSchemaProcessingError(false));
  } catch (err) {
    yield put(filterActions.setSchemaProcessingError(true));
  } finally {
    yield put(filterActions.setSchemaProcessing(false));
  }
}
