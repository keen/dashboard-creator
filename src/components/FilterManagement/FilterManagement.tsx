import React, { FC, useEffect, useState } from 'react';
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
  // const dispatch = useDispatch();
  const [removeConfirmation, setRemoveConfirmation] = useState(false);

  useEffect(() => {
    if (!isHoverActive) {
      setRemoveConfirmation(false);
    }
  }, [isHoverActive]);

  const showManagementSettings = isHoverActive && !removeConfirmation;
  const showRemoveConfirmation = isHoverActive && removeConfirmation;

  return (
    <>
      <AnimatePresence>
        {showRemoveConfirmation && (
          <RemoveContainer {...settingsMotion}>
            <RemoveWidget
              onConfirm={onRemoveWidget}
              onDismiss={() => setRemoveConfirmation(false)}
            >
              {t('date_picker_management.delete_confirmation')}
            </RemoveWidget>
          </RemoveContainer>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showManagementSettings && (
          <ManagementContainer
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
                  {t('date_picker_management.edit_text')}
                </Button>
              </PreventDragPropagation>
              <PreventDragPropagation>
                <div data-testid="remove-date-picker-widget">
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
    </>
  );
};

export default FilterManagement;
