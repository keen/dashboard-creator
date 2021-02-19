import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Alert, Button, ModalFooter } from '@keen.io/ui-core';

import {
  Content,
  Container,
  ConnectionsContainer,
  CancelButton,
  Description,
  ErrorContainer,
  FieldGroup,
  Field,
  FooterContent,
} from './FilterSettings.styles';

import { EventStream, TargetProperty } from './components';
import WidgetConnections from '../WidgetConnections';

import {
  applySettings,
  setEventStream,
  setTargetProperty,
  getFilterSettings,
  updateConnection,
} from '../../modules/filter';

import { ERRORS } from './constants';

import { FilterSettingsError } from './types';

type Props = {
  /* Cancel filter settings */
  onCancel: () => void;
};

const FilterSettings: FC<Props> = ({ onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [error, setError] = useState<FilterSettingsError>(null);

  const {
    widgetConnections,
    detachedWidgetConnections,
    eventStream,
    targetProperty,
    eventStreamsPool,
    eventStreamSchema,
    schemaProcessing,
  } = useSelector(getFilterSettings);

  const [isEditMode] = useState(!!targetProperty);

  const { inProgress, error: schemaError } = schemaProcessing;
  const { schema, tree: schemaTree, list: schemaList } = eventStreamSchema;

  useEffect(() => {
    if (schemaError) {
      setError(FilterSettingsError.SchemaCompute);
    }
  }, [schemaError]);

  const availableConnections = widgetConnections.length > 0;
  const detachedConnections = detachedWidgetConnections.length > 0;

  const emptyConnections =
    eventStreamsPool.length === 0 ||
    (widgetConnections.length === 0 && eventStream && targetProperty);

  return (
    <>
      <Container>
        <Content>
          {error && (
            <ErrorContainer>
              <Alert type="error">{t(ERRORS[error])}</Alert>
            </ErrorContainer>
          )}
          <Description marginBottom={15}>
            {t('filter_settings.description')}
          </Description>
          <FieldGroup>
            <Field width={200} marginRight={15}>
              <EventStream
                currentEventStream={eventStream}
                eventStreams={eventStreamsPool}
                onChange={(stream) => dispatch(setEventStream(stream))}
              />
            </Field>
            <Field width={235}>
              <TargetProperty
                targetProperty={targetProperty}
                isDisabled={!eventStream || inProgress}
                schema={schema}
                schemaList={schemaList}
                schemaTree={schemaTree}
                onChange={(property) => dispatch(setTargetProperty(property))}
              />
            </Field>
          </FieldGroup>
          {emptyConnections && (
            <ConnectionsContainer>
              <Description>
                {t('filter_settings.empty_connections')}
              </Description>
            </ConnectionsContainer>
          )}
          {availableConnections && (
            <ConnectionsContainer>
              <Description marginBottom={15}>
                {t('filter_settings.connections_description')}
              </Description>
              <WidgetConnections
                connections={widgetConnections.map(
                  ({ widgetId, isConnected, positionIndex, title }) => ({
                    id: widgetId,
                    isConnected,
                    title: title
                      ? title
                      : `${t(
                          'filter_settings.untitled_chart'
                        )} ${positionIndex}`,
                  })
                )}
                onUpdateConnection={(widgetId, isConnected) =>
                  dispatch(updateConnection(widgetId, isConnected))
                }
              />
            </ConnectionsContainer>
          )}
          {detachedConnections && (
            <div>
              <Description marginTop={15} marginBottom={15}>
                {t('filter_settings.detached_widgets_description')}
              </Description>

              <WidgetConnections
                connections={detachedWidgetConnections.map(
                  ({ widgetId, isConnected, positionIndex, title }) => ({
                    id: widgetId,
                    isConnected,
                    title: title
                      ? title
                      : `${t(
                          'filter_settings.untitled_chart'
                        )} ${positionIndex}`,
                  })
                )}
                onUpdateConnection={() => {
                  //dispatch(updateConnection(widgetId, isConnected))
                }}
              />
            </div>
          )}
        </Content>
      </Container>
      <ModalFooter>
        <FooterContent>
          <Button
            variant="secondary"
            onClick={() => {
              if (eventStream && targetProperty) {
                setError(null);
                dispatch(applySettings());
              } else {
                setError(FilterSettingsError.IncompleteSettings);
              }
            }}
          >
            {isEditMode
              ? t('filter_settings.edit_button')
              : t('filter_settings.create_button')}
          </Button>
          <CancelButton>
            <Button variant="secondary" style="outline" onClick={onCancel}>
              {t('filter_settings.cancel_button')}
            </Button>
          </CancelButton>
        </FooterContent>
      </ModalFooter>
    </>
  );
};

export default FilterSettings;
