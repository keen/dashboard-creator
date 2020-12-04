import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Container } from './Widget.styles';

import PreventDragPropagation from '../PreventDragPropagation';
import ChartWidget from '../ChartWidget';

import { getWidget } from '../../modules/widgets';

import { DRAG_HANDLE_ELEMENT } from './constants';
import { RootState } from '../../rootReducer';

type Props = {
  /** Widget identifier */
  id: string;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
};

const Widget: FC<Props> = ({ id, onRemoveWidget }) => {
  const { t } = useTranslation();
  const {
    widget: { id: widgetId },
  } = useSelector((rootState: RootState) => getWidget(rootState, id));

  return (
    <Container>
      <div className={DRAG_HANDLE_ELEMENT}>DRAG ME</div>
      <PreventDragPropagation>
        <div onClick={onRemoveWidget}>{t('widget.remove')}</div>
      </PreventDragPropagation>
      <ChartWidget id={widgetId} />
    </Container>
  );
};

export default Widget;
