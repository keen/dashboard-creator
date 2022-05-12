import React, { FC, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { transparentize } from 'polished';
import { Icon } from '@keen.io/icons';
import { Button, Tooltip, ModalFooter, Input } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';
import { BodyText } from '@keen.io/typography';

import {
  CancelButton,
  Content,
  Connections,
  Description,
  FooterContent,
  Hint,
  TooltipContent,
  TooltipMotion,
  DisplayNameContainer,
  ToggleAll,
} from './DatePickerSettings.styles';
import WidgetConnections from '../WidgetConnections';

import {
  datePickerActions,
  datePickerSelectors,
} from '../../modules/datePicker';

import { TOOLTIP_MOTION } from '../../constants';
import { Field } from '../FilterSettings/FilterSettings.styles';

type Props = {
  onCancel: () => void;
};

const DatePickerSettings: FC<Props> = ({ onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { widgetConnections, name } = useSelector(
    datePickerSelectors.getDatePickerSettings
  );

  const [showHint, setHintVisibility] = useState(false);
  const isEmptyConnectionsList = widgetConnections.length === 0;
  const allConnectionsSelected =
    !isEmptyConnectionsList &&
    widgetConnections.every((item) => item.isConnected);

  const [filterName, setFilterName] = useState(name);

  const toggleSelectAll = () => {
    const updatedStatus = allConnectionsSelected ? false : true;

    for (const connection of widgetConnections) {
      dispatch(
        datePickerActions.updateConnection({
          widgetId: connection.widgetId,
          isConnected: updatedStatus,
        })
      );
    }
  };

  return (
    <div>
      <Content>
        <DisplayNameContainer>
          <Description marginBottom={1}>
            <BodyText
              variant="body2"
              fontWeight="bold"
              color={colors.black[100]}
            >
              {t('date_picker_settings.filter_display_name')}
            </BodyText>
          </Description>
          <Field width={300} marginRight={15}>
            <Input
              type="text"
              variant="solid"
              placeholder={t(
                'date_picker_settings.filter_display_name_placeholder'
              )}
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </Field>
        </DisplayNameContainer>
        <Description>
          <BodyText variant="body2" fontWeight="bold" color={colors.black[100]}>
            {t('date_picker_settings.description')}
          </BodyText>
          <Hint
            role="dialog"
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
                      <BodyText variant="body2" color={colors.black[100]}>
                        {t('date_picker_settings.tooltip_hint')}
                      </BodyText>
                    </TooltipContent>
                  </Tooltip>
                </TooltipMotion>
              )}
            </AnimatePresence>
          </Hint>
          {!isEmptyConnectionsList && (
            <ToggleAll onClick={toggleSelectAll}>
              <BodyText
                variant="body2"
                color={colors.blue[500]}
                fontWeight="bold"
              >
                {allConnectionsSelected
                  ? t('date_picker_settings.unselect_all')
                  : t('date_picker_settings.select_all')}
              </BodyText>
            </ToggleAll>
          )}
        </Description>
        {isEmptyConnectionsList ? (
          <BodyText
            variant="body2"
            color={transparentize(0.5, colors.black[100])}
          >
            {t('date_picker_settings.empty_connections')}
          </BodyText>
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
                dispatch(
                  datePickerActions.updateConnection({ widgetId, isConnected })
                )
              }
            />
          </Connections>
        )}
      </Content>
      <ModalFooter>
        <FooterContent>
          <Button
            variant="secondary"
            onClick={() => {
              dispatch(datePickerActions.setName({ name: filterName }));
              dispatch(datePickerActions.applySettings());
            }}
          >
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
