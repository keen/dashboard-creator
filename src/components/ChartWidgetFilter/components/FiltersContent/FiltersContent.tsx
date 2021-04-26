import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import { Container, Connector } from './FiltersContent.styles';
import TitleContainer from '../TitleContainer';
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
            <TitleContainer>
              <BodyText
                variant="body2"
                fontWeight="bold"
                color={colors.black[100]}
              >{`${capitalize(getPropertyName(propertyName))}:`}</BodyText>
            </TitleContainer>
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
