import React, { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Alert, Button, ModalFooter } from '@keen.io/ui-core';

import {
  BoldMessage,
  Content,
  Container,
  ConnectionsContainer,
  CancelButton,
  Description,
  DetachedConnections,
  DetachedConnectionItem,
  EmptyConnections,
  ErrorContainer,
  FieldGroup,
  Field,
  FooterContent,
  NormalMessage,
} from './FilterSettings.styles';

import { EventStream, TargetProperty, TooltipHint } from './components';
import WidgetConnections from '../WidgetConnections';

import {
  applySettings,
  setEventStream,
  setTargetProperty,
  getFilterSettings,
  updateConnection,
} from '../../modules/filter';
import { getCurrentDashboardChartsCount } from '../../modules/dashboards';

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
  const chartWidgetsCount = useSelector(getCurrentDashboardChartsCount);

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

  const isDashboardWithoutCharts = chartWidgetsCount === 0;

  const emptyConnections =
    eventStreamsPool.length === 0 ||
    (widgetConnections.length === 0 && eventStream && targetProperty);

  return (
    <>
      <Container>
        <Content>
          {isDashboardWithoutCharts && (
            <ErrorContainer>
              <Alert type="info">
                {t('filter_settings.dashboard_without_charts')}
              </Alert>
            </ErrorContainer>
          )}
          {error === FilterSettingsError.IncompleteSettings && (
            <ErrorContainer>
              <Alert type="error">{t(ERRORS[error])}</Alert>
            </ErrorContainer>
          )}
          <Description marginBottom={15}>
            {t('filter_settings.description')}
            {isDashboardWithoutCharts && (
              <>
                <NormalMessage marginLeft="3px">
                  {t('filter_settings.description_property_types')}
                </NormalMessage>
              </>
            )}
          </Description>
          <FieldGroup>
            <Field width={200} marginRight={15}>
              <EventStream
                currentEventStream={eventStream}
                eventStreams={eventStreamsPool}
                isDisabled={isDashboardWithoutCharts}
                onChange={(stream) => dispatch(setEventStream(stream))}
              />
            </Field>
            <Field width={235}>
              <TargetProperty
                targetProperty={targetProperty}
                hasError={error === FilterSettingsError.SchemaCompute}
                isDisabled={
                  !eventStream || inProgress || isDashboardWithoutCharts
                }
                schema={schema}
                schemaList={schemaList}
                schemaTree={schemaTree}
                onChange={(property) => dispatch(setTargetProperty(property))}
              />
            </Field>
          </FieldGroup>
          <ConnectionsContainer>
            <Description marginBottom={15}>
              {t('filter_settings.connections_description')}
              <TooltipHint
                marginLeft="5px"
                renderMessage={() => (
                  <>
                    <div style={{ marginBottom: 10 }}>
                      {t('filter_settings.first_hint')}
                    </div>
                    {t('filter_settings.second_hint')}
                  </>
                )}
              />
            </Description>
            {(isDashboardWithoutCharts || !!emptyConnections) && (
              <EmptyConnections>
                {t('filter_settings.empty_connections')}
              </EmptyConnections>
            )}
            {availableConnections && (
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
            )}
          </ConnectionsContainer>
          {detachedConnections && (
            <>
              <Description marginTop={15} marginBottom={15}>
                {t('filter_settings.detached_widgets_description')}
                <TooltipHint
                  marginLeft="5px"
                  tooltipMode="dark"
                  renderMessage={() => (
                    <>
                      <div style={{ marginBottom: 10 }}>
                        {t('filter_settings.detached_widgets_first_hint')}
                      </div>
                      <BoldMessage>
                        {t('filter_settings.detached_widgets_second_hint')}
                      </BoldMessage>
                    </>
                  )}
                />
              </Description>
              <DetachedConnections>
                {detachedWidgetConnections.map(
                  ({ widgetId, positionIndex, title }) => (
                    <DetachedConnectionItem key={widgetId}>
                      {title
                        ? title
                        : `${t(
                            'filter_settings.untitled_chart'
                          )} ${positionIndex}`}
                    </DetachedConnectionItem>
                  )
                )}
              </DetachedConnections>
            </>
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
