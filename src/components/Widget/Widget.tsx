import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { Container } from './Widget.styles';

import { ChartManagement } from './components';
import ChartWidget from '../ChartWidget';

import { getWidget } from '../../modules/widgets';

import { RootState } from '../../rootReducer';
import { RenderOptions } from './types';

type Props = {
  /** Widget identifier */
  id: string;
  /** Widget hover indicator */
  isHoverActive: boolean;
  /** Disable interactions on charts */
  disableInteractions?: boolean;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
};

const renderWidget = ({
  widgetType,
  widgetId,
  disableInteractions,
  isHoverActive,
  onRemoveWidget,
}: RenderOptions) => {
  switch (widgetType) {
    case 'visualization':
      return (
        <>
          <ChartWidget
            id={widgetId}
            disableInteractions={disableInteractions}
          />
          <ChartManagement
            widgetId={widgetId}
            isHoverActive={isHoverActive}
            onRemoveWidget={onRemoveWidget}
          />
        </>
      );
    default:
      return null;
  }
};

const Widget: FC<Props> = ({
  id,
  isHoverActive,
  onRemoveWidget,
  disableInteractions = false,
}) => {
  const {
    error,
    widget: { id: widgetId, type: widgetType },
  } = useSelector((rootState: RootState) => getWidget(rootState, id));

  return (
    <Container>
      {error ? (
        <>{error}</>
      ) : (
        <>
          {renderWidget({
            widgetType,
            widgetId,
            disableInteractions,
            isHoverActive,
            onRemoveWidget,
          })}
        </>
      )}
    </Container>
  );
};

export default Widget;
