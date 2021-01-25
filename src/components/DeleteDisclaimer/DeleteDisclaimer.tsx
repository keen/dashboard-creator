import React, { FC, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@keen.io/ui-core';

import { Title, Message, Disclaimer } from './DeleteDisclaimer.styles';

import { DISCLAIMERS } from './constants';

type Props = {
  /** Change disclaimer event handler */
  onChange: (isAccepted: boolean) => void;
};

const DeleteDisclaimer: FC<Props> = ({ onChange }) => {
  const { t } = useTranslation();
  const [disclaimers, setDisclaimers] = useState<string[]>([]);

  const toggleDisclaimer = useCallback(
    (id: string) => {
      if (disclaimers.includes(id)) {
        setDisclaimers(
          disclaimers.filter((disclaimerId) => disclaimerId !== id)
        );
      } else {
        setDisclaimers([...disclaimers, id]);
      }
    },
    [disclaimers]
  );

  useEffect(() => {
    const isAccepted = DISCLAIMERS.every(({ id }) => disclaimers.includes(id));
    onChange(isAccepted);
  }, [disclaimers]);

  return (
    <div>
      <Title>{t('delete_public_dashboard.title')}</Title>
      {DISCLAIMERS.map(({ id, message }) => (
        <Disclaimer
          key={id}
          onClick={() => toggleDisclaimer(id)}
          data-testid={`disclaimer-${id}`}
        >
          <Checkbox
            id={id}
            type="secondary"
            checked={disclaimers.includes(id)}
          />
          <Message>{t(message)}</Message>
        </Disclaimer>
      ))}
    </div>
  );
};

export default DeleteDisclaimer;
