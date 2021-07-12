import React, { FC, useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  ModalFooter,
  Input,
  MousePositionedTooltip,
} from '@keen.io/ui-core';

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
  setName,
} from '../../modules/filter';
import { getCurrentDashboardChartsCount } from '../../modules/dashboards';

import { ERRORS } from './constants';

import { FilterSettingsError } from './types';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';
import { AppContext } from '../../contexts';

type Props = {
  /* Cancel filter settings */
  onCancel: () => void;
};

const FilterSettings: FC<Props> = ({ onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [error, setError] = useState<FilterSettingsError>(null);

  const { modalContainer } = useContext(AppContext);

  const {
    widgetConnections,
    detachedWidgetConnections,
    eventStream,
    targetProperty,
    eventStreamsPool,
    eventStreamSchema,
    schemaProcessing,
    name,
  } = useSelector(getFilterSettings);

  const chartWidgetsCount = useSelector(getCurrentDashboardChartsCount);

  const [isEditMode] = useState(!!targetProperty);
  const [filterName, setFilterName] = useState(name);

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
                onChange={(property) => {
                  if (!filterName) {
                    setFilterName(property);
                  }
                  dispatch(setTargetProperty(property));
                }}
              />
            </Field>
          </FieldGroup>
          <Description marginTop={20} marginBottom={1}>
            {t('filter_settings.filter_display_name')}
          </Description>
          <Field width={300} marginRight={15}>
            <Input
              type="text"
              variant="solid"
              placeholder={t('filter_settings.filter_display_name_placeholder')}
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </Field>
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
          <MousePositionedTooltip
            isActive={!filterName}
            renderContent={() => (
              <BodyText
                variant="body2"
                fontWeight="normal"
                color={colors.white[500]}
              >
                ${t('filter_settings.enter_filter_name_first')}
              </BodyText>
            )}
            tooltipPortal={modalContainer}
            tooltipTheme="dark"
          >
            <Button
              variant="secondary"
              isDisabled={!filterName}
              onClick={() => {
                if (eventStream && targetProperty) {
                  setError(null);
                  dispatch(setName(filterName));
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
          </MousePositionedTooltip>
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
