import React, { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { colors } from '@keen.io/colors';
import { Button, CircleButton } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import {
  Cover,
  RemoveMotion,
  ButtonsContainer,
} from './ChartManagement.styles';

import RemoveWidget from '../../../RemoveWidget';
import PreventDragPropagation from '../../../PreventDragPropagation';

import { settingsMotion, removeMotion } from './motions';
import { DRAG_HANDLE_ELEMENT } from '../../constants';

type Props = {
  isHoverActive: boolean;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
};

const ChartManagement: FC<Props> = ({ isHoverActive, onRemoveWidget }) => {
  const { t } = useTranslation();
  const [removeConfirmation, setRemoveConfirmation] = useState(false);

  const showManagementSettings = isHoverActive && !removeConfirmation;
  const showRemoveConfirmation = isHoverActive && removeConfirmation;

  useEffect(() => {
    if (!isHoverActive && removeConfirmation) {
      setRemoveConfirmation(false);
    }
  }, [isHoverActive]);

  return (
    <>
      <AnimatePresence>
        {showRemoveConfirmation && (
          <RemoveMotion {...removeMotion}>
            <RemoveWidget
              onConfirm={onRemoveWidget}
              onDismiss={() => setRemoveConfirmation(false)}
            >
              {t('widget.remove_confirmation')}
            </RemoveWidget>
          </RemoveMotion>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showManagementSettings && (
          <Cover className={DRAG_HANDLE_ELEMENT} {...settingsMotion}>
            <ButtonsContainer>
              <PreventDragPropagation>
                <div data-testid="edit-chart">
                  <Button variant="blank" onClick={() => console.log('Edit')}>
                    {t('widget.edit_chart')}
                  </Button>
                </div>
              </PreventDragPropagation>
              <PreventDragPropagation>
                <div data-testid="delete-chart">
                  <CircleButton
                    variant="blank"
                    onClick={() => setRemoveConfirmation(true)}
                    icon={<Icon type="delete" fill={colors.red[500]} />}
                  />
                </div>
              </PreventDragPropagation>
              <PreventDragPropagation>
                <div data-testid="clone-chart">
                  <CircleButton
                    variant="blank"
                    onClick={() => console.log('Clone')}
                    icon={<Icon type="clone" fill={colors.black[500]} />}
                  />
                </div>
              </PreventDragPropagation>
            </ButtonsContainer>
          </Cover>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChartManagement;
