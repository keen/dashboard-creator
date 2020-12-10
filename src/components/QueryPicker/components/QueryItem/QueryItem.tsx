import React, { FC, useMemo } from 'react';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { Container, Name } from './QueryItem.styles';

import {
  getVisualizationIcon,
  QueryVisualization,
} from '../../../../modules/queries';

type Props = {
  /** Query name */
  name: string;
  /** Visualization settings */
  visualization: QueryVisualization;
  /** Click event handler */
  onClick: () => void;
};

const QueryItem: FC<Props> = ({ name, visualization, onClick }) => {
  const visualizationIcon = useMemo(
    () => getVisualizationIcon(visualization),
    []
  );

  return (
    <Container onClick={onClick} data-testid="query-item">
      <Icon
        type={visualizationIcon}
        width={16}
        height={16}
        fill={colors.blue[500]}
      />
      <Name>{name}</Name>
    </Container>
  );
};

export default QueryItem;
