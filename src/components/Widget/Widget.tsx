import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { Container } from './Widget.styles';

import PreventDragPropagation from '../PreventDragPropagation';
import ChartWidget from '../ChartWidget';

import { getWidget } from '../../modules/widgets';
import { RootState } from '../../rootReducer';

type Props = {
  /** Widget identifier */
  id: string;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
};

const Widget: FC<Props> = ({ id, onRemoveWidget }) => {
  const {
    widget: { id: widgetId },
  } = useSelector((rootState: RootState) => getWidget(rootState, id));

  return (
    <Container>
      <PreventDragPropagation>
        <div onClick={onRemoveWidget}>Remove</div>
      </PreventDragPropagation>
      <ChartWidget id={widgetId} />
    </Container>
  );
};

export default Widget;
