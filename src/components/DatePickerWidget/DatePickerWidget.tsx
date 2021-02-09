import React, {
  FC,
  useRef,
  useState,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { transparentize } from 'polished';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import {
  Button,
  Anchor,
  Dropdown,
  Portal,
  Tabs,
  RelativeTime,
  AbsoluteTime,
  Timezone,
  TIME_PICKER_CLASS,
} from '@keen.io/ui-core';

import TimeframeLabel from '../TimeframeLabel';
import {
  Container,
  Title,
  Bar,
  DropdownContainer,
  SettingsContainer,
  TitleContainer,
} from './DatePickerWidget.styles';

import {
  setDatePickerModifiers,
  clearDatePickerModifiers,
  applyDatePickerModifiers,
  getWidget,
} from '../../modules/widgets';

import { RootState } from '../../rootReducer';
import { AppContext } from '../../contexts';

import {
  convertRelativeTime,
  getDefaultAbsoluteTime,
  getEventPath,
} from './utils';

import {
  DEFAULT_TIMEFRAME,
  DEFAULT_TIMEZONE,
  ABSOLUTE_TAB,
  RELATIVE_TAB,
} from './constants';

type Props = {
  /** Widget identifier */
  id: string;
  /** Disable chart interactions */
  disableInteractions?: boolean;
};

const DatePickerWidget: FC<Props> = ({ id, disableInteractions }) => {
  const { t } = useTranslation();
  const { modalContainer } = useContext(AppContext);
  const dispatch = useDispatch();
  const { isActive, data } = useSelector((state: RootState) =>
    getWidget(state, id)
  );

  const initialData = {
    timeframe: data?.timeframe || DEFAULT_TIMEFRAME,
    timezone: data?.timezone || DEFAULT_TIMEZONE,
  };

  const [isOpen, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState({ x: 0, y: 0, width: 0 });
  const [localData, setLocalData] = useState(initialData);

  const containerRef = useRef(null);
  const dropdownContainerRef = useRef(null);

  const outsideClick = useCallback(
    (e) => {
      const path = getEventPath(e);
      if (
        !path?.includes(containerRef.current) &&
        !path?.includes(dropdownContainerRef.current) &&
        !path?.includes(document.querySelector(`.${TIME_PICKER_CLASS}`))
      ) {
        setOpen(false);
      }
    },
    [isOpen, containerRef, dropdownContainerRef]
  );

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const {
        left,
        bottom,
        width,
      }: ClientRect = containerRef.current.getBoundingClientRect();

      setDropdown((state) => ({
        ...state,
        x: left,
        y: bottom - document.body.offsetHeight + window.scrollY,
        width,
      }));
    }

    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, [isOpen, containerRef]);

  // const timeframe = data?.timeframe || DEFAULT_TIMEFRAME;
  // const timezone = data?.timezone || DEFAULT_TIMEZONE;

  const { timeframe, timezone } = localData;

  const TABS_SETTINGS = [
    {
      label: t('query_creator_timeframe.relative'),
      id: RELATIVE_TAB,
    },
    {
      label: t('query_creator_timeframe.absolute'),
      id: ABSOLUTE_TAB,
    },
  ];

  return (
    <>
      <Container
        ref={containerRef}
        onClick={() => {
          if (!disableInteractions) {
            // dispatch(setDatePickerModifiers(id, timeframe, timezone));
            setOpen(!isOpen);
          }
        }}
      >
        {isActive ? (
          <TimeframeLabel
            timeframe={data?.timeframe || timeframe}
            onRemove={(e) => {
              e.stopPropagation();
              dispatch(clearDatePickerModifiers(id));
              setLocalData(initialData);
              if (isOpen) setOpen(false);
            }}
          />
        ) : (
          <TitleContainer>
            <Icon
              type="date-picker"
              fill={transparentize(0.5, colors.black[100])}
              width={15}
              height={15}
            />
            <Title role="heading">{t('date_picker_widget.name')}</Title>
          </TitleContainer>
        )}
      </Container>
      <Portal modalContainer={modalContainer}>
        <DropdownContainer
          ref={dropdownContainerRef}
          customTransform={`translate(${dropdown.x}px, ${dropdown.y}px)`}
          width={dropdown.width}
        >
          <Dropdown isOpen={isOpen}>
            <Tabs
              key={`${id} - ${dropdown.x}`}
              activeTab={
                typeof timeframe === 'string' ? RELATIVE_TAB : ABSOLUTE_TAB
              }
              onClick={(tabId) => {
                if (tabId === RELATIVE_TAB) {
                  const customTimeframe =
                    typeof timeframe === 'string'
                      ? timeframe
                      : DEFAULT_TIMEFRAME;
                  // dispatch(
                  //   setDatePickerModifiers(id, customTimeframe, timezone)
                  // );
                  setLocalData((state) => ({
                    ...state,
                    timeframe: customTimeframe,
                  }));
                } else {
                  const customTimeframe = getDefaultAbsoluteTime(timezone);
                  // dispatch(
                  //   setDatePickerModifiers(id, customTimeframe, timezone)
                  // );
                  setLocalData((state) => ({
                    ...state,
                    timeframe: customTimeframe,
                  }));
                }
              }}
              tabs={TABS_SETTINGS}
            />
            <SettingsContainer>
              {typeof timeframe === 'string' ? (
                <RelativeTime
                  onChange={(timeframe) =>
                    // dispatch(setDatePickerModifiers(id, timeframe, timezone))
                    setLocalData((state) => ({
                      ...state,
                      timeframe,
                    }))
                  }
                  timeLabel="Last"
                  unitsPlaceholderLabel="Select"
                  relativityTitleLabel="Include current"
                  relativityTitleForTodayLabel="Include Today"
                  {...convertRelativeTime(timeframe)}
                />
              ) : (
                <AbsoluteTime
                  id={id}
                  {...timeframe}
                  timezone={timezone}
                  onChange={(timeframe) =>
                    // dispatch(setDatePickerModifiers(id, timeframe, timezone))
                    setLocalData((state) => ({
                      ...state,
                      timeframe,
                    }))
                  }
                  startDateLabel="From"
                  endDateLabel="to"
                />
              )}
            </SettingsContainer>
            <Timezone
              timezone={timezone}
              onChange={(timezone) =>
                // dispatch(setDatePickerModifiers(id, timeframe, timezone))
                setLocalData((state) => ({
                  ...state,
                  timezone,
                }))
              }
              timezoneLabel="Timezone"
              timezonePlaceholderLabel="Select timezone"
            />
            <Bar>
              <Button
                onClick={() => {
                  dispatch(setDatePickerModifiers(id, timeframe, timezone));
                  dispatch(applyDatePickerModifiers(id));
                  setOpen(false);
                }}
                size="small"
                variant="secondary"
              >
                {t('date_picker_widget.apply')}
              </Button>
              <Anchor
                onClick={() => {
                  dispatch(clearDatePickerModifiers(id));
                  setLocalData(initialData);
                  setOpen(false);
                }}
              >
                {t('date_picker_widget.clear')}
              </Anchor>
            </Bar>
          </Dropdown>
        </DropdownContainer>
      </Portal>
    </>
  );
};

export default DatePickerWidget;
