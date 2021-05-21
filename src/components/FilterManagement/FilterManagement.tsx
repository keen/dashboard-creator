import React, { FC, useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { colors } from '@keen.io/colors';
import { Button, CircleButton } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';

import {
  DragHandle,
  RemoveContainer,
  ManagementContainer,
  ButtonsContainer,
} from './FilterManagement.styles';

import RemoveWidget from '../RemoveWidget';
import PreventDragPropagation from '../PreventDragPropagation';
import { DRAG_HANDLE_ELEMENT } from '../Widget';

import { settingsMotion } from './motions';
import {
  REMOVE_MIN_WIDTH,
  MANAGEMENT_MIN_WIDTH,
  INITIAL_OVERFLOW_SETTINGS,
} from './constants';

type Props = {
  /** Widget identifier */
  id: string;
  /** Hover state indicator */
  isHoverActive: boolean;
  /** Remove widget event handler */
  onRemoveWidget: () => void;
  /** Edit widget event handler */
  onEditWidget: () => void;
};

const FilterManagement: FC<Props> = ({
  isHoverActive,
  onRemoveWidget,
  onEditWidget,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [removeConfirmation, setRemoveConfirmation] = useState(false);
  const [overflowSettings, setOverflowSettings] = useState(
    INITIAL_OVERFLOW_SETTINGS
  );

  useEffect(() => {
    if (!isHoverActive) {
      setRemoveConfirmation(false);
    }
    if (isHoverActive && containerRef.current) {
      setOverflowSettings({
        management:
          containerRef.current.getBoundingClientRect().left +
            MANAGEMENT_MIN_WIDTH >
          document.body.offsetWidth,
        remove:
          containerRef.current.getBoundingClientRect().left + REMOVE_MIN_WIDTH >
          document.body.offsetWidth,
      });
    }
  }, [isHoverActive]);

  const showManagementSettings = isHoverActive && !removeConfirmation;
  const showRemoveConfirmation = isHoverActive && removeConfirmation;

  return (
    <div ref={containerRef}>
      <AnimatePresence>
        {showRemoveConfirmation && (
          <RemoveContainer
            isOverflow={overflowSettings.remove}
            {...settingsMotion}
          >
            <RemoveWidget
              onConfirm={onRemoveWidget}
              onDismiss={() => setRemoveConfirmation(false)}
            >
              {t('filter_management.delete_confirmation')}
            </RemoveWidget>
          </RemoveContainer>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showManagementSettings && (
          <ManagementContainer
            isOverflow={overflowSettings.management}
            className={DRAG_HANDLE_ELEMENT}
            {...settingsMotion}
          >
            <DragHandle>
              <Icon
                type="drag"
                width={15}
                height={15}
                fill={colors.white[500]}
              />
            </DragHandle>
            <ButtonsContainer>
              <PreventDragPropagation>
                <Button variant="blank" onClick={onEditWidget}>
                  {t('filter_management.edit_text')}
                </Button>
              </PreventDragPropagation>
              <PreventDragPropagation>
                <div data-testid="remove-filter-widget">
                  <CircleButton
                    variant="blank"
                    onClick={() => setRemoveConfirmation(true)}
                    icon={<Icon type="delete" fill={colors.red[500]} />}
                  />
                </div>
              </PreventDragPropagation>
            </ButtonsContainer>
          </ManagementContainer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterManagement;
