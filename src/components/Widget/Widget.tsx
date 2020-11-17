import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { Container } from './Widget.styles';

import { getWidget } from '../../modules/widgets';
import { RootState } from '../../rootReducer';

type Props = {
  /** Widget identifier */
  id: string;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
};

const Widget: FC<Props> = ({ id, onRemoveWidget }) => {
  const { data } = useSelector((rootState: RootState) =>
    getWidget(rootState, id)
  );

  console.log(data, 'sa');

  return (
    <Container>
      <div onClick={onRemoveWidget}>Remove</div>
      Widget {id}
    </Container>
  );
};

export default Widget;
