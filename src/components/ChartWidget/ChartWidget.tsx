import React, { FC, useRef, useEffect } from 'react';
import { KeenDataviz } from '@keen.io/dataviz';

import { Container } from './ChartWidget.styles';

import { chartData } from './fixtures';

type Props = {};

const ChartWidget: FC<Props> = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    new KeenDataviz({
      container: containerRef.current,
      type: 'bar',
      settings: {
        labelSelector: 'name',
        keys: ['users', 'shops', 'books', 'licenses'],
        data: chartData,
      },
    }).render();
  }, []);

  return <Container ref={containerRef} />;
};

export default ChartWidget;
