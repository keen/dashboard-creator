import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, ModalFooter } from '@keen.io/ui-core';

import {
  Container,
  CancelButton,
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

type Props = {
  /* Cancel filter settings */
  onCancel: () => void;
};

const FilterSettings: FC<Props> = ({ onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    widgetConnections,
    eventStream,
    targetProperty,
    eventStreamsPool,
    eventStreamSchema,
    schemaProcessing,
  } = useSelector(getFilterSettings);

  const { inProgress, error: schemaError } = schemaProcessing;

  return (
    <>
      <Container>
        {inProgress && <div>Preapering schema</div>}
        {schemaError && <div>schema error</div>}
        <EventStream
          currentEventStream={eventStream}
          eventStreams={eventStreamsPool}
          onChange={(stream) => dispatch(setEventStream(stream))}
        />
        <TargetProperty
          targetProperty={targetProperty}
          schema={eventStreamSchema}
          onChange={(property) => dispatch(setTargetProperty(property))}
        />
        <WidgetConnections
          connections={widgetConnections.map(
            ({ widgetId, isConnected, positionIndex, title }) => ({
              id: widgetId,
              isConnected,
              title: title
                ? title
                : `${t('filter_settings.untitled_chart')} ${positionIndex}`,
            })
          )}
          onUpdateConnection={(widgetId, isConnected) =>
            dispatch(updateConnection(widgetId, isConnected))
          }
        />
      </Container>
      <ModalFooter>
        <FooterContent>
          <Button
            variant="secondary"
            isDisabled={!eventStream && !targetProperty}
            onClick={() => dispatch(applySettings())}
          >
            {t('filter_settings.create_button')}
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
