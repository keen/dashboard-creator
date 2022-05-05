import React, { FC, useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { transparentize } from 'polished';
import {
  Alert,
  Button,
  ModalFooter,
  Input,
  MousePositionedTooltip,
} from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import {
  Content,
  Container,
  ConnectionsContainer,
  CancelButton,
  Description,
  DetachedConnections,
  ErrorContainer,
  FieldGroup,
  Field,
  FooterContent,
  ToggleAll,
} from './FilterSettings.styles';

import { EventStream, TargetProperty, TooltipHint } from './components';
import WidgetConnections from '../WidgetConnections';

import { ERRORS } from './constants';

import { FilterSettingsError } from './types';
import { AppContext } from '../../contexts';
import { filterActions, filterSelectors } from '../../modules/filter';
import { dashboardsSelectors } from '../../modules/dashboards';

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
  } = useSelector(filterSelectors.getFilterSettings);

  const chartWidgetsCount = useSelector(
    dashboardsSelectors.getCurrentDashboardChartsCount
  );

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
  const allConnectionsSelected =
    availableConnections && widgetConnections.every((item) => item.isConnected);
  const detachedConnections = detachedWidgetConnections.length > 0;

  const isDashboardWithoutCharts = chartWidgetsCount === 0;

  const emptyConnections =
    eventStreamsPool.length === 0 ||
    (widgetConnections.length === 0 && eventStream && targetProperty);

  const toggleSelectAll = () => {
    const updatedStatus = allConnectionsSelected ? false : true;

    for (const connection of widgetConnections) {
      dispatch(
        filterActions.updateConnection({
          widgetId: connection.widgetId,
          isConnected: updatedStatus,
        })
      );
    }
  };

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
            <BodyText
              variant="body2"
              color={colors.black[100]}
              fontWeight="bold"
            >
              {t('filter_settings.description')}
            </BodyText>
            {isDashboardWithoutCharts && (
              <>
                <div style={{ marginLeft: '3px' }}>
                  <BodyText
                    variant="body2"
                    color={colors.black[100]}
                    fontWeight={400}
                  >
                    {t('filter_settings.description_property_types')}
                  </BodyText>
                </div>
              </>
            )}
          </Description>
          <FieldGroup>
            <Field width={200} marginRight={15}>
              <EventStream
                currentEventStream={eventStream}
                eventStreams={eventStreamsPool}
                isDisabled={isDashboardWithoutCharts}
                onChange={(stream) =>
                  dispatch(filterActions.setEventStream(stream))
                }
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
                  dispatch(filterActions.setTargetProperty(property));
                }}
              />
            </Field>
          </FieldGroup>
          <Description marginTop={20} marginBottom={1}>
            <BodyText
              variant="body2"
              color={colors.black[100]}
              fontWeight="bold"
            >
              {t('filter_settings.filter_display_name')}
            </BodyText>
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
              <BodyText
                variant="body2"
                color={colors.black[100]}
                fontWeight="bold"
              >
                {t('filter_settings.connections_description')}
              </BodyText>
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
              {availableConnections && (
                <ToggleAll onClick={toggleSelectAll}>
                  <BodyText
                    variant="body2"
                    color={colors.blue[500]}
                    fontWeight="bold"
                  >
                    {allConnectionsSelected
                      ? t('filter_settings.unselect_all')
                      : t('filter_settings.select_all')}
                  </BodyText>
                </ToggleAll>
              )}
            </Description>
            {(isDashboardWithoutCharts || !!emptyConnections) && (
              <BodyText
                variant="body2"
                color={transparentize(0.5, colors.black[100])}
              >
                {t('filter_settings.empty_connections')}
              </BodyText>
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
                  dispatch(
                    filterActions.updateConnection({ widgetId, isConnected })
                  )
                }
              />
            )}
          </ConnectionsContainer>
          {detachedConnections && (
            <>
              <Description marginTop={15} marginBottom={15}>
                <BodyText
                  variant="body2"
                  color={colors.black[100]}
                  fontWeight="bold"
                >
                  {t('filter_settings.detached_widgets_description')}
                </BodyText>
                <TooltipHint
                  marginLeft="5px"
                  tooltipMode="light"
                  renderMessage={() => (
                    <>
                      <div style={{ marginBottom: 10 }}>
                        <BodyText
                          variant="body2"
                          color={colors.black[100]}
                          fontWeight={400}
                        >
                          {t('filter_settings.detached_widgets_first_hint')}
                        </BodyText>
                      </div>
                      <BodyText
                        variant="body2"
                        color={colors.black[100]}
                        fontWeight="bold"
                      >
                        {t('filter_settings.detached_widgets_second_hint')}
                      </BodyText>
                    </>
                  )}
                />
              </Description>
              <DetachedConnections>
                {detachedWidgetConnections.map(
                  ({ widgetId, positionIndex, title }) => (
                    <BodyText
                      key={widgetId}
                      variant="body2"
                      color={transparentize(0.5, colors.black[100])}
                    >
                      {title
                        ? title
                        : `${t(
                            'filter_settings.untitled_chart'
                          )} ${positionIndex}`}
                    </BodyText>
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
                color={colors.black[100]}
              >
                {t('filter_settings.enter_filter_name_first')}
              </BodyText>
            )}
            tooltipPortal={modalContainer}
            tooltipTheme="light"
          >
            <Button
              variant="secondary"
              isDisabled={!filterName}
              onClick={() => {
                if (eventStream && targetProperty) {
                  setError(null);
                  dispatch(filterActions.setName(filterName));
                  dispatch(filterActions.applySettings());
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
