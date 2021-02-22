import React, { FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  DropdownList,
  DropdownListContainer,
  DropableContainer,
} from '@keen.io/ui-core';

import { Container } from './EventStream.styles';

type Props = {
  /** Current event stream  */
  currentEventStream: string;
  /** Collection of event streams  */
  eventStreams: string[];
  /** Event stream change event handler */
  onChange: (eventStream: string) => void;
  /** Disable state indicator */
  isDisabled: boolean;
};

const EventStream: FC<Props> = ({
  onChange,
  currentEventStream,
  eventStreams,
  isDisabled,
}) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  const options = useMemo(
    () =>
      eventStreams.map((eventStreamName: string) => ({
        label: eventStreamName,
        value: eventStreamName,
      })),
    [eventStreams]
  );

  return (
    <Container isDisabled={isDisabled}>
      <DropableContainer
        variant="secondary"
        placeholder={t('filter_settings.event_stream_placeholder')}
        onClick={() => !isOpen && !isDisabled && setOpen(true)}
        isActive={isOpen}
        value={currentEventStream}
        dropIndicator
        onDefocus={() => {
          setOpen(false);
        }}
      >
        {currentEventStream}
      </DropableContainer>
      <Dropdown isOpen={isOpen}>
        <DropdownListContainer scrollToActive maxHeight={240}>
          {(activeItemRef) => (
            <DropdownList
              ref={activeItemRef}
              items={options}
              setActiveItem={({ value }) => value === currentEventStream}
              onClick={(_e, { value }) => {
                if (currentEventStream !== value) {
                  onChange(value);
                }
              }}
            />
          )}
        </DropdownListContainer>
      </Dropdown>
    </Container>
  );
};

export default EventStream;
