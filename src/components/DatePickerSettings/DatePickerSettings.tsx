import React, { FC, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Icon } from '@keen.io/icons';
import { Button, Tooltip, ModalFooter } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

import {
  CancelButton,
  Content,
  Connections,
  Description,
  EmptyConnections,
  FooterContent,
  Hint,
  TooltipContent,
  TooltipMotion,
} from './DatePickerSettings.styles';
import WidgetConnections from '../WidgetConnections';

import {
  getDatePickerSettings,
  applySettings,
  updateConnection,
} from '../../modules/datePicker';

import { TOOLTIP_MOTION } from '../../constants';

type Props = {
  onCancel: () => void;
};

const DatePickerSettings: FC<Props> = ({ onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { widgetConnections } = useSelector(getDatePickerSettings);

  const [showHint, setHintVisibility] = useState(false);

  const isEmptyConnectionsList = widgetConnections.length === 0;

  return (
    <div>
      <Content>
        <Description>
          {t('date_picker_settings.description')}
          <Hint
            onMouseEnter={() => setHintVisibility(true)}
            onMouseLeave={() => setHintVisibility(false)}
          >
            <Icon
              width={16}
              height={16}
              type="question-mark"
              fill={colors.black[200]}
            />
            <AnimatePresence>
              {showHint && (
                <TooltipMotion {...TOOLTIP_MOTION}>
                  <Tooltip mode="light" hasArrow={false}>
                    <TooltipContent>
                      {t('date_picker_settings.tooltip_hint')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipMotion>
              )}
            </AnimatePresence>
          </Hint>
        </Description>
        {isEmptyConnectionsList ? (
          <EmptyConnections>
            {t('date_picker_settings.empty_connections')}
          </EmptyConnections>
        ) : (
          <Connections>
            <WidgetConnections
              connections={widgetConnections.map(
                ({ widgetId, isConnected, positionIndex, title }) => ({
                  id: widgetId,
                  isConnected,
                  title: title
                    ? title
                    : `${t(
                        'date_picker_settings.untitled_chart'
                      )} ${positionIndex}`,
                })
              )}
              onUpdateConnection={(widgetId, isConnected) =>
                dispatch(updateConnection(widgetId, isConnected))
              }
            />
          </Connections>
        )}
      </Content>
      <ModalFooter>
        <FooterContent>
          <Button variant="secondary" onClick={() => dispatch(applySettings())}>
            {t('date_picker_settings.confirm_button')}
          </Button>
          <CancelButton>
            <Button variant="secondary" style="outline" onClick={onCancel}>
              {t('date_picker_settings.cancel_button')}
            </Button>
          </CancelButton>
        </FooterContent>
      </ModalFooter>
    </div>
  );
};

export default DatePickerSettings;
