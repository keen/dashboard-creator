import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { colors } from '@keen.io/colors';
import { Button, CircleButton } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import { Container, Cover, ButtonsContainer } from './Widget.styles';

import PreventDragPropagation from '../PreventDragPropagation';
import ChartWidget from '../ChartWidget';

import { getWidget } from '../../modules/widgets';

import { DRAG_HANDLE_ELEMENT } from './constants';
import { RootState } from '../../rootReducer';

type Props = {
  /** Widget identifier */
  id: string;
  /** Show cover with editing buttons */
  showCover: boolean;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
};

const Widget: FC<Props> = ({ id, showCover, onRemoveWidget }) => {
  const { t } = useTranslation();
  const {
    widget: { id: widgetId },
  } = useSelector((rootState: RootState) => getWidget(rootState, id));

  return (
    <Container>
      <ChartWidget id={widgetId} />
      <Cover className={DRAG_HANDLE_ELEMENT} enabled={showCover}>
        <ButtonsContainer>
          <PreventDragPropagation>
            <Button variant="blank" onClick={() => console.log('Edit')}>
              {t('widget.edit_chart')}
            </Button>
          </PreventDragPropagation>
          <PreventDragPropagation>
            <CircleButton
              variant="blank"
              onClick={onRemoveWidget}
              icon={<Icon type="delete" fill={colors.red[500]} />}
            />
          </PreventDragPropagation>
          <PreventDragPropagation>
            <CircleButton
              variant="blank"
              onClick={() => console.log('Clone')}
              icon={<Icon type="clone" fill={colors.black[500]} />}
            />
          </PreventDragPropagation>
        </ButtonsContainer>
      </Cover>
    </Container>
  );
};

export default Widget;
