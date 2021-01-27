import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { copyToClipboard } from '@keen.io/charts-utils';

import { Input, Button, Group } from './InputGroup.styles';

type Props = {
  value: string;
};

const InputGroup: FC<Props> = ({ value }) => {
  const { t } = useTranslation();

  return (
    <Group>
      <Input value={value} title={value} type="text" readOnly={true} />
      <Button onClick={() => copyToClipboard(value)}>
        {t('dashboard_share.copy')}
      </Button>
    </Group>
  );
};

export default InputGroup;
