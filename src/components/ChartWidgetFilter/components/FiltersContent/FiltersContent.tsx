import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Timeframe } from '@keen.io/query';

import { Connector } from './FiltersContent.styles';

type Props = {
  /** Timeframe */
  timeframe?: Timeframe;
};

const FiltersContent: FC<Props> = ({}) => {
  const { t } = useTranslation();
  return (
    <>
      filters content
      <Connector>{t('dashboard_timepicker.connector')}</Connector>
    </>
  );
};

export default FiltersContent;
