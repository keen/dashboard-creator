import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Title from '../Title';
import FilterValue from '../FilterValue';
import { Container, Connector } from './FiltersContent.styles';

import { FiltersData } from './types';
import { capitalize, getPropertyName } from './utils';

type Props = {
  /** Filters data */
  data: FiltersData[];
};

const FiltersContent: FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  return (
    <Container>
      {data.map((item, index, arr) => {
        const { propertyName, propertyValue } = item;
        return (
          <div key={`${propertyName}-${propertyValue}`}>
            <Title>{`${capitalize(getPropertyName(propertyName))}:`}</Title>
            <FilterValue propertyValue={propertyValue} />
            {index < arr.length - 1 && (
              <Connector>{t('dashboard_timepicker.connector')}</Connector>
            )}
          </div>
        );
      })}
    </Container>
  );
};

export default FiltersContent;
