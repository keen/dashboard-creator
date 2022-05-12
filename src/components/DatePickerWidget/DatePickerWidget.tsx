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
  convertRelativeTime,
  MousePositionedTooltip,
  TimezoneError,
} from '@keen.io/ui-core';
import { getDefaultAbsoluteTime } from '@keen.io/time-utils';
import { BodyText } from '@keen.io/typography';

import TimeframeLabel from '../TimeframeLabel';
import {
  Container,
  Bar,
  SettingsContainer,
  TitleContainer,
  ErrorContainer,
  IconWrapper,
} from './DatePickerWidget.styles';
import TimezoneLoader from './components/TimezoneLoader';
import { DEFAULT_TIMEFRAME, ABSOLUTE_TAB, RELATIVE_TAB } from './constants';

import {
  DatePickerWidget as DatePickerWidgetType,
  widgetsActions,
  widgetsSelectors,
} from '../../modules/widgets';

import { RootState } from '../../rootReducer';
import { AppContext } from '../../contexts';

import { getEventPath, getRelativeBoundingRect } from '../../utils';

import { getTimezoneState } from '../../modules/timezone';
import { DEFAULT_TIMEZONE, DROPDOWN_CONTAINER_ID } from '../../constants';

type Props = {
  /** Widget identifier */
  id: string;
  /** Disable chart interactions */
  disableInteractions?: boolean;
  /** Minimal dropdown width */
  minDropdownWidth?: number;
};

const DatePickerWidget: FC<Props> = ({
  id,
  disableInteractions,
  minDropdownWidth = 320,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { modalContainer, widgetsConfiguration } = useContext(AppContext);
  const { isActive, data, widget } = useSelector((state: RootState) =>
    widgetsSelectors.getWidget(state, id)
  );
  const datePickerWidget = widget as DatePickerWidgetType;

  const datePickerConfiguration = widgetsConfiguration?.datePicker;

  const initialData = {
    timeframe: data?.timeframe || DEFAULT_TIMEFRAME,
    timezone:
      data?.timezone ||
      datePickerConfiguration?.defaultTimezone ||
      DEFAULT_TIMEZONE,
  };

  const [isOpen, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState({ top: 0, left: 0, width: 0 });
  const [localData, setLocalData] = useState(initialData);

  const containerRef = useRef(null);
  const dropdownContainerRef = useRef(null);

  const { timezones, isLoading, error } = useSelector(getTimezoneState);

  const getDropdownXPositionThatFitsViewport = (left, right, dropdownWidth) => {
    if (window && window.innerWidth < left + dropdownWidth) {
      return right - dropdownWidth;
    }
    return left;
  };

  const outsideClick = useCallback(
    (e) => {
      const path = getEventPath(e);
      if (
        !path?.includes(containerRef.current) &&
        !path?.includes(dropdownContainerRef.current)
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
        right,
        bottom,
        width: parentWidth,
      } = getRelativeBoundingRect(DROPDOWN_CONTAINER_ID, containerRef.current);

      const dropdownWidth =
        parentWidth > minDropdownWidth ? parentWidth : minDropdownWidth;

      setDropdown((state) => ({
        ...state,
        left: getDropdownXPositionThatFitsViewport(
          left,
          right,
          minDropdownWidth
        ),
        top: bottom,
        width: dropdownWidth,
      }));
    }

    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, [isOpen, containerRef]);

  const { timeframe, timezone } = localData;

  const TABS_SETTINGS = [
    {
      label: t('date_picker_widget.relative'),
      id: RELATIVE_TAB,
    },
    {
      label: t('date_picker_widget.absolute'),
      id: ABSOLUTE_TAB,
    },
  ];

  return (
    <>
      <Container
        data-testid="dropable-container"
        ref={containerRef}
        isOpen={isOpen}
        onClick={() => {
          if (!disableInteractions) {
            setOpen(!isOpen);
          }
        }}
      >
        {isActive ? (
          <TimeframeLabel
            timeframe={data?.timeframe || timeframe}
            timezone={data?.timezone || timezone}
            onRemove={(e) => {
              e.stopPropagation();
              dispatch(widgetsActions.clearDatePickerModifiers(id));
              setLocalData(initialData);
              if (isOpen) setOpen(false);
            }}
          />
        ) : (
          <TitleContainer>
            <IconWrapper>
              <Icon
                type="date-picker"
                fill={transparentize(0.6, colors.blue[500])}
                width={13}
                height={13}
              />
            </IconWrapper>
            <BodyText
              variant="body2"
              fontWeight="bold"
              enableTextEllipsis
              role="heading"
            >
              {datePickerWidget.settings.name || t('date_picker_widget.name')}
            </BodyText>
          </TitleContainer>
        )}
      </Container>
      <Portal modalContainer={`#${DROPDOWN_CONTAINER_ID}`}>
        <div ref={dropdownContainerRef}>
          <Dropdown
            key={`${id} - ${dropdown.width}`}
            isOpen={isOpen}
            positionRelativeToDocument
            motion={{
              initial: {
                opacity: 0,
                top: dropdown.top + 20,
                left: dropdown.left,
                width: dropdown.width,
              },
              animate: {
                opacity: 1,
                top: dropdown.top,
                left: dropdown.left,
                width: dropdown.width,
              },
              exit: {
                opacity: 0,
                top: dropdown.top + 20,
                left: dropdown.left,
                width: dropdown.width,
              },
            }}
          >
            <Tabs
              activeTab={
                typeof timeframe === 'string' ? RELATIVE_TAB : ABSOLUTE_TAB
              }
              onClick={(tabId) => {
                if (tabId === RELATIVE_TAB) {
                  const customTimeframe =
                    typeof timeframe === 'string'
                      ? timeframe
                      : DEFAULT_TIMEFRAME;
                  setLocalData((state) => ({
                    ...state,
                    timeframe: customTimeframe,
                  }));
                } else {
                  const customTimeframe = getDefaultAbsoluteTime();
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
                  disableAutoFocus
                  onChange={(timeframe) =>
                    setLocalData((state) => ({
                      ...state,
                      timeframe,
                    }))
                  }
                  timeLabel={t('date_picker_widget.time')}
                  unitsPlaceholderLabel={t(
                    'date_picker_widget.units_placeholder'
                  )}
                  relativityTitleLabel={t(
                    'date_picker_widget.relativity_title'
                  )}
                  relativityTitleForTodayLabel={t(
                    'date_picker_widget.relativity_title_today'
                  )}
                  {...convertRelativeTime(timeframe)}
                />
              ) : (
                <AbsoluteTime
                  id={id}
                  {...timeframe}
                  timezone={timezone}
                  onChange={(timeframe) =>
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
            <div data-testid="timezone-select">
              {isLoading ? (
                <TimezoneLoader
                  message={t('date_picker_widget_timezone.loading')}
                />
              ) : (
                <>
                  {error ? (
                    <ErrorContainer>
                      <TimezoneError
                        tooltipPortal={modalContainer}
                        tooltipMessage={t('date_picker_widget_timezone.error')}
                        placeholder={t(
                          'date_picker_widget_timezone.select_timezone'
                        )}
                        label={t('date_picker_widget_timezone.timezone')}
                      />
                    </ErrorContainer>
                  ) : (
                    <MousePositionedTooltip
                      renderContent={() => (
                        <BodyText variant="body3" fontWeight="normal">
                          {t(
                            'date_picker_widget_timezone.selection_disabled_description'
                          )}
                        </BodyText>
                      )}
                      isActive={
                        datePickerConfiguration?.disableTimezoneSelection
                      }
                      tooltipPortal={modalContainer}
                    >
                      <Timezone
                        timezone={timezone}
                        timezones={timezones}
                        disableSelection={
                          datePickerConfiguration?.disableTimezoneSelection
                        }
                        emptySearchLabel={t(
                          'date_picker_widget_timezone.empty_search'
                        )}
                        onChange={(timezone) => {
                          setLocalData((state) => ({
                            ...state,
                            timezone,
                          }));
                        }}
                        timezoneLabel={t(
                          'date_picker_widget_timezone.timezone'
                        )}
                        timezonePlaceholderLabel={t(
                          'date_picker_widget_timezone.select_timezone'
                        )}
                      />
                    </MousePositionedTooltip>
                  )}
                </>
              )}
            </div>

            <Bar>
              <Button
                onClick={() => {
                  dispatch(
                    widgetsActions.setDatePickerModifiers(
                      id,
                      timeframe,
                      timezone
                    )
                  );
                  dispatch(widgetsActions.applyDatePickerModifiers(id));
                  setOpen(false);
                }}
                size="small"
                variant="secondary"
              >
                {t('date_picker_widget.apply')}
              </Button>
              <Anchor
                onClick={() => {
                  dispatch(widgetsActions.clearDatePickerModifiers(id));
                  setLocalData(initialData);
                  setOpen(false);
                }}
              >
                {t('date_picker_widget.clear')}
              </Anchor>
            </Bar>
          </Dropdown>
        </div>
      </Portal>
    </>
  );
};

export default DatePickerWidget;
