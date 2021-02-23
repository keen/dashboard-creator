import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Container, Connector } from './FiltersContent.styles';
import Title from '../Title';
import FilterValue from '../FilterValue';

import { capitalize, getPropertyName } from './utils';

import { FilterMeta } from '../../types';

type Props = {
  /** Filters meta */
  data: FilterMeta[];
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
